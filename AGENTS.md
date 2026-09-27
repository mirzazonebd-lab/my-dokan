# AGENTS.md

## Project overview

This repository is a Next.js e-commerce app for Beauty Dokan BD. The app uses the App Router under `app/`, React components in `components/`, shared utilities in `lib/`, and Supabase-backed integration under `supabase/`.

## Essential commands

- Install dependencies: `npm install`
- Run the dev server: `npm run dev`
- Production build: `npm run build`
- Start production server: `npm run start`
- Lint: `npm run lint`
- Type-check: `npm run typecheck`

## Architecture and conventions

- Prefer TypeScript for new code and keep components strongly typed.
- Use the Next.js App Router pattern in `app/` for routes and page-level composition.
- Keep UI building blocks in `components/`; use `components/ui/` for reusable primitives and `components/sections/` for feature-level composition.
- Keep shared logic in `lib/` and custom hooks in `hooks/`.
- Do not place data access or Supabase logic directly inside page or UI components unless the code is intentionally local to that feature.
- Favor server components by default; add `"use client"` only when interactive browser behavior is required.
- Reuse existing patterns already present in the repo instead of introducing new framework conventions.

## Important project notes

- This is a storefront app, so checkout, cart, auth, brand, and product flows are major areas of the codebase.
- The root README and project kickoff docs are the best first references for product intent and setup details: [README.md](README.md), [_START_HERE.md](_START_HERE.md), and [QUICK_START.md](QUICK_START.md).
- Keep changes minimal and targeted. The project already contains several generated summary and fix documents in the root; they are operational notes, not source-of-truth app code.

## Safe workflow for agents

1. Read the relevant route or component before editing.
2. Match the existing naming and folder conventions used by nearby files.
3. Prefer small, composable changes over broad rewrites.
4. Run the smallest validation command that checks the edited behavior, typically `npm run typecheck` for TypeScript changes and `npm run lint` when relevant.
5. If the work touches routing, auth, cart, or Supabase integration, inspect the neighboring files in that feature area before modifying shared behavior.

## Constraints

- Do not create new app-level architecture patterns without checking the repo’s existing structure.
- Do not replace already-established data flows or dependencies unless a task explicitly requires it.
- Keep generated or temporary debug logs and output files out of source changes unless the task is specifically about debugging or cleanup.
