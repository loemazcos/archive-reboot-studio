import { useEffect, useMemo, useState } from "react";
import KakaoRoomList from "@/components/apps/kakao/KakaoRoomList";
import KakaoRoomChat from "@/components/apps/kakao/KakaoRoomChat";
import { kakaoRooms, kakaoUnread, type KakaoMessage, type KakaoRoom } from "@/lib/kakao";
import { useGameState } from "@/state/GameState";
import { chooseConsult, voteUniform } from "@/state/kakaoActions";
import { UNIFORM_POLL_ID } from "@/state/kakaoEvents";
import { leaveThread, viewThread } from "@/state/runState";

export default function KakaoApp() {
  const { run, update } = useGameState();
  const [openId, setOpenId] = useState<string | null>(null);
  const [sent, setSent] = useState<Record<string, KakaoMessage[]>>({});
  useEffect(() => () => update(leaveThread), [update]);

  const rooms = useMemo<KakaoRoom[]>(
    () =>
      kakaoRooms.map((room) => ({
        ...room,
        unread: kakaoUnread(room, run),
        messages: [
          ...room.messages,
          ...run.kakaoAdded.filter((message) => message.room === room.id),
          ...(sent[room.id] ?? []),
        ],
      })),
    [sent, run],
  );

  const votes: Record<string, number> =
    run.uniform === null ? {} : { [UNIFORM_POLL_ID]: run.uniform - 1 };

  const activeRoom = rooms.find((room) => room.id === openId) ?? null;

  if (activeRoom) {
    return (
      <KakaoRoomChat
        room={activeRoom}
        votes={votes}
        onBack={() => {
          setOpenId(null);
          update(leaveThread);
        }}
        onVote={(messageId, optionIndex) => {
          if (messageId !== UNIFORM_POLL_ID) return;
          update((current) => voteUniform(current, optionIndex === 0 ? 1 : 2));
        }}
        onSend={(text) =>
          setSent((current) => ({
            ...current,
            [activeRoom.id]: [
              ...(current[activeRoom.id] ?? []),
              {
                id: `sent-${Date.now()}`,
                date: "2026-10-14",
                time: "방금",
                from: "me",
                type: "text",
                text,
              },
            ],
          }))
        }
      />
    );
  }

  return (
    <KakaoRoomList
      rooms={rooms}
      onOpen={(id) => {
        update((current) => viewThread(current, id));
        setOpenId(id);
      }}
    />
  );
}
