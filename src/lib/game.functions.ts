import { createServerFn } from "@tanstack/react-start";

type CallInput = { name: "game-api" | "dm-reply"; body: Record<string, unknown> };

// Single entry point replacing the old game-api and dm-reply backend endpoints.
// Each request is scoped by the device id the browser sends; the handlers
// validate it and filter every query by it.
export const callGame = createServerFn({ method: "POST" })
  .inputValidator((input: CallInput) => {
    if (input?.name !== "game-api" && input?.name !== "dm-reply") throw new Error("bad request");
    if (!input.body || typeof input.body !== "object") throw new Error("bad request");
    return input;
  })
  .handler(async ({ data }) => {
    const mod =
      data.name === "game-api"
        ? await import("@/server/gameApi.server")
        : await import("@/server/dmReply.server");
    const result = await mod.handle(data.body);
    // Body is sent as a JSON string so any shape stays serializable.
    return { status: result.status, json: JSON.stringify(result.body ?? null) };
  });
