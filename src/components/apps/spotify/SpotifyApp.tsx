import { useEffect, useState, type ReactNode } from "react";
import { ChevronDown, Heart, Pause, Play, Shuffle, SkipBack, SkipForward } from "lucide-react";
import whoArt from "@/assets/spotify/who.jpg.asset.json";
import howArt from "@/assets/spotify/how.jpg.asset.json";
import nineteenArt from "@/assets/spotify/1999.jpg.asset.json";
import why from "@/assets/spotify/why.jpg";

// Album art lives only here — swap a URL to change a cover.
export const PLAYLIST = [
  { id: "t1", srcId: "1.2.8", title: "돌아버리겠다", album: "WHO!", art: whoArt.url, len: 196 },
  { id: "t2", srcId: "1.2.8", title: "One and Only", album: "WHO!", art: whoArt.url, len: 196 },
  { id: "t3", srcId: "1.2.5", title: "뭣 같다", album: "WHY..", art: why, len: 181 },
  { id: "t4", srcId: "1.3.9", title: "Nice Guy", album: "19.99", art: nineteenArt.url, len: 188 },
  {
    id: "t5",
    srcId: "1.2.7",
    title: "So let's go see the stars",
    album: "HOW?",
    art: howArt.url,
    len: 192,
  },
];

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function Bars({ on }: { on: boolean }) {
  return (
    <span className="flex h-4 items-end gap-[2px]" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-sm bg-[#1ed760]"
          style={{
            height: on ? undefined : "30%",
            animation: on ? `spBar 0.${6 + i}s ease-in-out ${i * 0.1}s infinite alternate` : "none",
          }}
        />
      ))}
    </span>
  );
}

