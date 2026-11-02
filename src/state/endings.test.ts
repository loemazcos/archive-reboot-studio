import { describe, expect, it } from "vitest";
import { DEFAULT_RUN, type RunState } from "@/state/runState";
import { canUnlockTrueEnding, endingForFestivalOutcome } from "@/state/endings";
import { settleKakaoEvents } from "@/state/kakaoEvents";

function readyRun(): RunState {
  return {
    ...DEFAULT_RUN,
    courage: 75,
    ignores: 2,
    clues: [
      "C02",
      "C04",
      "C13",
      "C17",
      "C19",
      "C21",
      "C01",
      "C03",
      "C05",
      "C06",
      "C07",
      "C08",
      "C09",
      "C10",
      "C11",
      "C12",
      "C14",
      "C15",
    ],
    memoRead: [17],
    consult: {
      answered: { 2: "jaehyun", 3: "jaehyun", 5: "donghyun", 6: "donghyun" },
      unlocks: [],
    },
    appFlags: { "alarm:al1": "축제 전날", "ending.d14Reply": "true" },
  };
}

describe("true ending requirements", () => {
  it("requires all documented D-ending conditions", () => {
    expect(canUnlockTrueEnding(readyRun())).toBe(true);
    expect(canUnlockTrueEnding({ ...readyRun(), courage: 74 })).toBe(false);
    expect(canUnlockTrueEnding({ ...readyRun(), memoRead: [] })).toBe(false);
    expect(canUnlockTrueEnding({ ...readyRun(), appFlags: { "alarm:al1": "축제 전날" } })).toBe(false);
  });

  it("keeps route results internal while applying the documented festival thresholds", () => {
    const run = { ...readyRun(), mind: 70, courage: 75 };
    expect(endingForFestivalOutcome(run, "direct")).toBe("D");
    expect(endingForFestivalOutcome(run, "answered")).toBe("A");
    expect(endingForFestivalOutcome({ ...run, courage: 39 }, "answered")).toBe("B3");
    expect(endingForFestivalOutcome({ ...run, dnd: true }, "ignored")).toBe("B2");
    expect(endingForFestivalOutcome(run, "declined")).toBe("B1");
  });

  it("delivers only the selected ending's messages during the final week", () => {
    const run = {
      ...DEFAULT_RUN,
      t: 15 * 1440 + 8 * 60,
      storyEnding: "A" as const,
    };
    const settled = settleKakaoEvents(run);
    const ids = settled.kakaoAdded.map((message) => message.id);

    expect(ids).toContain("ending-a-d16-morning");
    expect(ids).not.toContain("ending-d-d16-morning");
    expect(settled.kakaoAdded.find((message) => message.id === "ending-a-d16-morning")?.text).toBe(
      "일어났냐",
    );
  });
});