import { useState, type FormEvent } from 'react';
import { callFunction } from '@/lib/gameApi';
import { setSlot } from '@/lib/device';

type Props = { onReady: (name: string) => void };

/** Start screen: the player's name is their save slot, protected by a 4-digit PIN. */
export default function NameScreen({ onReady }: Props) {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !/^\d{4}$/.test(pin)) {
      setError('이름과 숫자 4자리 비밀번호를 넣어 주세요.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await callFunction<{ deviceId: string }>('game-api', { action: 'claimSlot', payload: { name: trimmed, pin } });
      setSlot(trimmed, result.deviceId);
      onReady(trimmed);
    } catch (e) {
      setError(e instanceof Error ? e.message : '연결이 끊겼어요. 다시 시도해 주세요.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="name-screen">
      <form onSubmit={submit} className="name-card">
        <p className="name-eyebrow">태산의 폰</p>
        <h1 className="name-title">이름을 입력해 주세요</h1>
        <p className="name-help">처음이면 새로 시작하고, 쓰던 이름과 비밀번호를 넣으면 이어서 해요. 한 번 쓴 이름은 다른 사람이 쓸 수 없어요.</p>
        <input
          className="name-input"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 12))}
          placeholder="이름 (최대 12자)"
          autoComplete="off"
          aria-label="이름"
        />
        <input
          className="name-input"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
          placeholder="비밀번호 숫자 4자리"
          inputMode="numeric"
          type="password"
          aria-label="비밀번호"
        />
        {error ? <p className="name-error">{error}</p> : null}
        <button type="submit" className="name-button" disabled={busy}>
          {busy ? '확인 중' : '시작하기'}
        </button>
      </form>
    </div>
  );
}
