import type { StoryEnding } from "@/state/runState";

type EndingMessage = {
  id: string;
  day: number;
  time: string;
  room: string;
  from: string;
  type: "text";
  text: string;
};

export const endingEvents: Record<StoryEnding, EndingMessage[]> = {
  A: [
    { id: "ending-a-d16-morning", day: 16, time: "06:40", room: "sanghyuk", from: "상혁", type: "text", text: "일어났냐" },
    { id: "ending-a-d16-jaehyun", day: 16, time: "12:10", room: "jaehyun", from: "재현", type: "text", text: "급식 구역 이제 합법임. 성호가 규정 개정했대 ㅋㅋ" },
    { id: "ending-a-d17-gift", day: 17, time: "12:00", room: "sanghyuk", from: "상혁", type: "text", text: "선물임. 라켓은 팔았다 ㅋㅋ 이거 사려고." },
    { id: "ending-a-d18-play", day: 18, time: "16:20", room: "sanghyuk", from: "상혁", type: "text", text: "탁구 칠래? 이기면 소원 하나, 지면 네가 소원 하나." },
    { id: "ending-a-d20-song", day: 20, time: "17:10", room: "jaehyun", from: "재현", type: "text", text: "밴드 영상 보냈어. 다음 곡은 둘이 정해라." },
    { id: "ending-a-d21-seat", day: 21, time: "12:10", room: "sanghyuk", from: "상혁", type: "text", text: "오늘 옆자리 앉아도 되냐" },
    { id: "ending-a-d21-reply", day: 21, time: "12:11", room: "sanghyuk", from: "me", type: "text", text: "안 앉으면 규칙 위반이에요." },
  ],
  D: [
    { id: "ending-d-d16-morning", day: 16, time: "06:40", room: "sanghyuk", from: "상혁", type: "text", text: "일어났냐. 알람 이름 봤다 ㅋㅋ" },
    { id: "ending-d-d17-gift", day: 17, time: "12:00", room: "sanghyuk", from: "상혁", type: "text", text: "키링 선물임. 이거 사려고 라켓 판 거 맞는데 말 안 하려고 했음." },
    { id: "ending-d-d18-rumor", day: 18, time: "17:00", room: "class", from: "관리자C", type: "text", text: "[정정] 먼저 전화한 건 1학년이었음 ㅋㅋ" },
    { id: "ending-d-d19-jaehyun", day: 19, time: "15:10", room: "jaehyun", from: "재현", type: "text", text: "그때 지웠던 메시지 세 건, 허락받고 말하는 거야. 04:07, 04:09, 04:12에 보냈다 지웠어." },
    { id: "ending-d-d20-match", day: 20, time: "16:30", room: "tabletennis", from: "동현", type: "text", text: "복식 마지막 경기 간다. 형 오늘은 공 안 놓치겠지 ㅋㅋ" },
    { id: "ending-d-d21-seat", day: 21, time: "12:10", room: "sanghyuk", from: "상혁", type: "text", text: "내일부터 옆자리 계속 앉아도 되냐" },
    { id: "ending-d-d21-reply", day: 21, time: "12:11", room: "sanghyuk", from: "me", type: "text", text: "규칙 위반인데요." },
  ],
  B1: [
    { id: "ending-b1-d16", day: 16, time: "08:10", room: "sanghyuk", from: "상혁", type: "text", text: "밥은 먹었냐" },
    { id: "ending-b1-d17", day: 17, time: "18:00", room: "sanghyuk", from: "상혁", type: "text", text: "선물 보냈다. 부담되면 안 받아도 돼." },
    { id: "ending-b1-d18", day: 18, time: "20:10", room: "sanghyuk", from: "상혁", type: "text", text: "그냥 물어보려고 했어." },
    { id: "ending-b1-d19", day: 19, time: "20:10", room: "sanghyuk", from: "상혁", type: "text", text: "..." },
    { id: "ending-b1-d20", day: 20, time: "20:10", room: "sanghyuk", from: "상혁", type: "text", text: "잠은 잘 자라" },
    { id: "ending-b1-d21", day: 21, time: "20:10", room: "sanghyuk", from: "상혁", type: "text", text: "괜찮다. 천천히 해." },
  ],
  B2: [
    { id: "ending-b2-d16", day: 16, time: "08:10", room: "sanghyuk", from: "상혁", type: "text", text: "전화 안 받길래. 무서우면 안 받아도 돼. 기다릴게." },
    { id: "ending-b2-d17", day: 17, time: "20:10", room: "sanghyuk", from: "상혁", type: "text", text: "오늘은 밥 먹었냐" },
    { id: "ending-b2-d18", day: 18, time: "20:10", room: "sanghyuk", from: "상혁", type: "text", text: "답 안 해도 괜찮아." },
    { id: "ending-b2-d19", day: 19, time: "20:10", room: "sanghyuk", from: "상혁", type: "text", text: "내일도 모레도 기다릴게." },
    { id: "ending-b2-d20", day: 20, time: "20:10", room: "sanghyuk", from: "상혁", type: "text", text: "괜찮을 때 알림 확인해." },
    { id: "ending-b2-d21", day: 21, time: "20:10", room: "sanghyuk", from: "상혁", type: "text", text: "잘 자라." },
  ],
  B3: [
    { id: "ending-b3-d16", day: 16, time: "08:10", room: "sanghyuk", from: "상혁", type: "text", text: "어제 목소리 들어서 좋았다." },
    { id: "ending-b3-d17", day: 17, time: "20:10", room: "sanghyuk", from: "상혁", type: "text", text: "급하게 말 안 해도 돼." },
    { id: "ending-b3-d18", day: 18, time: "20:10", room: "sanghyuk", from: "상혁", type: "text", text: "오늘은 좀 괜찮았냐" },
    { id: "ending-b3-d19", day: 19, time: "20:10", room: "sanghyuk", from: "상혁", type: "text", text: "나중에 얘기하자고 한 거 기억하지" },
    { id: "ending-b3-d20", day: 20, time: "20:10", room: "sanghyuk", from: "상혁", type: "text", text: "기다릴게." },
    { id: "ending-b3-d21", day: 21, time: "20:10", room: "sanghyuk", from: "상혁", type: "text", text: "잘 자라." },
  ],
  C: [],
};