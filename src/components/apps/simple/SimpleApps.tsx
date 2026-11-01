import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Lock, MapPin, Phone as PhoneIcon, PhoneIncoming, PhoneMissed, PhoneOutgoing, Play, Search } from 'lucide-react';
import AppShell, { Group, Row, Tabs } from '@/components/apps/simple/AppShell';
import SpotifyApp from '@/components/apps/spotify/SpotifyApp';
import { unlockedPhotoIds } from '@/components/apps/photos/photoState';
import { PhoneOff, MicOff, Volume2, Delete } from 'lucide-react';
import {
  alarms,
  calcEggs,
  calls,
  contacts,
  health,
  HIDDEN_ALBUM_CODE,
  hiddenVideo,
  lunch,
  market,
  photoAlbums,
  places,
  schoolNotices,
  searches,
  shopA,
  shopB,
  sms,
  songs,
  timetable,
} from '@/data/story/apps-content';
import { useGameState } from '@/state/GameState';
import { addClue, setAppFlag } from '@/state/runState';

type Clued = { day: number; clue?: string };

/** Items unlock by story day; opening one that carries a clue collects it. */
function useStory() {
  const { run, update } = useGameState();
  const visible = <T extends Clued>(items: T[]) => items.filter((item) => item.day <= run.day);
  const reveal = (item: { clue?: string }) => {
    if (item.clue) update((current) => addClue(current, item.clue as string));
  };
  return { run, update, visible, reveal };
}

function Detail({ title, onBack, children }: { title: string; onBack: () => void; children: ReactNode }) {
  return (
    <AppShell title={title} onBack={onBack}>
      <div className="mt-2 rounded-[18px] bg-[var(--card)] p-4 text-[15px] leading-[1.7] whitespace-pre-line">{children}</div>
    </AppShell>
  );
}

