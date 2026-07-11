<!-- intent-skills:start -->

## Skill Loading

Before editing files for a substantial task:

- Run `npx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.

<!-- intent-skills:end -->

---

# TanStack Start Project: fx-checker-app

## Project Overview

A minimal TanStack Start application demonstrating core TanStack libraries: **TanStack Start**, **TanStack Router**, **TanStack Query**, **TanStack CLI**, and **TanStack Intent** in a single coherent project.

### Stack

- **Framework**: React 19.2.0
- **Meta-framework**: TanStack Start (with Nitro agnostic deployment adapter)
- **Routing**: TanStack Router (file-based router)
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS v4 (always enabled in TanStack Start)
- **Build Tool**: Vite 8.0.0
- **Package Manager**: npm
- **Linter**: ESLint 9.20.0 (TanStack ESLint config)
- **Testing**: Vitest 4.1.5
- **Language**: TypeScript 6.0.2

## Scaffolding Command

```bash
npx @tanstack/cli@latest create fx-checker-app \
  --agent \
  --package-manager npm \
  --tailwind \
  --toolchain eslint \
  --add-ons tanstack-query
```

### Configuration Choices Made

- **Framework**: React (vs. Solid)
- **Deployment Adapter**: Nitro (agnostic) — allows deployment to any platform
- **Demo/Example Pages**: No (blank starter as requested)
- **Git Repository**: Yes (initialized)
- **Dependencies**: Auto-installed via npm
- **Agent Skills**: No (skipped at scaffolding time; installed separately via TanStack Intent)

### TanStack CLI Notes

- **Deprecated flag**: `--tailwind` is deprecated; Tailwind is always enabled in TanStack Start scaffolds.
- **Telemetry**: Enabled by default (anonymized usage only). Disable with `tanstack telemetry disable` or `TANSTACK_CLI_TELEMETRY_DISABLED=1`.

## TanStack Intent Setup

### Commands Run

```bash
npx @tanstack/intent@latest install
npx @tanstack/intent@latest list
```

**Result**: No intent-enabled packages were found during `list`. This is normal for a fresh scaffold. The Intent framework created `AGENTS.md` with skill loading guidance for future enhancements. Use `npx @tanstack/intent@latest load <package>#<skill>` when tasks require package-specific skills.

## Included TanStack Libraries

| Library                            | Version | Purpose                                          | Status    |
| ---------------------------------- | ------- | ------------------------------------------------ | --------- |
| `@tanstack/react-start`            | latest  | Meta-framework for full-stack React with SSR     | ✓ Core    |
| `@tanstack/react-router`           | latest  | Type-safe, nested routing with file-based routes | ✓ Core    |
| `@tanstack/react-query`            | latest  | Async state management for server state          | ✓ Core    |
| `@tanstack/router-plugin`          | 1.132.0 | Vite plugin for route code generation            | ✓ DevDeps |
| `@tanstack/router-cli`             | 1.132.0 | CLI for generating route tree                    | ✓ DevDeps |
| `@tanstack/react-router-ssr-query` | latest  | SSR integration between Router and Query         | ✓ Core    |
| `@tanstack/react-router-devtools`  | latest  | Dev panel for router debugging                   | ✓ Core    |
| `@tanstack/react-query-devtools`   | latest  | Dev panel for Query cache inspection             | ✓ Core    |
| `@tanstack/react-devtools`         | latest  | Unified devtools host for TanStack tools         | ✓ Core    |
| `@tanstack/devtools-vite`          | latest  | Vite plugin for devtools integration             | ✓ DevDeps |
| `@tanstack/eslint-config`          | latest  | TanStack's shared ESLint configuration           | ✓ DevDeps |

## Project Structure

```
fx-checker-app/
├── src/
│   ├── routes/                          # File-based routes
│   │   ├── __root.tsx                   # Root layout with devtools
│   │   └── index.tsx                    # Home page (/)
│   ├── integrations/
│   │   └── tanstack-query/              # Query integration
│   │       ├── root-provider.tsx        # QueryClient setup
│   │       └── devtools.tsx             # Query devtools config
│   ├── router.tsx                       # Router configuration
│   ├── routeTree.gen.ts                 # Auto-generated route tree (git-ignored)
│   └── styles.css                       # Tailwind CSS with app styles
├── eslint.config.js                     # ESLint configuration
├── vite.config.ts                       # Vite build configuration
├── tsr.config.json                      # TanStack Router CLI config
├── tsconfig.json                        # TypeScript configuration
├── prettier.config.js                   # Code formatting config
├── package.json                         # Dependencies and scripts
└── README.md                            # Project documentation
```

## Available Scripts

```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build           # Build for production
npm run preview         # Preview production build locally
npm run generate-routes # Regenerate route tree (tsr generate)
npm run lint            # Run ESLint checks
npm run format          # Format code + fix ESLint issues
npm run check           # Verify formatting with Prettier
npm run test            # Run tests with Vitest
```

## Environment Variables

**No environment variables are required** for the base project. Future integrations (e.g., API endpoints, external services) may add requirements.

