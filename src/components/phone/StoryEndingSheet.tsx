import type { StoryEnding } from "@/state/runState";

const COPY: Record<Exclude<StoryEnding, "C">, { title: string; body: string }> = {
  A0: {
    title: "너무 빨랐던 사람",
    body: "…읽었네. 아 진짜 다행이다. 일주일을 기다린 답장은 3초 만에 돌아왔다.",
  },
  A: {
    title: "도착했어",
    body: "끝까지 도망치지 않은 밤. 다음 날 아침, 먼저 도착한 한 줄에 웃음이 났다.",
  },
  B1: {
    title: "통화가 끝난 뒤",
    body: "닿지 못했지만 끝난 건 아니다. 상혁의 메시지는 천천히 쌓이고 있다.",
  },
  B2: {
    title: "기다릴게",
    body: "꺼 둔 알림 아래로 한 주의 마음이 쌓였다. 이제야 화면을 열었다.",
  },
  B3: {
    title: "나중에 얘기하자",
    body: "말하지 못한 마음도 사라지지는 않았다. 마지막 메시지가 조용히 남았다.",
  },
  D: {
    title: "먼저 걸어온 사람",
    body: "상혁의 화면에 마지막 한 줄이 도착했다. 웃는 거 예쁘다고 한 거, 지금도 취소 안 해.",
  },
};

export default function StoryEndingSheet({
  ending,
  onClose,
}: {
  ending: Exclude<StoryEnding, "C">;
  onClose: () => void;
}) {
  const copy = COPY[ending];
  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label="이야기 결말"
      className="absolute inset-0 z-[70] flex flex-col items-center justify-center bg-[var(--bg)] px-7 text-center text-[var(--fg)]"
    >
      <p className="text-[12px] text-[var(--fg-2)]">태산의 폰</p>
      <h2 className="mt-3 text-[28px] font-bold">{copy.title}</h2>
      <p className="mt-4 max-w-[300px] text-[15px] leading-7 text-[var(--fg-2)]">{copy.body}</p>
      <button
        type="button"
        onClick={onClose}
        className="mt-9 h-11 min-w-32 rounded-[10px] bg-[var(--card)] px-5 text-[14px] font-semibold"
      >
        계속 보기
      </button>
    </section>
  );
}
