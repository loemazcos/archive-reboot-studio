import { getDeviceId } from "@/lib/device";
import { callGame } from "@/lib/game.functions";
import { handleLocalGameApi } from "@/lib/localGameApi";

export async function callFunction<T>(
  name: "game-api" | "dm-reply",
  body: Record<string, unknown>,
): Promise<T> {
  const requestBody = { deviceId: getDeviceId(), ...body };
  const result =
    name === "game-api"
      ? await handleLocalGameApi(requestBody)
      : await callGame({ data: { name, body: requestBody } });
  const parsed: unknown = "json" in result ? JSON.parse(result.json) : result.body;
  if (result.status >= 400) {
    const message = (parsed as { error?: unknown } | null)?.error;
    throw new Error(typeof message === "string" ? message : "요청을 처리하지 못했어요.");
  }
  return parsed as T;
}
