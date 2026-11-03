import { useState } from "react";
import type { EndingPartner, RunState } from "@/state/runState";

type Person = Exclude<EndingPartner, "none" | null>;
type Props = {
  run: RunState;
  onUnlock: (person: Person, code: string) => void;
  onChoose: (partner: EndingPartner) => void;
  onClose: () => void;
};

const LOCKS: { id: Person; label: string; title: string; code: string; story: string }[] = [
  {
    id: "donghyun",
    label: "동현",
    title: "공유 앨범 · 우리집 앞",
    code: "1020",
    story: "우리 이날마다 같이 있었더라. 형이랑 어떻게 될지 몰라서 가만히 있었어.",
  },
  {
    id: "jaehyun",
    label: "재현",
    title: "학생회 일정 · 숨은 일정",
    code: "1204",
    story: "태산 네 무대 영상을 편집하려고 했어. 장난만 친 게 아니라, 나도 너 좋아했어.",
  },
  {
    id: "seongho",
    label: "성호",
    title: "선도부 쪽지 · 기록 안 함",
    code: "1004",
    story: "네 위반 여섯 건을 전부 기록하지 않았어. 대충 알겠지?",
  },
];

const RESULTS: Record<EndingPartner, { title: string; lines: string[]; closing: string }> = {
  donghyun: {
    title: "오래된 사이",
    lines: ["그럼 우리 이제 뭐 함", "일단 치킨 먹자. 형이 사줬던 거 네가 사."],
    closing: "제일 늦게 알게 된 사람과, 이제야 시작하는 이야기.",
  },
  jaehyun: {
    title: "강아지는 짖는다",
    lines: ["야 나 선택해준 거임?", "장난 아니야", "알겠음. 근데 걔도 알 것 같음."],
    closing: "장난 뒤에 숨겨 둔 진심이 이제 도착했다.",
  },
  seongho: {
    title: "기록 안 함",
    lines: ["이 한 줄은 규정 밖에 적을게", "1학년 태산, 기록 없음. 이상하게 계속 보고 싶음."],
    closing: "가장 오래 지켜본 사람이 남긴 한 줄.",
  },
  none: {
    title: "조용한 선택",
    lines: ["요즘은 잘 지내냐"],
    closing: "아무도 고르지 않은 채, 이야기는 아직 열려 있다.",
  },
};

export default function MonthLaterSheet({ run, onUnlock, onChoose, onClose }: Props) {
  const [codes, setCodes] = useState<Record<Person, string>>({
    donghyun: "",
    jaehyun: "",
    seongho: "",
  });
  const [error, setError] = useState<Person | null>(null);
  const result = run.storyEnding === "C" && run.endingPartner ? RESULTS[run.endingPartner] : null;

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label="한 달 뒤"
      className="absolute inset-0 z-[70] flex flex-col bg-[var(--bg)] px-5 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-[calc(env(safe-area-inset-top)+56px)] text-[var(--fg)]"
    >
      <header className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-[12px] text-[var(--fg-2)]">12월 5일</p>
          <h2 className="mt-1 text-[23px] font-bold">{result ? result.title : "한 달 뒤"}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="px-2 py-1 text-[13px] text-[var(--fg-2)]"
        >
          나중에
        </button>
      </header>

      {result ? (
        <div className="flex min-h-0 flex-1 flex-col justify-center gap-3">
          <div className="space-y-2">
            {result.lines.map((line) => (
              <p
                key={line}
                className="w-fit max-w-[85%] rounded-[16px] bg-[var(--card)] px-3.5 py-2.5 text-[15px]"
              >
                {line}
              </p>
            ))}
          </div>
          <p className="mt-3 text-[14px] leading-6 text-[var(--fg-2)]">{result.closing}</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-[14px] leading-6 text-[var(--fg-2)]">
            세 개의 알림이 도착했다. 잠긴 기록은 풀지 않아도 선택할 수 있다.
          </p>
          <div className="min-h-0 flex-1 divide-y divide-[var(--line)] overflow-y-auto">
            {LOCKS.map((lock) => {
              const unlocked = run.appFlags[`ending.c.${lock.id}`] === "true";
              return (
                <article key={lock.id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold">{lock.title}</p>
                      <p className="mt-0.5 text-[12px] text-[var(--fg-2)]">{lock.label}</p>
                    </div>
                    {unlocked ? (
                      <span className="shrink-0 text-[12px] text-[var(--accent)]">열림</span>
                    ) : (
                      <form
                        className="flex shrink-0 items-center gap-1.5"
                        onSubmit={(event) => {
                          event.preventDefault();
                          onUnlock(lock.id, codes[lock.id]);
                          if (codes[lock.id] !== lock.code) setError(lock.id);
                          else setError(null);
                        }}
                      >
                        <input
                          value={codes[lock.id]}
                          onChange={(event) =>
                            setCodes((current) => ({
                              ...current,
                              [lock.id]: event.target.value.replace(/\D/g, "").slice(0, 4),
                            }))
                          }
                          aria-label={`${lock.label} 잠금 번호`}
                          inputMode="numeric"
                          maxLength={4}
                          placeholder="4자리"
                          className="h-9 w-[62px] rounded-[8px] bg-[var(--card)] text-center text-[14px]"
                        />
                        <button
                          type="submit"
                          disabled={codes[lock.id].length !== 4}
                          className="h-9 rounded-[8px] bg-[var(--card)] px-2.5 text-[13px] font-semibold disabled:opacity-40"
                        >
                          풀기
                        </button>
                      </form>
                    )}
                  </div>
                  {error === lock.id && !unlocked ? (
                    <p className="mt-1 text-right text-[12px] text-[#FF453A]">
                      번호를 다시 확인해 줘.
                    </p>
                  ) : null}
                  {unlocked ? <p className="mt-2 text-[13px] leading-5">{lock.story}</p> : null}
                </article>
              );
            })}
          </div>
          <p className="mb-2 mt-4 text-[13px] font-semibold">누구와 이야기를 이어갈까</p>
          <div className="grid grid-cols-2 gap-2">
            {LOCKS.map((lock) => (
              <button
                key={lock.id}
                type="button"
                onClick={() => onChoose(lock.id)}
                disabled={
                  run.consult.affinity[lock.id] < 6 &&
                  run.appFlags[`ending.c.${lock.id}`] !== "true"
                }
                className="h-11 rounded-[10px] bg-[var(--card)] text-[14px] font-semibold disabled:opacity-40"
              >
                {lock.label}
                {run.consult.affinity[lock.id] < 6 && run.appFlags[`ending.c.${lock.id}`] !== "true"
                  ? " · 잠김"
                  : ""}
              </button>
            ))}
            <button
              type="button"
              onClick={() => onChoose("none")}
              className="col-span-2 h-10 text-[13px] text-[var(--fg-2)]"
            >
              아무도 고르지 않기
            </button>
          </div>
        </>
      )}
    </section>
  );
}
