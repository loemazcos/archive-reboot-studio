/*
 * 기본 앱 내용 (전화, 메시지, 나이스플러스, 쇼핑, 당근, 스포티파이, 사진, 시계, 사파리, 건강, 지도, 계산기)
 * - day: 그 날(1 = 10/14)부터 보입니다.
 * - clue: 이 항목을 눌러 확인하면 얻는 단서 번호.
 */
export const calls = [
  { id: 'c1', name: '엄마', time: '어제', kind: 'in', day: 1 },
  { id: 'c2', name: '동현', time: '어제', kind: 'out', day: 1 },
  { id: 'c3', name: '상혁 선배', time: '04:12', kind: 'missed', day: 3, clue: 'C23', note: '새벽 04:12 · 부재중 통화 1회 · 통화 시간 0초' },
  { id: 'c4', name: '재현 선배', time: '18:40', kind: 'in', day: 5 },
  { id: 'c5', name: '010-****-0529', time: '23:58', kind: 'missed', day: 9 },
];

export const contacts = ['동현', '상혁 선배', '성호 선배', '엄마', '재현 선배', '하린', '유나', '민재'];

export const sms = [
  { id: 's1', from: '엄마', day: 1, lines: ['태산아 내일 우산 챙겨', '그리고 일찍 자라'] },
  { id: 's2', from: '보넥고등학교', day: 1, lines: ['[보넥고] 10/28 축제 당일 정상 등교. 단체복 착용 바랍니다.'] },
  { id: 's3', from: '토스', day: 1, lines: ['[토스] 상혁님이 1원을 보냈어요. 2시간 13분 뒤 만료돼요.'] },
  { id: 's4', from: 'CU 편의점', day: 3, lines: ['[CU] 택배가 도착했습니다. 보넥고점'] },
  { id: 's5', from: '엄마', day: 8, lines: ['30일 생일인데 뭐 먹고 싶어?', '친구들 불러도 돼'] },
];

export const schoolNotices = [
  { id: 'nn1', day: 1, title: '[학생회] 10/28 축제 단체복 투표 안내', body: '반별 단체복 투표는 10월 18일까지 진행합니다.' },
  { id: 'nn2', day: 2, title: '[체육부] 체육관 정기 점검 (10/15)', body: '점검 구역: 체육관, 체육관 뒷문, 1학년 급식 구역' },
  { id: 'nn3', day: 4, title: '[체육부] 체육관 정기 점검 (10/17)', body: '점검 구역: 체육관, 체육관 뒷문, 1학년 급식 구역' },
  { id: 'nn4', day: 7, title: '[학생부] 정문 조명 교체 공사', body: '저녁 7시 이후 후문을 이용해 주세요.' },
  { id: 'nn5', day: 10, title: '[체육부] 체육관 정기 점검 (10/23)', body: '점검 구역: 체육관, 체육관 뒷문\n(1학년 급식 구역은 이번 점검에서 제외합니다.)', clue: 'C21' },
  { id: 'nn6', day: 12, title: '[교무부] 2학기 중간고사 성적 확인 안내', body: '나이스플러스에서 확인할 수 있습니다.' },
  { id: 'nn7', day: 14, title: '[학생회] 축제 부스 배치도', body: '탁구부 부스: 체육관 2층. 무대: 운동장.' },
];

export const timetable = [
  ['국어', '수학', '영어', '체육', '과학', '사회', '창체'],
];

export const lunch = ['쌀밥', '돈육김치찌개', '계란말이', '깍두기', '요구르트'];

export const shopA = [
  { id: 'a1', name: '오버핏 후드 집업 (차콜)', price: '59,000원', tag: '장바구니' },
  { id: 'a2', name: '탁구 손목 보호대 2P', price: '12,900원', tag: '최근 본 상품', note: '선물 포장 가능' },
  { id: 'a3', name: '스포츠 양말 3팩', price: '9,900원', tag: '최근 본 상품' },
  { id: 'a4', name: '바람막이 (네이비)', price: '69,000원', tag: '좋아요' },
];

export const shopB = [
  { id: 'b1', name: '리본 헤어핀 세트', price: '8,900원' },
  { id: 'b2', name: '니트 가디건 (아이보리)', price: '32,000원' },
  { id: 'b3', name: '축제용 머리띠', price: '6,500원' },
];

