# Project memory

## Product intent & audience

- Narrative mystery chat game where players investigate clues through character conversations
- Korean-language project: UI, character names, and story content in Korean (상혁, 동현, 재현, 성호)
- Core mechanic: players discover clues, then characters reveal related dialogue via `REVEALABLE_CLUES` mapping
- 24 total clues (C01–C24) driving the story; each character mentions clues naturally once found

## Brand personality & voice

- Characters speak naturally in chat; clues woven into dialogue, not info-dumped
- Four personas with distinct clue ownership and narrative roles

## Visual design & UX direction

- Vite + React frontend
- Chat-style interaction interface (inferred from personas.ts chat reveal mechanic)
- Clue discovery triggers gate character dialogue reveals
- Includes fake social media / account screens (e.g., 대전 계정, 인스타 게시물 댓글) for clue discovery

## Decisions, constraints & rationale

- **Clue ownership per character**: 상혁(11 clues incl. C04 xclovts account, C23 4:12 call, C24 steps), 동현(4 clues), 재현(5 clues incl. C13 deleted message), 성호(4 clues)
- Shared clues across characters: C07 (대전), C08 (학생회), C12 (복식) appear in multiple personas
- Story guide is authoritative source for clue descriptions and core flags; `clues.js` must match it
- C02 needs `core` flag set to match guide
- Framework: vite-react
- **Build verified passing** (dependency issues resolved)
- **All 24 clues now connected and discoverable in-game** (C01–C24)
- **C07 trigger**: discovered when player sends a tip from the Daejeon account; reply = clue (approximates story's "reply to tipster")
- **C08 trigger**: discovered when student council post appears in feed; added comment about gym back-door inspection dates (10/15, 10/17, 10/23)
- **Preview environment issue**: build passes, Vite installed locally; preview not loading — likely environment-side, not code-side (dev server can't be started by assistant)

## Open questions & assumptions

- **Preview not loading**: user reports preview won't even load; build passes and dev tool installed, so failure is likely preview environment, not code — awaiting user feedback after refresh/restart
- **clues.js vs story guide**: descriptions still mismatched; needs reconciliation
- Assumption: `REVEALABLE_CLUES` structure maps clue IDs to character dialogue unlock conditions
- C07 trigger is an approximation of the story's "reply to tipster" — may need refinement