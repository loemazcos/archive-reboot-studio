import { useCallback, useEffect, useRef, useState } from "react";
import { callFunction } from "@/lib/gameApi";

type DiscoverResponse = { ok?: unknown };
const RETRY_MS = 15000;

export function useClueDiscovery(found: string[]) {
  const announced = useRef(new Set(found));
  const synced = useRef(new Set<string>());
  const [queue, setQueue] = useState<string[]>([]);
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    let failed = false;
    let timer: number | undefined;
    const jobs = found
      .filter((clueId) => !synced.current.has(clueId))
      .map((clueId) => {
        synced.current.add(clueId);
        return callFunction<DiscoverResponse>("game-api", {
          action: "discoverClue",
          payload: { clueId },
        })
          .then((response) => {
            if (response.ok !== true) throw new Error("discover failed");
          })
          .catch(() => {
            synced.current.delete(clueId);
            failed = true;
          });
      });
    if (jobs.length) {
      void Promise.all(jobs).then(() => {
        if (failed) timer = window.setTimeout(() => setRetryTick((t) => t + 1), RETRY_MS);
      });
    }

    const fresh = found.filter((clueId) => !announced.current.has(clueId));
    if (fresh.length) {
      fresh.forEach((clueId) => announced.current.add(clueId));
      setQueue((q) => [...q, ...fresh]);
    }
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [found, retryTick]);

  const dismiss = useCallback(() => setQueue((q) => q.slice(1)), []);

  return { pending: queue[0] ?? null, dismiss };
}
