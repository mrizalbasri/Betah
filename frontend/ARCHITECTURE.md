# Betah Frontend Architecture

This frontend is intended to live as `frontend/` inside the Betah monolith.

## Boundaries

- `app/` — Next.js route composition only.
- `src/features/` — business features. Each feature owns its domain-specific UI.
- `src/components/ui/` — reusable presentation primitives.
- `src/components/layout/` — application shell/navigation.
- `src/lib/api/` — the only HTTP transport boundary.
- `src/lib/hooks/` — React data/state orchestration.
- `src/lib/context/` — cross-component UI state.
- `src/lib/utils/` — pure, reusable functions.
- `src/lib/api/types.ts` — frontend/backend contract types.

## Dependency rule

`app -> features -> hooks/context/utils -> api -> FastAPI`

Feature UI must not call `fetch()` directly. HTTP transport stays in `src/lib/api/client.ts`.

## Atomic rule

A component should have one primary reason to change. Composite panels compose smaller components rather than owning every visual/detail concern.

## Monolith

The Next.js application remains isolated under `frontend/`. It can be started independently in development and connected to the monolith backend using `NEXT_PUBLIC_API_BASE_URL`.



