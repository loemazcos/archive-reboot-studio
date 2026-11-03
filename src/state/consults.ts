import { consults } from "@/data/story/consults";
import { parseClock } from "@/state/social";
import { DAY_MIN } from "@/state/timeline";

export type ConsultRoom = "donghyun" | "jaehyun";

export type ConsultEffect = {
  courage?: number;
  mind?: number;
  rumor?: number;
  clue?: string;
  unlock?: string;
  line?: string;
};

export type ConsultState = {
  answered: Record<string, ConsultRoom>;
  unlocks: string[];
  affinity: Record<ConsultRoom | "seongho", number>;
};

export const DEFAULT_CONSULT: ConsultState = {
  answered: {},
  unlocks: [],
  affinity: { donghyun: 5, jaehyun: 5, seongho: 1 },
};

const MORNING_CLOSE_MIN = 7 * 60;

export function openConsult(consult: ConsultState, t: number) {
  return (
    consults.find((entry) => {
      if (consult.answered[entry.no]) return false;
      const start = (entry.day - 1) * DAY_MIN + parseClock(entry.time);
      return t >= start && t < entry.day * DAY_MIN + MORNING_CLOSE_MIN;
    }) ?? null
  );
}
