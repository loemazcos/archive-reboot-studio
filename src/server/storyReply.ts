export type StoryTurn = { from: "me" | "them"; text: string };
export type StoryReplyState = {
  t: number;
  courage: number;
  ignores: number;
  sanghyuk?: { answeredAt: number | null };
};
export type StoryReply = {
  messages: {
    text: string;
    delay_min: number;
    unsend_after_min: null;
    typing_cycles: number;
  }[];
  effects: { trust: number; courage: number; rumor: number };
  reveal: string[];
  read_now: boolean;
  mood: string;
};

const D14_REPLY_TEXT = "…이제 답장해도 돼요?";

export function scriptedStoryReply(
  threadId: string,
  history: StoryTurn[],
  run: StoryReplyState,
): StoryReply | null {
  const last = history.at(-1);
  const day = Math.floor(run.t / 1440) + 1;
  const minute = run.t % 1440;
  if (
    threadId !== "sanghyuk" ||
    last?.from !== "me" ||
    last.text !== D14_REPLY_TEXT ||
    day !== 14 ||
    minute < 22 * 60 + 40 ||
    run.courage < 50 ||
    run.ignores > 2 ||
    run.sanghyuk?.answeredAt !== null
  ) {
    return null;
  }

  return {
    messages: [
      { text: "ㅋㅋ 언제든", delay_min: 0, unsend_after_min: null, typing_cycles: 3 },
      { text: "이 말 하려고 쓴 게 아니라", delay_min: 0, unsend_after_min: null, typing_cycles: 2 },
      { text: "내일 보자", delay_min: 1, unsend_after_min: null, typing_cycles: 1 },
    ],
    effects: { trust: 0, courage: 0, rumor: 0 },
    reveal: [],
    read_now: false,
    mood: "warm",
  };
}
