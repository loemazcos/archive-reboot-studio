import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';

type Props = { title: string; onBack?: () => void; right?: ReactNode; large?: boolean; children: ReactNode; tone?: 'bg' | 'card' };

/** Shared iOS-style page frame for the smaller built-in apps. */
export default function AppShell({ title, onBack, right, large = !onBack, children, tone = 'bg' }: Props) {
  return (
    <div className={`flex h-full flex-col text-[var(--fg)] ${tone === 'card' ? 'bg-[var(--card)]' : 'bg-[var(--bg)]'}`}>
      <header className="flex items-center gap-2 px-3 pb-2 pt-[calc(env(safe-area-inset-top)+58px)]">
        {onBack ? (
          <button type="button" onClick={onBack} aria-label="뒤로" className="p-1 text-[var(--accent)]">
            <ChevronLeft size={26} strokeWidth={2} aria-hidden="true" />
          </button>
        ) : null}
        {large ? (
          <p className="flex-1 px-1 text-[30px] font-bold leading-[1.2]">{title}</p>
        ) : (
          <p className="flex-1 text-center text-[16px] font-semibold">{title}</p>
        )}
        {right ?? (onBack ? <span className="w-8" aria-hidden="true" /> : null)}
      </header>
      <div className="pan-y-scroll flex-1 overflow-y-auto px-4 pb-8">{children}</div>
    </div>
  );
}

export function Group({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <section className="mt-4">
      {label ? <p className="mb-1.5 px-2 text-[12px] uppercase tracking-wide text-[var(--fg-2)]">{label}</p> : null}
      <div className="overflow-hidden rounded-[14px] bg-[var(--card)]">{children}</div>
    </section>
  );
}

export function Row({
  title,
  sub,
  right,
  onClick,
  danger,
}: {
  title: ReactNode;
  sub?: ReactNode;
  right?: ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  const body = (
    <>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={`truncate text-[15px] ${danger ? 'text-[var(--danger,#e5484d)]' : ''}`}>{title}</span>
        {sub ? <span className="truncate text-[12px] text-[var(--fg-2)]">{sub}</span> : null}
      </span>
      {right ? <span className="shrink-0 text-[13px] text-[var(--fg-2)]">{right}</span> : null}
    </>
  );
  const cls = 'flex w-full items-center gap-3 border-b border-[var(--sep,rgba(60,60,67,0.12))] px-4 py-3 text-left last:border-b-0';
  return onClick ? (
    <button type="button" onClick={onClick} className={`${cls} active:bg-[var(--bg)]`}>
      {body}
    </button>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string }[]; value: T; onChange: (id: T) => void }) {
  return (
    <nav className="flex border-t border-[var(--sep,rgba(60,60,67,0.12))] bg-[var(--card)] pb-[calc(env(safe-area-inset-bottom)+14px)] pt-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`flex-1 py-1.5 text-[12px] font-semibold ${value === tab.id ? 'text-[var(--accent)]' : 'text-[var(--fg-2)]'}`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
