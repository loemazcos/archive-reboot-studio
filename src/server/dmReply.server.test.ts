import { afterEach, describe, expect, it } from "vitest";
import { handle } from "@/server/dmReply.server";

const originalGeminiKey = process.env["GEMINI_API_KEY"];

afterEach(() => {
  if (originalGeminiKey === undefined) delete process.env["GEMINI_API_KEY"];
  else process.env["GEMINI_API_KEY"] = originalGeminiKey;
});

describe("DM reply server without Supabase", () => {
  it("returns only Gemini configuration status", async () => {
    delete process.env["GEMINI_API_KEY"];
    await expect(handle({ status: true })).resolves.toEqual({
      status: 200,
      body: { configured: false },
    });
  });

  it("returns an in-character fallback when Gemini is not configured", async () => {
    delete process.env["GEMINI_API_KEY"];
    const result = await handle({
      deviceId: "00000000-0000-4000-8000-000000000001",
      threadId: "sanghyuk",
      history: [{ from: "me", text: "오늘 학교 어땠어?" }],
      otherHistory: [],
      run: {
        t: 1307,
        battery: 62,
        courage: 20,
        mind: 60,
        rumor: 10,
        ignores: 0,
        clues: [],
        sanghyuk: { answeredAt: null },
      },
    });

    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({ fallback: true });
    expect((result.body as { messages: { text: string }[] }).messages).toHaveLength(1);
  });
});
