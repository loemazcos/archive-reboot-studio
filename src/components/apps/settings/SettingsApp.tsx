import { useEffect, useState } from "react";
import { callFunction } from "@/lib/gameApi";
import { clearSlot } from "@/lib/device";
import { useGameState } from "@/state/GameState";
import { setActivityStatus, setSoundOn } from "@/state/runState";

export default function SettingsApp() {
  const { run, update } = useGameState();
  const [aiStatus, setAiStatus] = useState<"checking" | "connected" | "missing" | "error">(
    "checking",
  );
  const [resetConfirm, setResetConfirm] = useState(false);
  const on = run.activityStatus;
  const dark = run.appFlags["settings.theme"] === "dark";

  useEffect(() => {
    let active = true;
    callFunction<{ configured?: boolean }>("dm-reply", { status: true })
      .then(({ configured }) => {
        if (active) setAiStatus(configured ? "connected" : "missing");
      })
      .catch(() => {
        if (active) setAiStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex h-full flex-col bg-[var(--bg)] px-4 pb-8 pt-[calc(env(safe-area-inset-top)+58px)] text-[var(--fg)]">
      <p className="text-[26px] font-bold leading-[1.2]">설정</p>
      <div className="mt-6 rounded-[22px] bg-[var(--card)] p-4">
        <button
          type="button"
          role="switch"
          aria-checked={on}
          onClick={() => update((current) => setActivityStatus(current, !current.activityStatus))}
          className="flex w-full items-center gap-3 text-left"
        >
          <span className="flex-1">
            <span className="block text-[15px] font-semibold">활동 상태 표시</span>
            <span className="block text-[12px] text-[var(--fg-2)]">
              켜 두면 상대에게 활동 중으로 보여요
            </span>
          </span>
          <span
            className={`relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors ${on ? "bg-[#34C759]" : "bg-[var(--key-pressed)]"}`}
          >
            <span
              className={`absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow transition-transform ${
                on ? "translate-x-[22px]" : "translate-x-[2px]"
              }`}
            />
          </span>
        </button>
        <div className="my-3 h-px bg-[var(--line)]" />
        <button
          type="button"
          role="switch"
          aria-checked={run.soundOn}
          aria-label="소리"
          onClick={() => update((current) => setSoundOn(current, !current.soundOn))}
          className="flex w-full items-center gap-3 text-left"
        >
          <span className="flex-1">
            <span className="block text-[15px] font-semibold">소리</span>
            <span className="block text-[12px] text-[var(--fg-2)]">
              메시지와 알림에 소리가 나요. 방해금지 중에는 조용해요
            </span>
          </span>
          <span
            className={`relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors ${run.soundOn ? "bg-[#34C759]" : "bg-[var(--key-pressed)]"}`}
          >
            <span
              className={`absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow transition-transform ${
                run.soundOn ? "translate-x-[22px]" : "translate-x-[2px]"
              }`}
            />
          </span>
        </button>
        <div className="my-3 h-px bg-[var(--line)]" />
        <button
          type="button"
          role="switch"
          aria-checked={dark}
          onClick={() =>
            update((current) => ({
              ...current,
              appFlags: {
                ...current.appFlags,
                "settings.theme": current.appFlags["settings.theme"] === "dark" ? "light" : "dark",
              },
            }))
          }
          className="flex w-full items-center gap-3 text-left"
        >
          <span className="flex-1">
            <span className="block text-[15px] font-semibold">다크 모드</span>
            <span className="block text-[12px] text-[var(--fg-2)]">
              끄면 밝은 화면으로 고정돼요
            </span>
          </span>
          <span
            className={`relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors ${dark ? "bg-[#34C759]" : "bg-[var(--key-pressed)]"}`}
          >
            <span
              className={`absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow transition-transform ${dark ? "translate-x-[22px]" : "translate-x-[2px]"}`}
            />
          </span>
        </button>
      </div>
      <div className="mt-4 rounded-[22px] bg-[var(--card)] p-4 text-[15px]">
        <div className="flex justify-between">
          <span>진행</span>
          <span className="text-[var(--fg-2)]">{run.day}일차</span>
        </div>
        <div className="my-3 h-px bg-[var(--line)]" />
        <div className="flex justify-between">
          <span>AI 연결</span>
          <span
            className={
              aiStatus === "connected"
                ? "text-[#34C759]"
                : aiStatus === "checking"
                  ? "text-[var(--fg-2)]"
                  : "text-[#FF9F0A]"
            }
          >
            {aiStatus === "connected"
              ? "Gemini 연결됨"
              : aiStatus === "checking"
                ? "확인 중"
                : aiStatus === "missing"
                  ? "서버 키 설정 필요"
                  : "상태 확인 실패"}
          </span>
        </div>
      </div>
      <div className="mt-4 rounded-[22px] bg-[var(--card)] p-4 text-[15px]">
        {resetConfirm ? (
          <div className="flex flex-col gap-3">
            <p className="text-[14px] text-[var(--fg-2)]">
              저장된 이름과 진행 상황을 지우고 처음부터 시작해요. 되돌릴 수 없어요.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setResetConfirm(false)}
                className="flex-1 rounded-[12px] bg-[var(--key-pressed)] py-2.5 text-[14px] font-semibold"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  clearSlot();
                  window.location.reload();
                }}
                className="flex-1 rounded-[12px] bg-[#FF3B30] py-2.5 text-[14px] font-semibold text-white"
              >
                지우고 다시 시작
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setResetConfirm(true)}
            className="w-full text-left text-[15px] font-semibold text-[#FF3B30]"
          >
            처음부터 다시 시작
          </button>
        )}
      </div>
    </div>
  );
}
