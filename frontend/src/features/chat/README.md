# Chat Feature

Ask HR Assistant panel, embedded in the employee detail view (PRD §3).

- `ChatPanel` — composite component, wired into `EmployeeDetailPanel`.
- `ChatMessageBubble` / `ChatSourceBadge` / `ChatInput` — atomic presentation pieces.
- State lives in `useChat` (`src/lib/hooks/useChat.ts`).
- Transport lives in `postChatMessage` (`src/lib/api/postChatMessage.ts`), streaming
  `POST /api/chat` over SSE.

`postChatMessage` is a minimal fetch-based SSE reader, not the Vercel AI SDK
mentioned in the PRD tech stack — that dependency isn't installed yet and the
exact wire format needs confirming with the backend team first (see API
contract §7 open questions: source-event ordering, SDK version, and whether
the backend is stateful per employeeId). Swap it for `@ai-sdk/react`'s
`useChat` once that's settled; `useChat` in this folder only depends on
`ChatStreamCallbacks`, so the swap stays local to `postChatMessage.ts`.
