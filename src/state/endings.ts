import type { RunState, StoryEnding } from "@/state/runState";
import { clampStat } from "@/state/stats";

export const D_ENDING_CORE_CLUES = ["C02", "C04", "C13", "C17", "C19", "C21"];
export const D_ENDING_MIN_CLUES = 18;
export const D_ENDING_MIN_COURAGE = 75;
export const C_ENDING_DAY = 53;

const C_ENDING_CODES = { donghyun: "1020", jaehyun: "1204", seongho: "1004" } as const;

export type FestivalOutcome = "direct" | "answered" | "declined" | "ignored";

export function canSendD14Reply(run: RunState): boolean {
  return (
    run.day === 14 &&
    run.t % 1440 >= 22 * 60 + 40 &&
    run.sanghyuk.answeredAt === null &&
    run.ignores <= 2 &&
    run.courage >= 50 &&
    run.appFlags["ending.d14Reply"] !== "true"
  );
}

export function recordD14Reply(run: RunState): RunState {
  if (!canSendD14Reply(run)) return run;
  return {
    ...run,
    courage: clampStat(run.courage + 10),
    mind: clampStat(run.mind + 8),
    appFlags: { ...run.appFlags, "ending.d14Reply": "true" },
  };
}

export function canUnlockTrueEnding(run: RunState): boolean {
  const answers = run.consult.answered;
  const answeredDonghyun = Object.values(answers).filter((room) => room === "donghyun").length;
  const answeredJaehyun = Object.values(answers).filter((room) => room === "jaehyun").length;
  const clues = new Set(run.clues);

  return (
    run.memoRead.includes(17) &&
    clues.size >= D_ENDING_MIN_CLUES &&
    D_ENDING_CORE_CLUES.every((clue) => clues.has(clue)) &&
    run.courage >= D_ENDING_MIN_COURAGE &&
    run.ignores <= 2 &&
    answers[5] === "donghyun" &&
    answeredDonghyun >= 2 &&
    answeredJaehyun >= 2 &&
    Boolean(run.appFlags["alarm:al1"]) &&
    run.appFlags["alarm:al1"] !== "선배 피하기용" &&
    run.appFlags["ending.d14Reply"] === "true"
  );
}

export function endingForFestivalOutcome(
  run: RunState,
  outcome: FestivalOutcome,
): StoryEnding | null {
  if (outcome === "direct") return canUnlockTrueEnding(run) ? "D" : null;
  if (outcome === "answered") {
    return run.mind >= 70 && run.courage >= 40 ? "A" : "B3";
  }
  return outcome === "ignored" && run.dnd ? "B2" : "B1";
}

export function canOpenCLastChapter(run: RunState): boolean {
  return (
    run.day >= C_ENDING_DAY &&
    (run.storyEnding === "B1" ||
      run.storyEnding === "B2" ||
      run.storyEnding === "B3" ||
      run.storyEnding === "C")
  );
}

export function unlockCLastChapterStory(
  run: RunState,
  person: keyof typeof C_ENDING_CODES,
  code: string,
): RunState {
  if (!canOpenCLastChapter(run) || C_ENDING_CODES[person] !== code) return run;
  return { ...run, appFlags: { ...run.appFlags, [`ending.c.${person}`]: "true" } };
}

export function chooseCLastChapterEnding(
  run: RunState,
  partner: RunState["endingPartner"],
): RunState {
  if (!canOpenCLastChapter(run) || partner === null) return run;
  if (
    partner !== "none" &&
    run.consult.affinity[partner] < 6 &&
    run.appFlags[`ending.c.${partner}`] !== "true"
  ) {
    return run;
  }
  return { ...run, storyEnding: "C", endingPartner: partner };
}
