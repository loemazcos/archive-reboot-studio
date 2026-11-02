import type { RunState, StoryEnding } from "@/state/runState";
import { clampStat } from "@/state/stats";

export const D_ENDING_CORE_CLUES = ["C02", "C04", "C13", "C17", "C19", "C21"];
export const D_ENDING_MIN_CLUES = 18;
export const D_ENDING_MIN_COURAGE = 75;

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
    answers[6] === "donghyun" &&
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