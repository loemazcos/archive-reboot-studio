import { useEffect, useRef, useState } from 'react';
import { RefreshCcw, Zap, ZapOff } from 'lucide-react';
import { CaptureAlbum } from '@/components/apps/camera/CaptureAlbum';
import { useGameState } from '@/state/GameState';
import { unlockPhoto, unlockedPhotoIds } from '@/components/apps/photos/photoState';

const MODES = ['타임랩스', '슬로모', '비디오', '사진', '인물', '파노라마'];

export default function CameraApp() {
  const { run, update } = useGameState();
  const [flash, setFlash] = useState(false);
  const [album, setAlbum] = useState(false);
  const [front, setFront] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [zoom, setZoom] = useState<'0.5' | '1' | '2'>('1');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const shots = unlockedPhotoIds(run).filter((id) => id.startsWith('camera:'));

  function shoot() {
    if (flash) return;
    update((current) => unlockPhoto(current, `camera:${Date.now()}`));
    setFlash(true);
    timer.current = setTimeout(() => setFlash(false), 160);
  }

  if (album) return <CaptureAlbum onBack={() => setAlbum(false)} />;

  const scale = zoom === '0.5' ? 0.8 : zoom === '2' ? 1.5 : 1;

  return (
    <div className="flex h-full flex-col bg-black text-white">
      <header className="flex items-center justify-between px-6 pb-3 pt-[calc(env(safe-area-inset-top)+54px)]">
        <button type="button" aria-label="플래시" aria-pressed={flashOn} onClick={() => setFlashOn((v) => !v)} className={flashOn ? 'text-[#ffd60a]' : ''}>
          {flashOn ? <Zap size={22} fill="currentColor" /> : <ZapOff size={22} />}
        </button>
        <span className="rounded-full bg-[#ffd60a] px-2 py-0.5 text-[11px] font-bold text-black">LIVE</span>
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-300"
          aria-label="카메라 화면"
          style={{
            transform: `scale(${scale})`,
            background: front
              ? 'radial-gradient(circle at 50% 40%, #d9b9a0 0 22%, #3a3a46 23%, #1e1e26)'
              : 'linear-gradient(180deg, #9ec9e6 0 42%, #c9b79a 42% 62%, #6f5f4c 62%)',
          }}
        >
          {!front ? (
            <>
              <div className="absolute left-[14%] top-[10%] h-[30%] w-[72%] border-[10px] border-[#efe8d6]/80" />
              <div className="absolute bottom-[14%] left-[10%] h-[14%] w-[80%] rounded-lg bg-[#8a7258]" />
            </>
          ) : null}
        </div>
        {[1, 2].map((n) => <div key={`v${n}`} className="absolute inset-y-0 border-l border-white/25" style={{ left: `${(n * 100) / 3}%` }} />)}
        {[1, 2].map((n) => <div key={`h${n}`} className="absolute inset-x-0 border-t border-white/25" style={{ top: `${(n * 100) / 3}%` }} />)}
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 border border-[#ffd60a]" />
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/40 p-1">
          {(['0.5', '1', '2'] as const).map((z) => (
            <button key={z} type="button" onClick={() => setZoom(z)} className={`h-8 w-8 rounded-full text-[11px] font-semibold ${zoom === z ? 'bg-black/70 text-[#ffd60a]' : 'text-white'}`}>
              {zoom === z ? `${z}×` : z}
            </button>
          ))}
        </div>
        {flash ? <div className={`absolute inset-0 ${flashOn ? 'bg-white' : 'bg-black'}`} /> : null}
      </div>

      <div className="flex justify-center gap-5 py-3 text-[12px] font-semibold tracking-wide">
        {MODES.map((m) => <span key={m} className={m === '사진' ? 'text-[#ffd60a]' : 'text-white/60'}>{m}</span>)}
      </div>
      <div className="flex items-center justify-around pb-[calc(env(safe-area-inset-bottom)+36px)] pt-2">
        <button
          type="button"
          aria-label="사진 보관함"
          onClick={() => setAlbum(true)}
          className="h-12 w-12 overflow-hidden rounded-md border border-white/40"
          style={{ background: shots.length ? 'linear-gradient(180deg,#9ec9e6 0 42%,#c9b79a 42%)' : '#222' }}
        />
        <button type="button" aria-label="사진 촬영" onClick={shoot} className="flex h-[74px] w-[74px] items-center justify-center rounded-full border-[4px] border-white">
          <span className="h-[60px] w-[60px] rounded-full bg-white transition-transform active:scale-90" />
        </button>
        <button type="button" aria-label="카메라 전환" onClick={() => setFront((v) => !v)} className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
          <RefreshCcw size={22} />
        </button>
      </div>
    </div>
  );
}
