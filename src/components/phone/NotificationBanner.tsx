import { useEffect, useRef, useState } from "react";
import NotificationItem from "@/components/phone/NotificationItem";

const SHOW_MS = 4500;
const EXIT_MS = 300;

type Props = { appId: string; title: string; body: string; time: string; onDismiss: () => void };

export default function NotificationBanner({ appId, title, body, time, onDismiss }: Props) {
  const [shown, setShown] = useState(false);
  const exitTimer = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    const enter = window.requestAnimationFrame(() => setShown(true));
    hideTimer.current = window.setTimeout(() => close(), SHOW_MS);
    return () => {
      window.cancelAnimationFrame(enter);
      if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
      if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
    };
    // close is stable within this mount; the effect runs once per banner.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function close() {
    setShown(false);
    exitTimer.current = window.setTimeout(onDismiss, EXIT_MS);
  }

  // Tap the banner to dismiss it (no swipe gestures).
  return (
    <button
      type="button"
      aria-label="알림 닫기"
      onClick={close}
      className={`absolute inset-x-3 top-[calc(env(safe-area-inset-top)+8px)] z-[61] block text-left transition-[transform,opacity] duration-300 ease-out ${
        shown ? "translate-y-0 opacity-100" : "-translate-y-[160%] opacity-0"
      }`}
    >
      <NotificationItem appId={appId} title={title} body={body} time={time} />
    </button>
  );
}
