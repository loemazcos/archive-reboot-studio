<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The game (src/components/GameApp.tsx) renders client-only from `/`; it is a browser phone simulator using a localStorage device id, so it must not run during SSR.
- All game persistence goes through one server function (`src/lib/game.functions.ts` → `src/server/*.server.ts`) using the admin client filtered by device id; tables have RLS with no client policies, so never read them from the browser.

- tsconfig uses allowJs and disables exactOptionalPropertyTypes/noUncheckedIndexedAccess/noPropertyAccessFromIndexSignature: story data lives in untyped .js files and the inherited code was written without those flags.
