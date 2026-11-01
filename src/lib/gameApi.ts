import { getDeviceId } from '@/lib/device';
import { callGame } from '@/lib/game.functions';

export async function callFunction<T>(name: 'game-api' | 'dm-reply', body: Record<string, unknown>): Promise<T> {
  const result = await callGame({ data: { name, body: { deviceId: getDeviceId(), ...body } } });
  const parsed: unknown = JSON.parse(result.json);
  if (result.status >= 400) {
    const message = (parsed as { error?: unknown } | null)?.error;
    throw new Error(typeof message === 'string' ? message : '요청을 처리하지 못했어요.');
  }
  return parsed as T;
}
