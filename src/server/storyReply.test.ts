import { describe, expect, it } from "vitest";
import { scriptedStoryReply } from "@/server/storyReply";

describe("scripted story replies", () => {
  it("returns the fixed scene dialogue only at its eligible moment", () => {
    const history = [{ from: "me" as const, text: "…이제 답장해도 돼요?" }];
    const state = {
      t: 13 * 1440 + 22 * 60 + 40,
      courage: 50,
      ignores: 2,
      sanghyuk: { answeredAt: null },
    };

    expect(scriptedStoryReply("sanghyuk", history, state)?.messages.map((m) => m.text)).toEqual([
      "ㅋㅋ 언제든",
      "이 말 하려고 쓴 게 아니라",
      "내일 보자",
    ]);
    expect(scriptedStoryReply("donghyun", history, state)).toBeNull();
    expect(scriptedStoryReply("sanghyuk", history, { ...state, courage: 49 })).toBeNull();
    expect(
      scriptedStoryReply("sanghyuk", history, { ...state, sanghyuk: { answeredAt: 1 } }),
    ).toBeNull();
  });
});
