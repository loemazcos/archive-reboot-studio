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

## Decisions, constraints & rationale

- **Clue ownership per character**: 상혁(11 clues incl. C04 xclovts account, C23 4:12 call, C24 steps), 동현(4 clues), 재현(5 clues incl. C13 deleted message), 성호(4 clues)
- Shared clues across characters: C07 (대전), C08 (학생회), C12 (복식) appear in multiple personas
- Story guide is authoritative source for clue descriptions and core flags; `clues.js` must match it
- C02 needs `core` flag set to match guide
- Framework: vite-react

## Open questions & assumptions

- **Missing triggers**: C01, C02, C03, C05, C07, C08, C09, C10 have no in-game discovery trigger — characters can never reveal them; trigger implementation needed
- **clues.js vs story guide**: descriptions still mismatched; needs reconciliation
- **Build status**: final build not verified; earlier dependency installation failed in environment
- Need to confirm whether all 24 clues are player-discoverable before final build
- Assumption: `REVEALABLE_CLUES` structure maps clue IDs to character dialogue unlock conditions