/* ---------------- 전화 ---------------- */
export function PhoneApp() {
  const { visible, reveal } = useStory();
  const [tab, setTab] = useState<'recent' | 'contacts' | 'keypad'>('recent');
  const [open, setOpen] = useState<(typeof calls)[number] | null>(null);
  const [typed, setTyped] = useState('');
  const [calling, setCalling] = useState(false);
  const [secs, setSecs] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  useEffect(() => {
    if (!calling) return;
    setSecs(0);
    const t = setInterval(() => setSecs((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, [calling]);
  if (calling) {
    const known = calls.find((c) => c.name && typed && c.name.includes(typed));
    return (
      <div className="flex h-full flex-col items-center bg-[#1c2530] px-8 pb-[calc(env(safe-area-inset-bottom)+48px)] pt-[calc(env(safe-area-inset-top)+96px)] text-white">
        <p className="text-[14px] text-white/60">휴대전화</p>
        <h1 className="mt-1 break-all text-center text-[34px] font-light">{known?.name ?? typed}</h1>
        <p className="mt-2 text-[16px] text-white/70">{secs < 3 ? '발신 중…' : `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`}</p>
        <div className="mt-auto grid grid-cols-3 gap-x-8 gap-y-6">
          <button type="button" aria-pressed={muted} onClick={() => setMuted(!muted)} className="flex flex-col items-center gap-1 text-[12px]"><span className={`flex h-[72px] w-[72px] items-center justify-center rounded-full ${muted ? 'bg-white text-black' : 'bg-white/15'}`}><MicOff size={28} /></span>소리 끔</button>
          <span className="flex flex-col items-center gap-1 text-[12px]"><span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white/15 text-[20px]">⋮⋮⋮</span>키패드</span>
          <button type="button" aria-pressed={speaker} onClick={() => setSpeaker(!speaker)} className="flex flex-col items-center gap-1 text-[12px]"><span className={`flex h-[72px] w-[72px] items-center justify-center rounded-full ${speaker ? 'bg-white text-black' : 'bg-white/15'}`}><Volume2 size={28} /></span>스피커</button>
        </div>
        <button type="button" aria-label="통화 종료" onClick={() => setCalling(false)} className="mt-12 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#ff3b30]"><PhoneOff size={30} /></button>
        {secs >= 6 ? <p className="mt-4 text-[13px] text-white/60">연결이 되지 않아 음성사서함으로 넘어갑니다</p> : null}
      </div>
    );
  }
  if (open) return <Detail title={open.name} onBack={() => setOpen(null)}>{open.note ?? `${open.time} 통화`}</Detail>;
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        {tab === 'recent' ? (
          <AppShell title="최근 기록">
            <Group>
              {visible(calls).slice().reverse().map((call) => {
                const Icon = call.kind === 'missed' ? PhoneMissed : call.kind === 'in' ? PhoneIncoming : PhoneOutgoing;
                return (
                  <Row
                    key={call.id}
                    title={<span className={call.kind === 'missed' ? 'text-[var(--danger,#e5484d)]' : ''}>{call.name}</span>}
                    sub={<span className="inline-flex items-center gap-1"><Icon size={12} aria-hidden="true" />{call.kind === 'missed' ? '부재중' : '휴대전화'}</span>}
                    right={call.time}
                    onClick={() => {
                      reveal(call);
                      setOpen(call);
                    }}
                  />
                );
              })}
            </Group>
          </AppShell>
        ) : tab === 'contacts' ? (
          <AppShell title="연락처">
            <Group>{contacts.map((name) => <Row key={name} title={name} />)}</Group>
          </AppShell>
        ) : (
          <AppShell title="키패드">
            <p className="mt-6 h-10 text-center text-[32px] tabular-nums">{typed}</p>
            <div className="mx-auto mt-4 grid w-[260px] grid-cols-3 gap-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
                <button key={key} type="button" onClick={() => setTyped((v) => (v + key).slice(0, 13))} className="h-[72px] w-[72px] rounded-full bg-[var(--card)] text-[28px] active:opacity-60">
                  {key}
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-center gap-6">
              <span className="w-[72px]" />
              <button type="button" aria-label="전화 걸기" disabled={!typed} onClick={() => setCalling(true)} className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#34c759] text-white active:opacity-70">
                <PhoneIcon size={28} fill="currentColor" aria-hidden="true" />
              </button>
              <button type="button" aria-label="지우기" onClick={() => setTyped((v) => v.slice(0, -1))} className={`flex w-[72px] items-center justify-center text-[var(--fg-2)] ${typed ? '' : 'invisible'}`}><Delete size={26} /></button>
            </div>
          </AppShell>
        )}
      </div>
      <Tabs tabs={[{ id: 'recent', label: '최근 기록' }, { id: 'contacts', label: '연락처' }, { id: 'keypad', label: '키패드' }]} value={tab} onChange={setTab} />
    </div>
  );
}

/* ---------------- 메시지 ---------------- */
export function MessageApp() {
  const { visible } = useStory();
  const [open, setOpen] = useState<(typeof sms)[number] | null>(null);
  const list = visible(sms).slice().reverse();
  if (open) {
    return (
      <AppShell title={open.from} onBack={() => setOpen(null)}>
        <div className="mt-2 flex flex-col gap-2">
          {open.lines.map((line, i) => (
            <p key={i} className="max-w-[78%] self-start rounded-[18px] bg-[var(--card)] px-3.5 py-2 text-[15px]">{line}</p>
          ))}
        </div>
      </AppShell>
    );
  }
  return (
    <AppShell title="메시지">
      <Group>
        {list.map((item) => (
          <Row key={item.id} title={item.from} sub={item.lines[item.lines.length - 1]} right={`10/${13 + item.day}`} onClick={() => setOpen(item)} />
        ))}
      </Group>
    </AppShell>
  );
}

/* ---------------- 나이스플러스 ---------------- */
export function NeisApp() {
  const { visible, reveal, run } = useStory();
  const [tab, setTab] = useState<'notice' | 'time' | 'lunch' | 'grades'>('notice');
  const [open, setOpen] = useState<(typeof schoolNotices)[number] | null>(null);
  if (open) return <Detail title="학교 공지" onBack={() => setOpen(null)}><b>{open.title}</b>{'\n\n'}{open.body}</Detail>;
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <AppShell title="나이스플러스">
          <p className="px-2 text-[13px] text-[var(--fg-2)]">보넥고등학교 · 1학년 3반 태산</p>
          {tab === 'notice' ? (
            <Group label="공지">
              {visible(schoolNotices).slice().reverse().map((n) => (
                <Row key={n.id} title={n.title} sub={n.body.split('\n')[0]} right={`10/${13 + n.day}`} onClick={() => { reveal(n); setOpen(n); }} />
              ))}
            </Group>
          ) : tab === 'time' ? (
            <Group label={`시간표 · 10/${13 + run.day}`}>
              {(timetable[0] ?? []).map((subject: string, i: number) => <Row key={i} title={subject} right={`${i + 1}교시`} />)}
            </Group>
          ) : tab === 'lunch' ? (
            <>
              <Group label="오늘의 급식 · 중식">{lunch.map((dish: string) => <Row key={dish} title={dish} />)}</Group>
              <p className="mt-2 px-2 text-[12px] leading-5 text-[var(--fg-2)]">782 kcal · 알레르기: 우유, 달걀, 대두, 돼지고기</p>
            </>
          ) : (
            <>
              <Group label="1학기 성적 · 1학년 3반 태산">
                {[['국어', '88', '2'], ['수학', '92', '1'], ['영어', '85', '2'], ['통합사회', '90', '1'], ['통합과학', '87', '2'], ['한국사', '94', '1'], ['체육', 'A', '-']].map(([sub, sc, g]) => (
                  <Row key={sub} title={sub} sub={g === '-' ? '성취도' : `원점수 ${sc}점`} right={g === '-' ? sc : `${g}등급`} />
                ))}
              </Group>
              <p className="mt-2 px-2 text-[12px] text-[var(--fg-2)]">평균 등급 1.6 · 석차는 학교 정책에 따라 표시하지 않아요</p>
            </>
          )}
        </AppShell>
      </div>
      <Tabs tabs={[{ id: 'notice', label: '공지' }, { id: 'time', label: '시간표' }, { id: 'lunch', label: '급식' }, { id: 'grades', label: '성적' }]} value={tab} onChange={setTab} />
    </div>
  );
}

/* ---------------- 무신사 / 에이블리 ---------------- */
function ProductDetail({ shop, name, price, note, onBack }: { shop: string; name: string; price: string; note?: string; onBack: () => void }) {
  const [liked, setLiked] = useState(true);
  return (
    <Detail title={shop} onBack={onBack}>
      <b>{name}</b>
      {'\n'}
      {price}
      {note ? `\n\n${note}` : ''}
      {'\n\n'}
      <button type="button" onClick={() => setLiked(!liked)} className="rounded-full bg-[var(--card)] px-4 py-2 text-[14px] font-semibold">
        {liked ? '♥ 찜 해제' : '♡ 찜하기'}
      </button>
    </Detail>
  );
}

export function ShopAApp() {
  const [open, setOpen] = useState<(typeof shopA)[number] | null>(null);
  if (open) return <ProductDetail shop="무신사" name={open.name} price={open.price} note={open.note} onBack={() => setOpen(null)} />;
  return (
    <AppShell title="무신사">
      {(['장바구니', '최근 본 상품', '좋아요'] as const).map((tag) => (
        <Group key={tag} label={tag}>
          {shopA.filter((item) => item.tag === tag).map((item) => (
            <Row key={item.id} title={item.name} sub={item.note} right={item.price} onClick={() => setOpen(item)} />
          ))}
        </Group>
      ))}
    </AppShell>
  );
}

export function ShopBApp() {
  const [open, setOpen] = useState<(typeof shopB)[number] | null>(null);
  if (open) return <ProductDetail shop="에이블리" name={open.name} price={open.price} onBack={() => setOpen(null)} />;
  return (
    <AppShell title="에이블리">
      <Group label="찜한 상품">
        {shopB.map((item) => <Row key={item.id} title={item.name} right={item.price} onClick={() => setOpen(item)} />)}
      </Group>
    </AppShell>
  );
}

/* ---------------- 당근 ---------------- */
export function MarketApp() {
  const { visible, reveal } = useStory();
  const [open, setOpen] = useState<(typeof market)[number] | null>(null);
  if (open) return <Detail title="당근" onBack={() => setOpen(null)}><b>{open.title}</b>{'\n'}{open.place}{'\n\n'}{open.note ?? open.price}</Detail>;
  return (
    <AppShell title="보넥동">
      <Group>
        {visible(market).slice().reverse().map((item) => (
          <Row
            key={item.id}
            title={<span className={item.deleted ? 'text-[var(--fg-2)]' : ''}>{item.title}</span>}
            sub={item.place}
            right={item.price}
            onClick={() => { reveal(item); setOpen(item); }}
          />
        ))}
      </Group>
    </AppShell>
  );
}

/* ---------------- 스포티파이 ---------------- */
export function MusicApp() {
  const { visible, reveal } = useStory();
  const [playing, setPlaying] = useState<(typeof songs)[number] | null>(null);
  const list = visible(songs).slice().sort((a, b) => b.plays - a.plays);
  return (
    <AppShell title="최근 재생">
      {playing ? (
        <div className="mt-2 flex items-center gap-3 rounded-[18px] bg-[var(--card)] p-4">
          <Play size={22} aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold">{playing.title}</p>
            <p className="text-[12px] text-[var(--fg-2)]">{playing.note ?? playing.artist}</p>
          </div>
        </div>
      ) : null}
      <Group label="많이 들은 곡">
        {list.map((song, i) => (
          <Row key={song.id} title={`${i + 1}. ${song.title}`} sub={song.artist} right={`${song.plays}회`} onClick={() => { reveal(song); setPlaying(song); }} />
        ))}
      </Group>
    </AppShell>
  );
}

/* ---------------- 사진 (비공개 앨범 퍼즐) ---------------- */
export function PhotosApp() {
  const { run, update, reveal } = useStory();
  const [view, setView] = useState<'list' | 'hidden'>('list');
  const [code, setCode] = useState('');
  const unlocked = run.appFlags.hiddenAlbum === 'open';
  if (view === 'hidden') {
    return (
      <AppShell title="비공개 앨범" onBack={() => setView('list')}>
        {unlocked ? (
          run.day >= hiddenVideo.day ? (
            <button type="button" onClick={() => reveal(hiddenVideo)} className="mt-2 w-full rounded-[18px] bg-[var(--card)] p-4 text-left">
              <span className="flex aspect-video items-center justify-center rounded-[12px] bg-black/80 text-white"><Play size={34} aria-hidden="true" /></span>
              <p className="mt-3 text-[15px] font-semibold">{hiddenVideo.title}</p>
              <p className="text-[13px] text-[var(--fg-2)]">{hiddenVideo.views}</p>
              <p className="mt-2 text-[14px]">{hiddenVideo.note}</p>
            </button>
          ) : (
            <p className="mt-10 text-center text-[14px] text-[var(--fg-2)]">항목이 없어요</p>
          )
        ) : (
          <div className="mt-10 flex flex-col items-center gap-3">
            <Lock size={30} aria-hidden="true" />
            <p className="text-[14px] text-[var(--fg-2)]">비밀번호 네 자리를 입력하세요</p>
            <input
              value={code}
              onChange={(e) => {
                const next = e.target.value.replace(/\D/g, '').slice(0, 4);
                setCode(next);
                if (next === HIDDEN_ALBUM_CODE) update((c) => setAppFlag(c, 'hiddenAlbum', 'open'));
              }}
              inputMode="numeric"
              aria-label="앨범 비밀번호"
              className="h-12 w-40 rounded-[12px] bg-[var(--card)] text-center text-[22px] tracking-[0.4em] outline-none"
            />
            {code.length === 4 && code !== HIDDEN_ALBUM_CODE ? <p className="text-[13px] text-[var(--danger,#e5484d)]">비밀번호가 달라요</p> : null}
            <p className="px-6 text-center text-[12px] text-[var(--fg-2)]">힌트: 5월, 그날</p>
          </div>
        )}
      </AppShell>
    );
  }
  return (
    <AppShell title="앨범">
      <div className="mt-2 grid grid-cols-2 gap-3">
        {photoAlbums.map((album) => (
          <div key={album.id} className="rounded-[14px] bg-[var(--card)] p-3">
            <div className="aspect-square rounded-[10px] bg-[var(--bg)]" />
            <p className="mt-2 text-[14px] font-semibold">{album.name}</p>
            <p className="text-[12px] text-[var(--fg-2)]">{album.count}</p>
          </div>
        ))}
        <button type="button" onClick={() => setView('hidden')} className="rounded-[14px] bg-[var(--card)] p-3 text-left">
          <div className="flex aspect-square items-center justify-center rounded-[10px] bg-[var(--bg)]"><Lock size={26} aria-hidden="true" /></div>
          <p className="mt-2 text-[14px] font-semibold">비공개</p>
          <p className="text-[12px] text-[var(--fg-2)]">잠김</p>
        </button>
      </div>
    </AppShell>
  );
}

/* ---------------- 시계 (알람 이름 바꾸기) ---------------- */
function formatLap(ms: number) {
  const v = Math.floor(ms / 10);
  return `${String(Math.floor(v / 6000)).padStart(2, '0')}:${String(Math.floor(v / 100) % 60).padStart(2, '0')}.${String(v % 100).padStart(2, '0')}`;
}

function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const startedAt = useRef(0);
  const acc = useRef(0);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setElapsed(acc.current + performance.now() - startedAt.current), 32);
    return () => window.clearInterval(timer);
  }, [running]);
  function toggle() {
    if (running) {
      acc.current += performance.now() - startedAt.current;
      setElapsed(acc.current);
    } else startedAt.current = performance.now();
    setRunning(!running);
  }
  function lapOrReset() {
    if (running) setLaps((l) => [...l, acc.current + performance.now() - startedAt.current]);
    else {
      acc.current = 0;
      setElapsed(0);
      setLaps([]);
    }
  }
  return (
    <AppShell title="스톱워치">
      <p className="my-14 text-center text-[48px] font-light tabular-nums">{formatLap(elapsed)}</p>
      <div className="flex justify-around">
        <button type="button" onClick={lapOrReset} disabled={!running && elapsed === 0} className="h-20 w-20 rounded-full bg-[var(--card)] disabled:opacity-40">
          {running ? '랩' : '재설정'}
        </button>
        <button type="button" onClick={toggle} className="h-20 w-20 rounded-full bg-[var(--card)] font-semibold text-[var(--accent)]">
          {running ? '중단' : '시작'}
        </button>
      </div>
      {laps.length > 0 && (
        <Group label="랩 기록">
          {laps.map((total, i) => <Row key={i} title={`랩 ${i + 1}`} right={formatLap(total - (laps[i - 1] ?? 0))} />).reverse()}
        </Group>
      )}
    </AppShell>
  );
}

