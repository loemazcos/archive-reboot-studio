import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const GameApp = lazy(() => import("@/components/GameApp"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "태산의 폰 — 인터랙티브 스토리 게임" },
      { name: "description", content: "한 소년의 휴대폰 속 단서를 따라가는 인터랙티브 로맨스 미스터리 게임." },
      { property: "og:title", content: "태산의 폰 — 인터랙티브 스토리 게임" },
      { property: "og:description", content: "한 소년의 휴대폰 속 단서를 따라가는 인터랙티브 로맨스 미스터리 게임." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ClientOnly fallback={<div className="game-loading" />}>
      <Suspense fallback={<div className="game-loading" />}>
        <GameApp />
      </Suspense>
    </ClientOnly>
  );
}
