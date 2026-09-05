@AGENTS.md

# SHUBHAM OS — Project Rules

Interactive mobile developer portfolio presented as an iOS-inspired OS. It is a
**web application** (Next.js), not React Native Web. Full spec: `docs/SPEC-SUMMARY.md`;
milestone tracker: `docs/ROADMAP.md`.

## Stack (do not add dependencies without justification)
Next.js · React · TypeScript (strict) · Tailwind CSS v4 · Motion (`motion/react`) · Zustand · Lucide React

## Non-negotiables
1. **OS state is centralized** in `src/store/osStore.ts`. No navigation state inside apps.
2. **Content is separate from UI** — portfolio text lives in `src/data/*`, never in components.
3. **Semantic design tokens only** (`--os-*` in `globals.css`, exposed as `os-*` Tailwind colors). No scattered hex.
4. **Animation tokens** come from `src/animations/spring.ts`. Respect reduced motion via `useOSReducedMotion()`.
5. **Gestures are never the only path.** Every gesture has a visible/keyboard alternative.
6. **Browser history must work** — real URLs, Back button, no SPA trap.
7. Never invent real career/project info — use clearly-marked placeholders.
8. No Apple proprietary assets. Familiar patterns, original visuals.
9. Desktop shows the phone frame; mobile viewport *is* the OS (no mockup inside mobile).

## Workflow
- One atomic task at a time (see `docs/ROADMAP.md`).
- After each task: `npm run typecheck && npm run lint`, then `npm run build` at milestone ends.
- Small commits: `feat(os): ...`, `feat(home): ...`, `feat(apps): ...`, `perf(os): ...`, `a11y(os): ...`.
