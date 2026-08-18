---
name: review
description: Project-specific code review checklist for fx-checker-app — checks the things generic review misses because they're only documented in this repo's CLAUDE.md (URL/Zustand dual-state sync, currency/flag map completeness, query-layer conventions, routeTree/theme-script invariants, Tailwind token usage). Use when asked to review, check, or audit a diff/PR/branch in this repo, especially anything touching currency selection, routes/loaders, the API layer, or styling.
---

Run this alongside (not instead of) the general-purpose `/code-review` skill.
`/code-review` finds correctness/simplification/efficiency bugs a reviewer
with no repo-specific context would also find. This checklist exists for
the failure modes that *only* show up here because they depend on
conventions this repo's `CLAUDE.md` documents and nothing in the type
system enforces.

Scope this to the actual diff — check only the sections below whose files
were touched, not every category on every review.

## 1. Dual state model: URL params vs. Zustand store

Touched files: `src/routes/index.tsx`, `src/components/CheckRate.tsx`,
`src/components/CurrencyDropdown.tsx`, `src/components/HistoryHeader.tsx`,
`src/store/store.ts`.

- `base`/`quote` URL search params are the source of truth for the
  selected ISO codes; `useCurrencyStore`'s `send`/`receive` hold the full
  `CurrencyOption` objects for rendering (flag/name).
- **Any code path that changes the selected currency must update both.**
  Grep for `setSend(`/`setReceive(` and confirm each call site is paired
  with a `navigate({ to: '.', search: (prev) => ({ ...prev, base/quote:
  ... }) })` (or vice versa) in the same handler. A change that updates
  only the store (stale URL → broken prefetch/shareable links) or only the
  URL (stale flag/name in the dropdown) is a bug, not a style nit.
- Loaders read `period` via `useCurrencyStore.getState()` directly (not a
  hook) inside `src/routes/index.tsx`'s route `loader` — if a diff moves
  currency/period reads into a React hook inside the loader, that's wrong;
  loaders run outside component context.
- New currency-aware features must read *both* base/quote (URL) and the
  store's `send`/`receive` the same way existing components do — reading
  only one produces stale UI or breaks SSR prefetching.

## 2. Currency/flag map completeness

Touched files: `src/utils/currency.ts`, anything adding a new currency.

- `getCurrencyOptions()` filters the API's currency list down to whatever
  has an entry in `CURRENCY_FLAG_MAP`. Adding a currency to any hardcoded
  list/config without *also* adding a `CURRENCY_FLAG_MAP` entry AND a
  `public/assets/images/flags/<code>.webp` asset means it silently
  disappears from the picker — verify both exist together, not just one.

## 3. API / query layer conventions

Touched files: `src/api/*.ts`.

- Each resource file should follow the existing shape: a `createServerFn`
  doing the actual fetch against `process.env.BASE_URL`, plus an exported
  `fetch<Resource>Options(...)` returning `queryOptions`. A new endpoint
  that calls `fetch` directly from a component instead of following this
  pattern is a deviation worth flagging.
- Query keys must include every input that changes the result — e.g.
  `singlecurrency.ts` includes `amount` in its key precisely so each
  amount is its own cache entry. A new/changed query whose key omits a
  param that affects the response will silently serve stale data.
- Check `staleTime`/`refetchInterval` choices are deliberate — `liverates`
  polls every 60s; a new live-data query with no interval (or an
  accidentally short one hammering the free Frankfurter API) should be
  called out.

## 4. Routing / SSR invariants

Touched files: `src/routes/**`, `src/router.tsx`, `src/routeTree.gen.ts`.

- `src/routeTree.gen.ts` is generated (`tsr generate` / `npm run
  generate-routes`) — a diff that hand-edits it directly should be
  rejected; regenerate it instead.
- `validateSearch` in `src/routes/index.tsx` is what makes `base`/`quote`
  well-typed and defaulted (`USD`/`EUR`) — a change to the search-param
  shape here must keep defaults in sync with wherever they're read
  downstream (loader prefetch, `CurrencyDropdown`'s seed-from-URL effect).
- Loader `ensureQueryData` calls should stay parallel (not sequential
  `await`s) — a diff that serializes what used to be concurrent
  prefetches is a performance regression even if functionally correct.

## 5. Theme script / hydration

Touched files: `src/routes/__root.tsx`, `src/context/ThemeProvider.tsx`.

- The inline `ScriptOnce` theme script exists specifically to set the
  `dark`/`light` class before hydration and avoid a flash of unstyled
  theme. Don't let a refactor turn this into a normal `useEffect` — that
  reintroduces the flash.
- Watch for SSR/client markup mismatches in `__root.tsx` /
  `src/routes/index.tsx` — e.g. an element rendered inside `<body>` in one
  file and duplicated/nested in another produces a React hydration
  mismatch (`In HTML, %s cannot be a child of <%s>` /
  `Hydration failed because the server rendered HTML didn't match the
  client`). This class of bug is easy to introduce silently since React
  recovers by re-rendering client-side and the page still *looks* right —
  check the browser console via the `/run-fx-checker-app` skill's driver
  (`console --errors`), don't rely on the screenshot alone.

## 6. Styling tokens

Touched files: any `.tsx` with `className`, `src/styles.css`.

- There is no `tailwind.config.js` — tokens (`fx-*` colors,
  `text-preset-1`…`6`) are defined via `@theme` in `src/styles.css`. Flag
  raw Tailwind palette classes (`text-gray-500`, `bg-blue-600`) or
  arbitrary values (`text-[#123456]`) introduced where an existing `fx-*`
  token/preset would do.
- Conditional class composition should go through `cn()`
  (`src/utils/index.ts`) rather than manual template-string concatenation
  or ad-hoc `clsx`/`twMerge` calls.

## 7. Custom `Tabs` component

Touched files: `src/components/Tabs.tsx`, anything consuming it.

- `Tabs` tracks the active tab via event delegation
  (`onClickCapture`/`data-tab-title`), not per-tab `onClick` props — a
  diff that adds a normal `onClick` to a `Tab` child likely won't fire as
  expected.
- If a panel is meant to render into a `target` ref (portal) rather than
  inline, confirm the ref is passed and mounted before the tab can be
  activated — activating a tab whose portal target isn't mounted yet is a
  real failure mode this component's structure invites.

---

After going through the relevant sections above, if you found anything,
report it the same way `/code-review` does (via `ReportFindings` if that's
the active flow, otherwise a plain list) — don't duplicate a finding
`/code-review` would already catch (e.g. a plain null-deref); only surface
what's specific to this repo's conventions.