const WEEK_STEPS = [
  { day: '월', steps: 5820 }, { day: '화', steps: 7340 }, { day: '수', steps: 6120 }, { day: '목', steps: 8900 },
  { day: '금', steps: 4230 }, { day: '토', steps: 7147 }, { day: '일', steps: 6412 },
];

export function ClockApp() {
  const { run, update, visible, reveal } = useStory();
  const [tab, setTab] = useState<'alarm' | 'world' | 'stopwatch'>('alarm');
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const labelOf = (id: string, fallback: string) => run.appFlags[`alarm:${id}`] ?? fallback;
  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        {tab === 'alarm' ? (
          <AppShell title="알람">
            <Group>
              {visible(alarms).map((alarm) =>
                editing === alarm.id ? (
                  <div key={alarm.id} className="flex items-center gap-2 px-4 py-3">
                    <input value={draft} onChange={(e) => setDraft(e.target.value.slice(0, 16))} aria-label="알람 이름" className="h-10 flex-1 rounded-[10px] bg-[var(--bg)] px-3 text-[15px] outline-none" />
                    <button
                      type="button"
                      onClick={() => {
                        update((c) => setAppFlag(c, `alarm:${alarm.id}`, draft.trim() || alarm.label));
                        setEditing(null);
                      }}
                      className="text-[15px] font-semibold text-[var(--accent)]"
                    >
                      저장
                    </button>
                  </div>
                ) : (
                  <Row
                    key={alarm.id}
                    title={<span className="text-[34px] font-light tabular-nums">{alarm.time}</span>}
                    sub={`${labelOf(alarm.id, alarm.label)} · ${alarm.repeat}`}
                    right="이름 변경"
                    onClick={() => {
                      reveal(alarm);
                      setDraft(labelOf(alarm.id, alarm.label));
                      setEditing(alarm.id);
                    }}
                  />
                ),
              )}
            </Group>
          </AppShell>
        ) : tab === 'world' ? (
          <AppShell title="세계 시계">
            <Group>
              <Row title="서울" sub="오늘" right="현재" />
              <Row title="도쿄" sub="오늘" right="+0시간" />
              <Row title="런던" sub="오늘" right="-9시간" />
            </Group>
          </AppShell>
        ) : (
          <Stopwatch />
        )}
      </div>
      <Tabs tabs={[{ id: 'world', label: '세계 시계' }, { id: 'alarm', label: '알람' }, { id: 'stopwatch', label: '스톱워치' }]} value={tab} onChange={setTab} />
    </div>
  );
}