To configure later:

1. Create `.env.local` (git-ignored)
2. Reference in code via `import.meta.env.VITE_*` (Vite convention)
3. For SSR context variables, use router context injection (see `src/router.tsx`)

## Key Architectural Decisions

1. **File-Based Routing**: TanStack Router uses `src/routes/` for automatic route generation. Each file or folder becomes a route.
   - `routes/index.tsx` → `/`
   - `routes/about.tsx` → `/about`
   - `routes/posts.$id.tsx` → `/posts/:id` (dynamic segment)

2. **Route Tree Generation**: The `routeTree.gen.ts` is auto-generated by the TanStack Router CLI (`tsr generate`) on file save in dev mode. Never edit by hand.

3. **QueryClient Context**: Query and Router are integrated via a shared context object, enabling:
   - SSR-safe query hydration
   - Type-safe access to `queryClient` in route loaders
   - Automatic devtools plugin loading

4. **Devtools Panel**: The root layout registers three devtools:
   - **React Devtools**: React component tree inspection
   - **Router Devtools**: Route transitions and state
   - **Query Devtools**: Cache, queries, mutations
   - Position: bottom-right of viewport

5. **Tailwind v4 with Vite**: Tailwind is always enabled; the `@tailwindcss/vite` plugin handles CSS injection and JIT compilation.

## Known Gotchas & Solutions

### Route Tree Not Updating?

- **Cause**: Manual route changes but `routeTree.gen.ts` not regenerated
- **Solution**: Run `npm run generate-routes` or save a route file (triggers auto-regen in watch mode)
- **Prevention**: Commit `package.json` + `tsr.config.json`; never commit `routeTree.gen.ts`

### TypeScript Errors in Routes?

- **Cause**: Missing route context type registration
- **Solution**: Ensure `src/router.tsx` has the correct `declare module` block for `Register.router`

### Query Cache Not Sharing Between Routes?

- **Cause**: Multiple QueryClient instances created
- **Solution**: Use `src/integrations/tanstack-query/root-provider.tsx` `getContext()` in router setup (already configured)

### Devtools Not Appearing?

- **Cause**: Browser extensions blocking or devtools plugin not loaded
- **Solution**: Check console for errors; ensure `__root.tsx` mounts `TanStackDevtools` component

### ESLint Errors on Imports?

- **Cause**: Rules from `@tanstack/eslint-config` may conflict with project patterns
- **Solution**: Extend/override in `eslint.config.js` as needed; TanStack config is opinionated by design

## Deployment Notes

### Nitro Deployment

The project uses **Nitro (agnostic)** as the deployment adapter, meaning:

- Works with any Node.js-compatible hosting (Vercel, Netlify, Railway, self-hosted, etc.)
- Server rendered by default (SSR enabled)
- Static prerendering possible via `build` configuration

### Build Output

```bash
npm run build
# Outputs:
# - dist/public/    (client assets)
# - dist/server/    (server bundle)
```

### Hosting Examples

- **Vercel**: Deploy via Git, no special config needed (recognizes Nitro automatically)
- **Netlify**: Add `netlify.toml` if custom rewrites needed; otherwise auto-detects
- **Self-hosted**: Run `node dist/server/index.mjs` (Node.js 18+)

## Next Steps

1. **Add a New Route**:
   - Create `src/routes/about.tsx` with `export const Route = createFileRoute('/about')(...)`
   - Route tree auto-generates; no manual registration needed

2. **Fetch Data with Query**:
   - In a route, call `useSuspenseQuery()` or `useQuery()` from `@tanstack/react-query`
   - Access `queryClient` from router context for mutations
   - Devtools will show real-time cache state

3. **Navigate Between Routes**:
   - Import `useNavigate()` or render `Link` from `@tanstack/react-router`
   - Type-safe navigation with autocomplete support

4. **Inspect Debug Info**:
   - Open devtools panel (bottom-right) and toggle tabs:
     - **Tanstack Router**: See active route, search, match transitions
     - **Query**: Monitor cache, running queries, stale/inactive status

5. **Customize Styling**:
   - Extend Tailwind config in `tailwind.config.js` (if it exists) or via Tailwind directives in `src/styles.css`
   - Tailwind v4 uses `@import` syntax instead of `@tailwind`

6. **Run Tests**:
   - Create files matching `src/**/*.test.ts(x)` or `src/**/*.spec.ts(x)`
   - Use Vitest + React Testing Library (already configured)
   - Run `npm run test`

## Useful References

- **TanStack Start**: https://tanstack.com/start/latest
- **TanStack Router**: https://tanstack.com/router/latest
- **TanStack Query**: https://tanstack.com/query/latest
- **TanStack CLI**: https://tanstack.com/cli/latest
- **Nitro**: https://v3.nitro.build/
- **Tailwind CSS v4**: https://tailwindcss.com/docs
- **Vite**: https://vitejs.dev/

## License

This project is scaffolded by TanStack CLI and follows the same licensing as the TanStack organization's default projects (typically MIT).
