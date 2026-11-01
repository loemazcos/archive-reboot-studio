// Ported from the original game backend. Server-only.
/* eslint-disable @typescript-eslint/no-explicit-any */
type Db = any;

const DEVICE_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const THREAD_IDS = ["sanghyuk", "donghyun", "jaehyun", "seongho"];
const CALENDAR_KINDS = ["school", "festival", "club", "exam", "council", "personal"];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;
const CLUE_ID_PATTERN = /^C(0[1-9]|1\d|2[0-4])$/;
const UNIQUE_VIOLATION = "23505";

class BadRequest extends Error {}

type Result = { status: number; body: unknown };
function json(body: unknown, status = 200): Result {
  return { status, body };
}

function requireText(value: unknown, min: number, max: number): string {
  if (typeof value !== "string") throw new BadRequest();
  const text = value.trim();
  if (text.length < min || text.length > max) throw new BadRequest();
  return text;
}

function optionalText(value: unknown, max: number): string | null {
  if (value === null || value === undefined || value === "") return null;
  return requireText(value, 1, max);
}

function optionalTime(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || !TIME_PATTERN.test(value)) throw new BadRequest();
  return value;
}

function requireDate(value: unknown): string {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) throw new BadRequest();
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) throw new BadRequest();
  return value;
}

const DM_COLUMNS = "id, thread_id, sender, body, status, deliver_at, read_at, unsend_after_min, unsent_at, typing_cycles, created_at";

type DmRow = {
  id: number;
  thread_id: string;
  sender: "me" | "them";
  body: string;
  status: string;
  deliver_at: number;
  read_at: number | null;
  unsend_after_min: number | null;
  unsent_at: number | null;
  typing_cycles: number;
  created_at: string;
};

async function currentMinute(supabase: Db, deviceId: string): Promise<number | null> {
  const { data, error } = await supabase.from("game_state").select("run").eq("device_id", deviceId).maybeSingle();
  if (error) throw new Error("state failed");
  const t = data?.run?.t;
  return typeof t === "number" ? t : null;
}

async function loadState(supabase: Db, deviceId: string) {
  const [calendar, run] = await Promise.all([
    supabase
      .from("calendar_events")
      .select("id, title, event_date, start_time, end_time, place, memo, kind, status, status_note")
      .eq("device_id", deviceId)
      .order("event_date", { ascending: true })
      .order("start_time", { ascending: true, nullsFirst: true }),
    supabase.from("game_state").select("run").eq("device_id", deviceId).maybeSingle(),
  ]);
  if (calendar.error || run.error) throw new Error("load failed");
  const gameState = run.data?.run ?? null;
  const now = typeof gameState?.t === "number" ? gameState.t : null;

  let dmMessages: DmRow[] = [];
  if (now !== null) {
    const dm = await supabase
      .from("dm_messages")
      .select(DM_COLUMNS)
      .eq("device_id", deviceId)
      .lte("deliver_at", now)
      .order("deliver_at", { ascending: true })
      .order("id", { ascending: true });
    if (dm.error) throw new Error("load failed");
    const rows = (dm.data ?? []) as DmRow[];
    const isExpired = (row: DmRow) =>
      row.sender === "them" && row.unsend_after_min !== null && now >= row.deliver_at + row.unsend_after_min;
    dmMessages = rows.map((row) => (isExpired(row) && row.status !== "unsent" ? { ...row, status: "unsent" } : row));
    const toMark = rows.filter((row) => isExpired(row) && row.unsent_at === null);
    await Promise.all(
      toMark.map((row) =>
        supabase
          .from("dm_messages")
          .update({ status: "unsent", unsent_at: row.deliver_at + (row.unsend_after_min ?? 0) })
          .eq("id", row.id)
          .eq("device_id", deviceId),
      ),
    );
  }

  return {
    dmMessages,
    calendarEvents: calendar.data ?? [],
    gameState,
  };
}

async function saveState(supabase: Db, deviceId: string, payload: Record<string, unknown>) {
  const run = payload.run;
  if (typeof run !== "object" || run === null || Array.isArray(run)) throw new BadRequest();
  if (JSON.stringify(run).length > 100_000) throw new BadRequest();
  const { error } = await supabase
    .from("game_state")
    .upsert({ device_id: deviceId, run, updated_at: new Date().toISOString() });
  if (error) throw new Error("save failed");
  return { ok: true };
}

async function sendDm(supabase: Db, deviceId: string, payload: Record<string, unknown>) {
  const threadId = typeof payload.threadId === "string" ? payload.threadId : "";
  if (!THREAD_IDS.includes(threadId)) throw new BadRequest();
  const body = requireText(payload.body, 1, 300);
  const now = await currentMinute(supabase, deviceId);
  if (now === null) throw new BadRequest();
  const { error } = await supabase
    .from("dm_messages")
    .insert({ device_id: deviceId, thread_id: threadId, sender: "me", body, status: "sent", deliver_at: now });
  if (error) throw new Error("insert failed");
  return { ok: true };
}