export const market = [
  { id: 'm1', day: 1, title: '탁구 라켓 (거의 새것)', price: '25,000원', place: '보넥동 · 3일 전' },
  { id: 'm2', day: 1, title: '교복 마이 사이즈 90', price: '15,000원', place: '보넥동 · 1주 전' },
  { id: 'm3', day: 3, title: '아이패드 거치대', price: '나눔', place: '중앙동 · 1일 전' },
  { id: 'm4', day: 7, title: '삭제된 게시글입니다', price: '', place: '판매자: 보넥스포츠 (체육관 앞)', deleted: true, clue: 'C18', note: '"손목 보호대 · 새벽 운동용 · 선물 포장" — 판매자가 글을 삭제했어요.' },
  { id: 'm5', day: 9, title: '축제 부스용 조명', price: '10,000원', place: '보넥동 · 2시간 전' },
];

export const songs = [
  { id: 'p1', title: '새벽 네 시의 박수', artist: 'Lucid', plays: 312, day: 5, clue: 'C14', note: '가장 많이 재생한 곡 · 상혁 선배 스토리 배경음과 같은 곡' },
  { id: 'p2', title: '가을 방학', artist: '윤서', plays: 48, day: 1 },
  { id: 'p3', title: 'Bench', artist: 'nell grey', plays: 33, day: 1 },
  { id: 'p4', title: '고백 타이밍', artist: '오후', plays: 21, day: 1 },
  { id: 'p5', title: 'Run', artist: 'Moss', plays: 12, day: 1 },
];

export const photoAlbums = [
  { id: 'recent', name: '최근 항목', count: 214 },
  { id: 'fav', name: '즐겨찾는 항목', count: 12 },
  { id: 'screens', name: '스크린샷', count: 37 },
];
export const HIDDEN_ALBUM_CODE = '0529';
export const hiddenVideo = {
  title: '5.29 탁구부 연습 영상',
  views: '조회 기록: 5월 29일 41회 · 그 외 3회',
  note: '연습 영상 끝에 체육관 뒤 벤치가 잠깐 비친다.',
  day: 9,
  clue: 'C15',
};

export const alarms = [
  { id: 'al1', time: '05:30', label: '알람', day: 8, clue: 'C22', repeat: '매일' },
  { id: 'al2', time: '07:00', label: '기상', day: 1, repeat: '주중' },
  { id: 'al3', time: '07:10', label: '진짜 기상', day: 1, repeat: '주중' },
];

export const searches = [
  { id: 'q1', text: '보넥고 축제 날짜', day: 1 },
  { id: 'q2', text: '탁구 서브 잘하는 법', day: 1 },
  { id: 'q3', text: '1원 송금 의미', day: 1 },
  { id: 'q4', text: '선배한테 답장 언제', day: 6, repeat: 8, clue: 'C20', note: '같은 검색어 8회 · 마지막 검색 02:14' },
  { id: 'q5', text: '10월 22일 생일 선물', day: 7 },
];

export const health = [
  { id: 'h1', label: '오늘 걸음', value: '6,412걸음', day: 1 },
  { id: 'h2', label: '새벽 04:00–05:00', value: '1,870걸음', day: 2, clue: 'C24', note: '위치: 체육관 근처 · 같은 구간을 여러 번 돌았어요' },
  { id: 'h3', label: '평균 수면', value: '5시간 42분', day: 1 },
];

export const places = [
  { id: 'gym', name: '보넥고 체육관', keywords: ['체육관'], note: '탁구부 연습 장소. 새벽 5시 30분부터 불이 켜져 있을 때가 많다.' },
  { id: 'bench', name: '체육관 뒤 벤치', keywords: ['벤치', '체육관 뒤', '뒤 벤치'], note: '체육관 뒷문을 나가면 보이는 벤치. 사람이 거의 없다.', secret: true },
  { id: 'store', name: '보넥스포츠', keywords: ['보넥스포츠', '스포츠'], note: '체육관 앞 스포츠용품점.' },
  { id: 'school', name: '보넥고등학교', keywords: ['학교', '보넥고'], note: '정문 조명 공사 중. 저녁엔 후문 이용.' },
  { id: 'cu', name: 'CU 보넥고점', keywords: ['cu', '편의점'], note: '학교 앞 편의점.' },
];

export const calcEggs = {
  '1022': '10월 22일. 어디서 많이 본 숫자다.',
  '1030': '내 생일.',
  '529': '5월 29일.',
  '0529': '5월 29일.',
  '1028': '축제 날.',
};
