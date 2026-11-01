import { device } from '@/data/device';
import { dmThreads } from '@/data/instagram';
import { remitBody } from '@/lib/remit';
import { useGameState } from '@/state/GameState';

export type ListNotice = { id: string; appId: string; title: string; body: string; time: string };

export function useVisibleNotices(): ListNotice[] {
  const { run } = useGameState();
  const dynamic = run.notices
    .filter((notice) => notice.arriveAt <= run.t && !notice.queued)
    .map((notice) => ({ id: notice.id, appId: notice.appId, title: notice.title, body: notice.body, time: notice.time }))
    .reverse();
  if (run.notificationsCleared) return dynamic;
  const openedName = (title: string) => {
    const thread = dmThreads.find((item) => item.name === title);
    return thread ? run.seenNotices.includes(`open:${thread.id}`) : false;
  };
  const fixed = device.lockNotifications
    .filter((item) => !run.seenNotices.includes(item.id) && !openedName(item.title))
    .map((item) => ({
    id: item.id,
    appId: item.app,
    title: item.title,
    body: item.id === 'n1' ? remitBody(run) : item.body,
    time: item.time,
  }));
  return [...dynamic, ...fixed];
}
