import { useEffect, useState } from "react";
import { ChevronLeft, Lock, Plus, Search, Trash2 } from "lucide-react";
import { LOCKED_MEMO_OPENS_ON_DAY, memo18Text, memos } from "@/data/story/memos";
import { useGameState } from "@/state/GameState";
import { MEMO_18_INDEX, openMemoApp, readMemo } from "@/state/runState";

const MEMO_TOTAL = memos.length;
const KEY = "memo.entries";
type MemoEntry = { id: string; title: string; text: string; updatedAt: number };

function readEntries(flags: Record<string, string>): MemoEntry[] {
  try {
    const v = JSON.parse(flags[KEY] ?? "[]");
    if (!Array.isArray(v)) return [];
    return v
      .filter((entry) => entry && typeof entry.id === "string" && typeof entry.text === "string")
      .map((entry) => ({
        id: entry.id as string,
        title:
          typeof entry.title === "string" && entry.title.trim()
            ? entry.title
            : ((entry.text as string).split("\n")[0] || "메모").slice(0, 40),
        text: entry.text as string,
        updatedAt: typeof entry.updatedAt === "number" ? entry.updatedAt : 0,
      }));
  } catch {
    return [];
  }
}

export default function MemoApp() {
  const { run, update } = useGameState();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [editing, setEditing] = useState<{ id: string | null; title: string; text: string } | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const mine = readEntries(run.appFlags);
  const filteredMine = mine.filter((entry) =>
    `${entry.title} ${entry.text}`.includes(query.trim()),
  );
  const filteredStory = memos
    .map((memo, index) => ({ memo, index }))
    .filter(({ memo }) => `${memo.date} ${memo.text}`.includes(query.trim()));

  function saveEntries(fn: (list: MemoEntry[]) => MemoEntry[]) {
    update((current) => ({
      ...current,
      appFlags: { ...current.appFlags, [KEY]: JSON.stringify(fn(readEntries(current.appFlags))) },
    }));
  }
  function saveEdit() {
    if (!editing) return;
    const title = editing.title.trim();
    const text = editing.text.trim();
    const id = editing.id;
    if (title || text) {
      saveEntries((list) =>
        id
          ? list.map((m) =>
              m.id === id ? { ...m, title: title || "메모", text, updatedAt: Date.now() } : m,
            )
          : [
              {
                id: crypto.randomUUID(),
                title: title || text.split("\n")[0] || "메모",
                text,
                updatedAt: Date.now(),
              },
              ...list,
            ],
      );
    }
    setEditing(null);
  }

  useEffect(() => {
    update(openMemoApp);
  }, [update]);

  const allRead = Array.from({ length: MEMO_TOTAL }, (_, index) => index).every((index) =>
    run.memoRead.includes(index),
  );
  const memo18Unlocked = allRead && run.day >= LOCKED_MEMO_OPENS_ON_DAY;

  function openMemo(index: number) {
    if (index === MEMO_18_INDEX && !memo18Unlocked) return;
    update((current) => readMemo(current, index));
    setOpenIndex(index);
  }

  if (editing) {
    return (
      <div className="flex h-full flex-col bg-[var(--bg)] text-[var(--fg)]">
        <header className="flex items-center gap-2 px-3 pb-3 pt-[calc(env(safe-area-inset-top)+58px)]">
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="px-1 text-[15px] text-[var(--accent)]"
          >
            취소
          </button>
          <p className="flex-1 text-center text-[15px] font-semibold">모든 메모</p>
          {editing.id ? (
            <button
              type="button"
              aria-label="삭제"
              onClick={() => {
                if (!window.confirm("이 메모를 삭제할까요?")) return;
                const id = editing.id;
                saveEntries((list) => list.filter((m) => m.id !== id));
                setEditing(null);
              }}
              className="p-1 text-[var(--fg-2)]"
            >
              <Trash2 size={18} aria-hidden="true" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={saveEdit}
            className="px-1 text-[15px] font-semibold text-[var(--accent)]"
          >
            저장
          </button>
        </header>
        <input
          autoFocus
          value={editing.title}
          onChange={(e) => setEditing({ ...editing, title: e.target.value })}
          placeholder="제목"
          className="px-5 pb-2 pt-5 text-[25px] font-bold outline-none placeholder:text-[var(--fg-2)]"
        />
        <textarea
          value={editing.text}
          onChange={(e) => setEditing({ ...editing, text: e.target.value })}
          placeholder="메모"
          className="flex-1 resize-none bg-transparent px-5 pb-8 text-[17px] leading-[1.7] outline-none placeholder:text-[var(--fg-2)]"
        />
      </div>
    );
  }

  if (openIndex !== null) {
    const isMemo18 = openIndex === MEMO_18_INDEX;
    const memo = isMemo18 ? { date: "", text: memo18Text } : memos[openIndex];
    return (
      <div className="flex h-full flex-col bg-[var(--bg)] text-[var(--fg)]">
        <header className="flex items-center gap-2 px-3 pb-3 pt-[calc(env(safe-area-inset-top)+58px)]">
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="목록으로"
            className="p-1 text-[var(--accent)]"
          >
            <ChevronLeft size={26} strokeWidth={2} aria-hidden="true" />
          </button>
          <p className="flex-1 text-center text-[15px] font-semibold">메모</p>
          <span className="w-8" aria-hidden="true" />
        </header>
        <article className="flex-1 overflow-y-auto px-5 pb-8">
          {memo.date ? <p className="text-[12px] text-[var(--fg-2)]">{memo.date}</p> : null}
          <p className="mt-3 whitespace-pre-line text-[17px] leading-[1.7]">{memo.text}</p>
        </article>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[var(--bg)] text-[var(--fg)]">
      <header className="px-4 pb-3 pt-[calc(env(safe-area-inset-top)+58px)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[26px] font-bold leading-[1.2]">메모</p>
            <p className="mt-1 text-[12px] text-[var(--fg-2)]">{mine.length + MEMO_TOTAL}개 메모</p>
          </div>
          <button
            type="button"
            aria-label="새 메모"
            onClick={() => setEditing({ id: null, title: "", text: "" })}
            className="p-1 text-[var(--accent)]"
          >
            <Plus size={24} aria-hidden="true" />
          </button>
        </div>
      </header>
      <label className="mx-4 mb-2 flex h-9 items-center gap-2 rounded-[10px] bg-[var(--card)] px-2.5 text-[var(--fg-2)]">
        <Search size={16} aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="검색"
          aria-label="메모 검색"
          className="min-w-0 flex-1 bg-transparent text-[14px] text-[var(--fg)] outline-none placeholder:text-[var(--fg-2)]"
        />
      </label>
      <ul className="pan-y-scroll flex-1 divide-y divide-[var(--line)] overflow-y-auto px-4 pb-6">
        {filteredMine.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => setEditing({ id: m.id, title: m.title, text: m.text })}
              className="flex w-full flex-col gap-1 py-3 text-left active:bg-[var(--card)]"
            >
              <span className="text-[11px] text-[var(--fg-2)]">
                {m.updatedAt ? new Date(m.updatedAt).toLocaleDateString("ko-KR") : "내 메모"}
              </span>
              <span className="truncate text-[14px] font-semibold">{m.title}</span>
              <span className="truncate text-[13px] text-[var(--fg-2)]">{m.text}</span>
            </button>
          </li>
        ))}
        {filteredStory.map(({ memo, index }) => {
          const read = run.memoRead.includes(index);
          return (
            <li key={index}>
              <button
                type="button"
                onClick={() => openMemo(index)}
                className="flex w-full flex-col gap-1 py-3 text-left active:bg-[var(--card)]"
              >
                <span className="flex items-center gap-2 text-[11px] text-[var(--fg-2)]">
                  {memo.date}
                  {read ? null : (
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
                      aria-label="읽지 않음"
                    />
                  )}
                </span>
                <span className="truncate text-[14px] font-semibold">
                  {(memo.text.split("\n")[0] || "메모").slice(0, 36)}
                </span>
                <span className="truncate text-[13px] text-[var(--fg-2)]">{memo.text}</span>
              </button>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={() => openMemo(MEMO_18_INDEX)}
            disabled={!memo18Unlocked}
            className="flex w-full items-center gap-2 py-3 text-left disabled:opacity-60"
          >
            {memo18Unlocked ? (
              <span className="text-[14px]">18. 열린 메모</span>
            ) : (
              <>
                <Lock size={14} strokeWidth={2} className="text-[var(--fg-2)]" aria-hidden="true" />
                <span className="text-[14px] text-[var(--fg-2)]">
                  메모 {MEMO_TOTAL}개를 모두 읽으면 열려요
                </span>
              </>
            )}
          </button>
        </li>
      </ul>
    </div>
  );
}