/* ---------------- 사파리 ---------------- */
export function BrowserApp() {
  const { visible, reveal } = useStory();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<(typeof searches)[number] | null>(null);
  if (open) return <Detail title="검색 기록" onBack={() => setOpen(null)}><b>{open.text}</b>{'\n'}{open.note ?? '검색 결과를 불러올 수 없어요 (오프라인 기록)'}</Detail>;
  return (
    <AppShell title="사파리">
      <label className="mt-1 flex h-11 items-center gap-2 rounded-[12px] bg-[var(--card)] px-3">
        <Search size={16} aria-hidden="true" className="text-[var(--fg-2)]" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="검색 또는 웹사이트 이름" className="flex-1 bg-transparent text-[15px] outline-none" />
      </label>
      <p className="mt-3 px-2 text-[13px] text-[var(--fg-2)]">{query.trim() ? '저장된 검색 기록에서 찾은 결과예요.' : '저장된 페이지를 검색하고 열어 보세요.'}</p>
      <Group label="최근 검색">
        {visible(searches).filter((item) => item.text.toLowerCase().includes(query.trim().toLowerCase())).slice().reverse().map((item) => (
          <Row key={item.id} title={item.text} right={item.repeat ? `${item.repeat}회` : undefined} onClick={() => { reveal(item); setOpen(item); }} />
        ))}
      </Group>
    </AppShell>
  );
}

