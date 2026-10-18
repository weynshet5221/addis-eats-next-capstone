<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
## Addis Eats Project Instructions

- Read this file before changing project code.
- Read the relevant Next.js documentation in
  `node_modules/next/dist/docs/` before changing Next.js APIs.
- Use the existing App Router structure and JavaScript conventions.
- Inspect existing files and their imports before editing them.
- Preserve existing features, routes, styling, and order workflows.
- Do not replace working files with simplified examples.
- Use Server Components by default.
- Add `"use client"` only when client-side interaction or hooks are needed.
- Use real buttons for actions and links for navigation.
- Keep forms keyboard-accessible and provide clear validation errors.
- Disable submit buttons while requests are pending.
- Validate all important input on the server.
- Never trust prices or totals supplied by the browser.
- Never commit `.env.local` or private credentials.
- Run `npm run build` after completing changes.
- Report any build errors rather than claiming the build passed.
