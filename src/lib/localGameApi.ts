import { getDeviceId } from "@/lib/device";

type Result = { status: number; body: unknown };
type StoredMessage = {
  id: number;
  thread_id: string;
  sender: "me" | "them";
  body: string;
  status: "sent" | "delivered" | "read" | "unsent";
  deliver_at: number;
  read_at: number | null;
  unsend_after_min: number | null;
  unsent_at: number | null;
  typing_cycles: number;
};
type LocalSave = {
  gameState: Record<string, unknown> | null;
  dmMessages: StoredMessage[];
  calendarEvents: Record<string, unknown>[];
  clueDiscoveries: string[];
};
type SaveSlot = { deviceId: string; pinHash: string };

const SLOT_KEY = "taesan-local-slots-v1";
const SAVE_PREFIX = "taesan-local-save-v1:";
const THREAD_IDS = new Set(["sanghyuk", "donghyun", "jaehyun", "seongho"]);
const CALENDAR_KINDS = new Set(["school", "festival", "club", "exam", "council", "personal"]);

function json(body: unknown, status = 200): Result {
  return { status, body };
}

function emptySave(): LocalSave {
  return { gameState: null, dmMessages: [], calendarEvents: [], clueDiscoveries: [] };
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function readSave(deviceId: string): LocalSave {
  return readJson(`${SAVE_PREFIX}${deviceId}`, emptySave());
}

function writeSave(deviceId: string, save: LocalSave) {
  window.localStorage.setItem(`${SAVE_PREFIX}${deviceId}`, JSON.stringify(save));
}

async function hashPin(name: string, pin: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${name}:${pin}`));
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function claimSlot(payload: Record<string, unknown>): Promise<Result> {
  const name = typeof payload.name === "string" ? payload.name.trim().normalize("NFC") : "";
  const pin = typeof payload.pin === "string" ? payload.pin : "";
  if (!name || name.length > 12 || !/^\d{4}$/.test(pin)) {
    return json({ error: "이름(1~12자)과 숫자 4자리를 넣어 주세요." }, 400);
  }

  const slots = readJson<Record<string, SaveSlot>>(SLOT_KEY, {});
  const pinHash = await hashPin(name, pin);
  const existing = slots[name];
  if (existing && existing.pinHash !== pinHash) {
    return json(
      {
        error: "이 이름으로 저장한 비밀번호와 달라요. 다른 이름을 쓰거나 비밀번호를 확인해 주세요.",
      },
      403,
    );
  }

  const deviceId = existing?.deviceId ?? crypto.randomUUID();
  if (!existing) {
    slots[name] = { deviceId, pinHash };
    window.localStorage.setItem(SLOT_KEY, JSON.stringify(slots));
  }
  if (!window.localStorage.getItem(`${SAVE_PREFIX}${deviceId}`)) {
    writeSave(deviceId, emptySave());
  }
  return json({ deviceId, resumed: Boolean(existing) });
}

function requireDeviceId(body: Record<string, unknown>): string | null {
  const id = typeof body.deviceId === "string" ? body.deviceId : "";
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) ? id : null;
}

function handleLocalAction(body: Record<string, unknown>): Result {
  if (body.action === "claimSlot") return json(null, 500);
  const deviceId = requireDeviceId(body);
  if (!deviceId)
    return json({ error: "저장 기기를 확인하지 못했어요. 이름을 다시 입력해 주세요." }, 400);
  const save = readSave(deviceId);
  const payload =
    body.payload && typeof body.payload === "object"
      ? (body.payload as Record<string, unknown>)
      : {};

  switch (body.action) {
    case "load": {
      const now = typeof save.gameState?.t === "number" ? save.gameState.t : -1;
      return json({
        gameState: save.gameState,
        calendarEvents: save.calendarEvents,
        dmMessages: save.dmMessages.filter((message) => message.deliver_at <= now),
      });
    }
    case "saveState": {
      const run = payload.run;
      if (
        !run ||
        typeof run !== "object" ||
        Array.isArray(run) ||
        JSON.stringify(run).length > 100_000
      ) {
        return json({ error: "게임 저장 내용이 올바르지 않아요." }, 400);
      }
      save.gameState = run as Record<string, unknown>;
      writeSave(deviceId, save);
      return json({ ok: true });
    }
    case "sendDm": {
      const threadId = typeof payload.threadId === "string" ? payload.threadId : "";
      const text = typeof payload.body === "string" ? payload.body.trim() : "";
      const now = typeof payload.now === "number" ? payload.now : save.gameState?.t;
      if (!THREAD_IDS.has(threadId) || !text || text.length > 300 || typeof now !== "number") {
        return json({ error: "메시지를 저장하지 못했어요." }, 400);
      }
      const id = Math.max(0, ...save.dmMessages.map((message) => message.id)) + 1;
      save.dmMessages.push({
        id,
        thread_id: threadId,
        sender: "me",
        body: text,
        status: "sent",
        deliver_at: now,
        read_at: null,
        unsend_after_min: null,
        unsent_at: null,
        typing_cycles: 0,
      });
      writeSave(deviceId, save);
      return json({ ok: true });
    }
    case "openThread": {
      const threadId = typeof payload.threadId === "string" ? payload.threadId : "";
      const now = typeof payload.now === "number" ? payload.now : save.gameState?.t;
      if (!THREAD_IDS.has(threadId) || typeof now !== "number") {
        return json({ error: "대화방을 열지 못했어요." }, 400);
      }
      save.dmMessages = save.dmMessages.map((message) => {
        if (message.thread_id !== threadId || message.deliver_at > now) return message;
        if (message.sender === "me" && message.status === "sent") {
          return { ...message, status: "read", read_at: now };
        }
        if (message.sender === "them" && message.read_at === null) {
          return { ...message, read_at: now };
        }
        return message;
      });
      writeSave(deviceId, save);
      return json({ ok: true });
    }
    case "addDmReplies": {
      const threadId = typeof payload.threadId === "string" ? payload.threadId : "";
      const messages = Array.isArray(payload.messages) ? payload.messages : [];
      const now = typeof payload.now === "number" ? payload.now : save.gameState?.t;
      if (!THREAD_IDS.has(threadId) || typeof now !== "number" || messages.length > 3) {
        return json({ error: "답장을 저장하지 못했어요." }, 400);
      }
      let offset = 0;
      for (const raw of messages) {
        if (!raw || typeof raw !== "object") continue;
        const message = raw as Record<string, unknown>;
        const text = typeof message.text === "string" ? message.text : "";
        const delay = typeof message.delay_min === "number" ? message.delay_min : 0;
        offset += delay;
        const id = Math.max(0, ...save.dmMessages.map((row) => row.id)) + 1;
        save.dmMessages.push({
          id,
          thread_id: threadId,
          sender: "them",
          body: text,
          status: "delivered",
          deliver_at: now + offset,
          read_at: null,
          unsend_after_min:
            typeof message.unsend_after_min === "number" ? message.unsend_after_min : null,
          unsent_at: null,
          typing_cycles: typeof message.typing_cycles === "number" ? message.typing_cycles : 0,
        });
      }
      if (payload.read_now === true) {
        save.dmMessages = save.dmMessages.map((message) =>
          message.thread_id === threadId &&
          message.sender === "me" &&
          message.status === "sent" &&
          message.deliver_at <= now
            ? { ...message, status: "read", read_at: now }
            : message,
        );
      }
      writeSave(deviceId, save);
      return json({ ok: true });
    }
    case "saveCalendarEvent": {
      const title = typeof payload.title === "string" ? payload.title.trim() : "";
      const eventDate = typeof payload.event_date === "string" ? payload.event_date : "";
      const kind = typeof payload.kind === "string" ? payload.kind : "";
      if (
        !title ||
        title.length > 40 ||
        !/^\d{4}-\d{2}-\d{2}$/.test(eventDate) ||
        !CALENDAR_KINDS.has(kind)
      ) {
        return json({ error: "일정을 저장하지 못했어요." }, 400);
      }
      save.calendarEvents.push({
        id: crypto.randomUUID(),
        title,
        event_date: eventDate,
        start_time: payload.start_time ?? null,
        end_time: payload.end_time ?? null,
        place: payload.place ?? null,
        memo: payload.memo ?? null,
        kind,
        status: "scheduled",
        status_note: null,
      });
      writeSave(deviceId, save);
      return json({ ok: true });
    }
    case "discoverClue": {
      const clueId = typeof payload.clueId === "string" ? payload.clueId : "";
      if (!/^C(0[1-9]|1\d|2[0-4])$/.test(clueId)) {
        return json({ error: "단서를 저장하지 못했어요." }, 400);
      }
      const created = !save.clueDiscoveries.includes(clueId);
      if (created) save.clueDiscoveries.push(clueId);
      writeSave(deviceId, save);
      return json({ ok: true, created });
    }
    default:
      return json({ error: "잘못된 요청이에요." }, 400);
  }
}

export async function handleLocalGameApi(body: Record<string, unknown>): Promise<Result> {
  if (body.action === "claimSlot") {
    const payload = body.payload;
    if (!payload || typeof payload !== "object") return json({ error: "잘못된 요청이에요." }, 400);
    return claimSlot(payload as Record<string, unknown>);
  }
  return handleLocalAction(body);
}

export function loadLocalGameApi(body: Record<string, unknown>) {
  return handleLocalGameApi(body);
}

export function getCurrentLocalDeviceId() {
  return getDeviceId();
}