/* ---------------- 건강 ---------------- */
export function HealthApp() {
  const { visible, reveal } = useStory();
  const [open, setOpen] = useState<(typeof health)[number] | null>(null);
  if (open) return <Detail title={open.label} onBack={() => setOpen(null)}><b>{open.value}</b>{'\n'}{open.note ?? ''}</Detail>;
  return (
    <AppShell title="요약">
      <section className="mt-3 rounded-[18px] bg-[var(--card)] p-4">
        <p className="text-[14px] text-[var(--fg-2)]">오늘 걸음</p>
        <p className="mt-1 text-[36px] font-semibold tabular-nums">6,412 <span className="text-[15px] font-normal">걸음</span></p>
        <p className="mt-1 text-[12px] text-[var(--fg-2)]">이번 주 일평균 6,567걸음</p>
        <div className="mt-4 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WEEK_STEPS}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--fg-2)', fontSize: 12 }} />
              <Tooltip formatter={(v) => [`${Number(v).toLocaleString('ko-KR')}걸음`, '걸음 수']} contentStyle={{ background: 'var(--card)', color: 'var(--fg)', borderRadius: 12 }} cursor={false} />
              <Bar dataKey="steps" fill="var(--accent)" radius={[6, 6, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
      <Group label="활동">
        {visible(health).map((item) => (
          <Row key={item.id} title={item.label} right={item.value} onClick={() => { reveal(item); setOpen(item); }} />
        ))}
      </Group>
    </AppShell>
  );
}

/* ---------------- 지도 (장소 찾기 퍼즐) ---------------- */
export function MapApp() {
  const { run, update } = useStory();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<(typeof places)[number] | null>(null);
  const q = query.trim().toLowerCase();
  const results = q ? places.filter((place) => place.keywords.some((k) => q.includes(k) || k.includes(q))) : [];
  const pinned = places.filter((place) => run.appFlags[`pin:${place.id}`] === '1');

  function choose(place: (typeof places)[number]) {
    setSelected(place);
    update((c) => setAppFlag(c, `pin:${place.id}`, '1'));
  }

  return (
    <div className="relative flex h-full flex-col bg-[var(--bg)] text-[var(--fg)]">
      <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,.8) 2px, transparent 2px), linear-gradient(rgba(255,255,255,.8) 2px, transparent 2px)', backgroundSize: '64px 64px' }} />
      <div className="relative px-3 pt-[calc(env(safe-area-inset-top)+58px)]">
        <label className="flex h-12 items-center gap-2 rounded-[14px] bg-[var(--card)] px-3 shadow-sm">
          <Search size={16} aria-hidden="true" className="text-[var(--fg-2)]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="장소 검색" className="flex-1 bg-transparent text-[15px] outline-none" />
        </label>
        {results.length ? (
          <div className="mt-2 overflow-hidden rounded-[14px] bg-[var(--card)]">
            {results.map((place) => <Row key={place.id} title={place.name} onClick={() => { choose(place); setQuery(''); }} />)}
          </div>
        ) : q ? (
          <p className="mt-2 rounded-[14px] bg-[var(--card)] px-4 py-3 text-[13px] text-[var(--fg-2)]">검색 결과가 없어요</p>
        ) : null}
      </div>
      <div className="relative min-h-[280px] flex-1 overflow-hidden">
        <div className="absolute left-[12%] top-[12%] h-[38%] w-[66%] rounded-[24px] border-4 border-[var(--card)] bg-[var(--accent)]/10" />
        <div className="absolute left-0 top-[58%] h-8 w-full -rotate-12 bg-[var(--card)]" />
        <div className="absolute left-[62%] top-0 h-full w-6 rotate-12 bg-[var(--card)]" />
        <span className="absolute left-[30%] top-[28%] text-[12px] font-semibold text-[var(--fg-2)]">보넥고등학교</span>
        <span className="absolute bottom-3 left-3 rounded-lg bg-[var(--card)] px-2 py-1 text-[11px] text-[var(--fg-2)]">보넥동 · 학교 주변 약도</span>
        {pinned.map((place, i) => (
          <button key={place.id} type="button" onClick={() => choose(place)} className="absolute flex flex-col items-center" style={{ left: `${20 + ((i * 37) % 60)}%`, top: `${15 + ((i * 23) % 55)}%` }}>
            <MapPin size={30} className="text-[#e5484d]" aria-hidden="true" />
            <span className="rounded-full bg-[var(--card)] px-2 py-0.5 text-[11px] font-semibold">{place.name}</span>
          </button>
        ))}
      </div>
      <div className="relative m-3 mb-[calc(env(safe-area-inset-bottom)+16px)] rounded-[18px] bg-[var(--card)] p-4">
        {selected ? (
          <>
            <p className="text-[17px] font-semibold">{selected.name}</p>
            <p className="mt-1 text-[14px] text-[var(--fg-2)]">{selected.note}</p>
          </>
        ) : (
          <p className="text-[14px] text-[var(--fg-2)]">즐겨찾기 {pinned.length}곳 · 장소를 검색해 보세요</p>
        )}
      </div>
    </div>
  );
}