export default function SpotifyApp({ children }: { children?: ReactNode }) {
  const [index, setIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [full, setFull] = useState(false);
  const track = index === null ? null : PLAYLIST[index]!;

  useEffect(() => {
    if (!playing || !track) return;
    const t = setInterval(() => {
      setPos((p) => {
        if (p + 1 < track.len) return p + 1;
        setIndex((i) => ((i ?? 0) + 1) % PLAYLIST.length);
        return 0;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [playing, track]);

  const play = (i: number) => {
    if (i === index) return setPlaying((p) => !p);
    setIndex(i);
    setPos(0);
    setPlaying(true);
  };
  const skip = (d: number) => {
    setIndex((i) => ((i ?? 0) + d + PLAYLIST.length) % PLAYLIST.length);
    setPos(0);
    setPlaying(true);
  };

  return (
    <div className="relative flex h-full flex-col bg-[#121212] text-white">
      <style>{`@keyframes spBar{from{height:20%}to{height:100%}}`}</style>
      <div className="min-h-0 flex-1 overflow-y-auto pb-28">
        <div className="bg-gradient-to-b from-[#7a2d2d] to-[#121212] px-5 pb-5 pt-[calc(env(safe-area-inset-top)+60px)]">
          <div className="mx-auto grid h-[200px] w-[200px] grid-cols-2 overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
            {[...new Set(PLAYLIST.map((track) => track.art))].map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="h-full w-full object-cover"
                width={100}
                height={100}
              />
            ))}
          </div>
          <h1 className="mt-5 text-[24px] font-bold">보넥도 사랑 노래 모음</h1>
          <p className="mt-1 text-[13px] text-white/70">태산 · 곡 5개 · 약 15분</p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-5 text-white/70">
              <Heart size={24} />
              <Shuffle size={24} />
            </div>
            <button
              type="button"
              aria-label={playing ? "일시정지" : "재생"}
              onClick={() => play(index ?? 0)}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1ed760] text-black active:scale-95"
            >
              {playing ? (
                <Pause size={24} fill="currentColor" />
              ) : (
                <Play size={24} fill="currentColor" className="ml-0.5" />
              )}
            </button>
          </div>
        </div>
        <ul className="px-3">
          {PLAYLIST.map((t, i) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => play(i)}
                className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left active:bg-white/10"
              >
                <img
                  src={t.art}
                  alt={`${t.album} 앨범`}
                  loading="lazy"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-sm object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span
                    className={`block truncate text-[15px] ${index === i ? "text-[#1ed760]" : ""}`}
                  >
                    {t.title}
                  </span>
                  <span className="block truncate text-[13px] text-white/60">
                    BOYNEXTDOOR · {t.album}
                  </span>
                </span>
                {index === i ? (
                  <Bars on={playing} />
                ) : (
                  <span className="text-[13px] text-white/50">{fmt(t.len)}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
        {children}
      </div>

      {track && !full ? (
        <button
          type="button"
          onClick={() => setFull(true)}
          className="absolute inset-x-2 bottom-[calc(env(safe-area-inset-bottom)+24px)] overflow-hidden rounded-lg bg-[#5a2424] text-left"
        >
          <div className="flex items-center gap-3 p-2">
            <img
              src={track.art}
              alt=""
              className="h-10 w-10 rounded object-cover"
              width={40}
              height={40}
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-semibold">{track.title}</span>
              <span className="block truncate text-[12px] text-white/70">BOYNEXTDOOR</span>
            </span>
            <Bars on={playing} />
            <span
              role="button"
              aria-label={playing ? "일시정지" : "재생"}
              onClick={(e) => {
                e.stopPropagation();
                setPlaying((p) => !p);
              }}
              className="p-2"
            >
              {playing ? (
                <Pause size={22} fill="currentColor" />
              ) : (
                <Play size={22} fill="currentColor" />
              )}
            </span>
          </div>
          <div className="h-[2px] bg-white/20">
            <div className="h-full bg-white" style={{ width: `${(pos / track.len) * 100}%` }} />
          </div>
        </button>
      ) : null}

      {track && full ? (
        <div className="absolute inset-0 z-20 flex flex-col bg-gradient-to-b from-[#5a2424] to-[#121212] px-6 pb-[calc(env(safe-area-inset-bottom)+40px)] pt-[calc(env(safe-area-inset-top)+56px)]">
          <div className="flex items-center justify-between">
            <button type="button" aria-label="닫기" onClick={() => setFull(false)}>
              <ChevronDown size={28} />
            </button>
            <p className="text-[12px] font-semibold">보넥도 사랑 노래 모음</p>
            <span className="w-7" />
          </div>
          <img
            src={track.art}
            alt={`${track.album} 앨범`}
            className="mt-8 aspect-square w-full rounded-md object-cover shadow-2xl"
            width={400}
            height={400}
          />
          <div className="mt-8 flex items-center justify-between">
            <div className="min-w-0">
              <p className="truncate text-[22px] font-bold">{track.title}</p>
              <p className="text-[15px] text-white/70">BOYNEXTDOOR</p>
            </div>
            <Bars on={playing} />
          </div>
          <input
            type="range"
            aria-label="재생 위치"
            min={0}
            max={track.len}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            className="mt-6 w-full accent-white"
          />
          <div className="flex justify-between text-[11px] text-white/60">
            <span>{fmt(pos)}</span>
            <span>-{fmt(track.len - pos)}</span>
          </div>
          <div className="mt-6 flex items-center justify-around">
            <button type="button" aria-label="이전 곡" onClick={() => skip(-1)}>
              <SkipBack size={32} fill="currentColor" />
            </button>
            <button
              type="button"
              aria-label={playing ? "일시정지" : "재생"}
              onClick={() => setPlaying((p) => !p)}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black"
            >
              {playing ? (
                <Pause size={28} fill="currentColor" />
              ) : (
                <Play size={28} fill="currentColor" className="ml-1" />
              )}
            </button>
            <button type="button" aria-label="다음 곡" onClick={() => skip(1)}>
              <SkipForward size={32} fill="currentColor" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
