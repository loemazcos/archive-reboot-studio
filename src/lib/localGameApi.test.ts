import { beforeEach, describe, expect, it } from "vitest";
import { handleLocalGameApi } from "@/lib/localGameApi";
import { callFunction } from "@/lib/gameApi";

describe("browser-local game API", () => {
  beforeEach(() => window.localStorage.clear());

  it("claims a named save slot, resumes with its PIN, and stores game/DM data", async () => {
    const claimed = await handleLocalGameApi({
      action: "claimSlot",
      payload: { name: "태산", pin: "1022" },
    });
    const slot = claimed.body as { deviceId: string; resumed: boolean };
    expect(claimed.status).toBe(200);
    expect(slot.resumed).toBe(false);

    const resumed = await handleLocalGameApi({
      action: "claimSlot",
      payload: { name: "태산", pin: "1022" },
    });
    expect((resumed.body as { deviceId: string }).deviceId).toBe(slot.deviceId);
    expect((resumed.body as { resumed: boolean }).resumed).toBe(true);

    await handleLocalGameApi({
      deviceId: slot.deviceId,
      action: "saveState",
      payload: { run: { t: 1307 } },
    });
    await handleLocalGameApi({
      deviceId: slot.deviceId,
      action: "sendDm",
      payload: { threadId: "sanghyuk", body: "오늘 학교 어땠어?", now: 1307 },
    });

    const loaded = await handleLocalGameApi({ deviceId: slot.deviceId, action: "load" });
    const save = loaded.body as { gameState: { t: number }; dmMessages: { body: string }[] };
    expect(save.gameState.t).toBe(1307);
    expect(save.dmMessages.map((message) => message.body)).toEqual(["오늘 학교 어땠어?"]);
  });

  it("rejects a wrong PIN for an existing local name", async () => {
    await handleLocalGameApi({ action: "claimSlot", payload: { name: "태산", pin: "1022" } });
    const result = await handleLocalGameApi({
      action: "claimSlot",
      payload: { name: "태산", pin: "0000" },
    });
    expect(result.status).toBe(403);
  });

  it("routes the real game API call through local storage", async () => {
    const result = await callFunction<{ deviceId: string }>("game-api", {
      action: "claimSlot",
      payload: { name: "미리보기", pin: "1234" },
    });
    expect(result.deviceId).toMatch(/^[0-9a-f-]{36}$/i);
  });
});