/* ---------------- 계산기 ---------------- */
export function CalcApp() {
  const [display, setDisplay] = useState('0');
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);
  const [egg, setEgg] = useState<string | null>(null);

  useEffect(() => {
    setEgg((calcEggs as Record<string, string>)[display] ?? null);
  }, [display]);

  function digit(d: string) {
    setDisplay((v) => (fresh || v === '0' ? d : (v + d).slice(0, 9)));
    setFresh(false);
  }
  function compute(a: number, b: number, o: string) {
    if (o === '+') return a + b;
    if (o === '−') return a - b;
    if (o === '×') return a * b;
    if (o === '÷') return b === 0 ? NaN : a / b;
    return b;
  }
  function operator(o: string) {
    const cur = Number(display);
    const result = acc !== null && op && !fresh ? compute(acc, cur, op) : cur;
    setAcc(result);
    setDisplay(Number.isFinite(result) ? String(+result.toPrecision(9)) : '오류');
    setOp(o === '=' ? null : o);
    setFresh(true);
    if (o === '=') setAcc(null);
  }
  const keys = ['AC', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '0', '.', '='];
  return (
    <div className="flex h-full flex-col justify-end bg-black px-4 pb-[calc(env(safe-area-inset-bottom)+24px)] text-white">
      <p className="h-6 text-right text-[14px] text-white/60">{egg}</p>
      <p className="truncate px-2 text-right text-[72px] font-light tabular-nums">{display}</p>
      <div className="mt-3 grid grid-cols-4 gap-3">
        {keys.map((k) => {
          const isOp = ['÷', '×', '−', '+', '='].includes(k);
          const isFn = ['AC', '±', '%'].includes(k);
          return (
            <button
              key={k}
              type="button"
              onClick={() => {
                if (k === 'AC') { setDisplay('0'); setAcc(null); setOp(null); setFresh(true); }
                else if (k === '±') setDisplay((v) => String(-Number(v)));
                else if (k === '%') setDisplay((v) => String(Number(v) / 100));
                else if (k === '.') { setDisplay((v) => (fresh ? '0.' : v.includes('.') ? v : v + '.')); setFresh(false); }
                else if (isOp) operator(k);
                else digit(k);
              }}
              className={`h-[76px] rounded-full text-[30px] active:opacity-70 ${k === '0' ? 'col-span-2 pl-7 text-left' : ''} ${isOp ? 'bg-[#ff9f0a]' : isFn ? 'bg-[#a5a5a5] text-black' : 'bg-[#333333]'}`}
            >
              {k}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const SIMPLE_APPS: Record<string, () => ReactNode> = {
  phone: PhoneApp,
  message: MessageApp,
  neis: NeisApp,
  shopA: ShopAApp,
  shopB: ShopBApp,
  market: MarketApp,
  music: MusicApp,
  video: PhotosApp,
  clock: ClockApp,
  browser: BrowserApp,
  health: HealthApp,
  map: MapApp,
  calc: CalcApp,
};