async function openThread(supabase: Db, deviceId: string, payload: Record<string, unknown>) {
  const threadId = typeof payload.threadId === "string" ? payload.threadId : "";
  if (!THREAD_IDS.includes(threadId)) throw new BadRequest();
  const now = await currentMinute(supabase, deviceId);
  if (now === null) throw new BadRequest();
  const [mine, theirs] = await Promise.all([
    supabase
      .from("dm_messages")
      .update({ status: "read", read_at: now })
      .eq("device_id", deviceId)
      .eq("thread_id", threadId)
      .eq("sender", "me")
      .eq("status", "sent")
      .lte("deliver_at", now),
    supabase
      .from("dm_messages")
      .update({ read_at: now })
      .eq("device_id", deviceId)
      .eq("thread_id", threadId)
      .eq("sender", "them")
      .is("read_at", null)
      .lte("deliver_at", now),
  ]);
  if (mine.error || theirs.error) throw new Error("update failed");
  return { ok: true };
}

async function saveCalendarEvent(
  supabase: Db,
  deviceId: string,
  payload: Record<string, unknown>,
) {
  const kind = typeof payload.kind === "string" ? payload.kind : "";
  if (!CALENDAR_KINDS.includes(kind)) throw new BadRequest();
  const { error } = await supabase.from("calendar_events").insert({
    device_id: deviceId,
    title: requireText(payload.title, 1, 40),
    event_date: requireDate(payload.event_date),
    start_time: optionalTime(payload.start_time),
    end_time: optionalTime(payload.end_time),
    place: optionalText(payload.place, 40),
    memo: optionalText(payload.memo, 200),
    kind,
    status: "scheduled",
  });
  if (error) throw new Error("insert failed");
  return { ok: true };
}

async function discoverClue(supabase: Db, deviceId: string, payload: Record<string, unknown>) {
  const clueId = typeof payload.clueId === "string" ? payload.clueId : "";
  if (!CLUE_ID_PATTERN.test(clueId)) throw new BadRequest();
  const { error } = await supabase.from("clue_discoveries").insert({ device_id: deviceId, clue_id: clueId });
  if (error && error.code !== UNIQUE_VIOLATION) throw new Error("insert failed");
  return { ok: true, created: !error };
}

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Name = save slot. A new name is claimed with a 4-digit PIN; the same name + PIN resumes it.
// Anyone else typing a taken name gets refused, so names stay unique to one player.
async function claimSlot(supabase: Db, payload: any): Promise<Result> {
  const name = typeof payload?.name === "string" ? payload.name.trim().normalize("NFC") : "";
  const pin = typeof payload?.pin === "string" ? payload.pin : "";
  if (name.length < 1 || name.length > 12 || !/^\d{4}$/.test(pin)) return json({ error: "이름(1~12자)과 숫자 4자리를 넣어 주세요." }, 400);
  const hourStart = new Date(Math.floor(Date.now() / 3600000) * 3600000).toISOString();
  const { data: ok } = await supabase.rpc("consume_rate_limit", { p_key: `slot:${name}`, p_window: hourStart, p_limit: 10 });
  if (ok !== true) return json({ error: "시도가 너무 많아요. 잠시 후 다시 해 주세요." }, 429);
  const pinHash = await sha256(`${name}:${pin}`);
  const { data: existing, error } = await supabase.from("save_slots").select("pin_hash, device_id").eq("name", name).maybeSingle();
  if (error) throw new Error("slot failed");
  if (existing) {
    if (existing.pin_hash !== pinHash) return json({ error: "이미 다른 사람이 쓰는 이름이에요. 내 이름이면 비밀번호를 확인해 주세요." }, 403);
    return json({ deviceId: existing.device_id, resumed: true });
  }
  const deviceId = crypto.randomUUID();
  const { error: insertError } = await supabase.from("save_slots").insert({ name, pin_hash: pinHash, device_id: deviceId });
  if (insertError) {
    if (insertError.code === UNIQUE_VIOLATION) return json({ error: "이미 다른 사람이 쓰는 이름이에요." }, 403);
    throw new Error("slot failed");
  }
  return json({ deviceId, resumed: false });
}

export async function handle(body: any): Promise<Result> {
  try {
    if (body?.action === "claimSlot") {
      const supabase: Db = (await import("@/integrations/supabase/client.server")).supabaseAdmin as any;
      return await claimSlot(supabase, body?.payload);
    }
    const deviceId = typeof body?.deviceId === "string" ? body.deviceId : "";
    if (!DEVICE_ID_PATTERN.test(deviceId)) {
      return json({ error: "잘못된 요청이에요." }, 400);
    }

    const payload = body?.payload && typeof body.payload === "object" ? body.payload : {};
    const supabase: Db = (await import("@/integrations/supabase/client.server")).supabaseAdmin as any;

    switch (body?.action) {
      case "load":
        return json(await loadState(supabase, deviceId));
      case "sendDm":
        return json(await sendDm(supabase, deviceId, payload));
      case "openThread":
        return json(await openThread(supabase, deviceId, payload));
      case "saveCalendarEvent":
        return json(await saveCalendarEvent(supabase, deviceId, payload));
      case "saveState":
        return json(await saveState(supabase, deviceId, payload));
      case "discoverClue":
        return json(await discoverClue(supabase, deviceId, payload));
      default:
        return json({ error: "잘못된 요청이에요." }, 400);
    }
  } catch (error) {
    if (error instanceof BadRequest) {
      return json({ error: "잘못된 요청이에요." }, 400);
    }
    return json({ error: "요청을 처리하지 못했어요." }, 500);
  }
}
