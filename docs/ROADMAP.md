# SHUBHAM OS — Roadmap

Milestones from the Design & Engineering Specification. Tick tasks as they land.

## M1 — OS Kernel ✅
- [x] OS-001 Project architecture (Next.js, TS, Tailwind v4, Zustand, Motion, Lucide)
- [x] OS-002 TypeScript strict + lint
- [x] OS-003 OS Zustand store (`src/store/osStore.ts`)
- [x] OS-004 PhoneFrame (desktop frame / mobile full-viewport)
- [x] OS-005 StatusBar
- [x] OS-006 DynamicIsland
- [x] OS-007 HomeIndicator
- [x] OS-008 BootScreen (session-aware, skippable, reduced-motion)
- [x] OS-009 LockScreen (live clock/date, ambient background)
- [x] OS-010 Swipe unlock (+ button/keyboard alternative)

Acceptance: boot, lock and home states work. ✅

## M2 — Boot + Lock polish
- [x] Notification previews on lock screen (tap → unlock straight into the related app)
- [ ] Lock-screen tuning on real devices (M8)

## M3 — Home ✅
- [x] OS-011 AppIcon (tinted gradient, spring press, a11y label)
- [x] OS-012 AppGrid (4×2, reads `src/data/apps.ts` registry)
- [x] OS-013 Dock (Projects · Resume · Contact)
- [x] Press animation, greeting
- [x] Temporary app placeholder proves Home → App → Home (Escape / Back / home indicator); replaced by OS-014

Acceptance: home feels like a polished mobile home screen. ✅

## M4 — App Engine ✅
- [x] OS-014 AppWindow (shared chrome: Back, title, actions slot, safe-area scroll area)
- [x] App registry (`src/data/apps.ts` catalogue + `src/apps/registry.tsx` lazy content map)
- [x] OS-015 Open transition (icon → window shared-layout morph; fade fallback for deep links / reduced motion)
- [x] OS-016 Close transition (window → launching icon; Back button, Escape, home indicator)
- [x] OS-017 Browser history synchronization (`[[...segments]]` route, native pushState, popstate → store, deep links open the app directly, per-app metadata, 404 for unknown paths)

Acceptance: every app uses the same engine. ✅

## M5 — Portfolio Apps ✅
- [x] OS-018 About (`src/data/profile.ts`)
- [x] OS-019 Projects (search, featured rail, list — `src/data/projects.ts`)
- [x] OS-020 Project Detail (`/projects/[slug]`) + interactive experience (`/projects/[slug]/demo`, data-driven screens)
- [x] OS-021 Case Studies (`/case-studies/[slug]`, 8-step flow with jump rail — `src/data/caseStudies.ts`)
- [x] OS-026 Experience (timeline + education — `src/data/experience.ts`)
- [x] OS-027 Architecture (clickable diagram, node selected via `/architecture/[node]` — `src/data/architecture.ts`; stack from `src/data/skills.ts`)
- [x] OS-028 Contact (native-validated form → `POST /api/contact`, optional `CONTACT_WEBHOOK_URL`, honeypot; no RHF/Zod dependency added)
- [x] OS-029 Resume (sections link to apps; PDF buttons disabled until `profile.resume.pdfUrl` is set)
- [x] Shared UI primitives in `src/components/ui/`; nested slugs validated server-side (404) and in-app
- [ ] Replace all `[Placeholder]` content, sample metrics and links with real, owner-supplied data

Acceptance: all portfolio information is accessible through OS apps. ✅ (with placeholder content)

## M6 — Developer Lab ✅
- [x] OS-022 Lab shell (`/lab`, experiments at `/lab/[id]` — `src/data/lab.ts`)
- [x] OS-023 Physics Playground (stiffness/damping/mass sliders, drag + release velocity, damping-ratio readout, arrow-key nudge)
- [x] OS-024 Gesture Lab (swipe, dismissible stack, long press, bottom sheet snap points, pull to refresh — each with a button/keyboard alternative)
- [x] OS-025 Animation Lab (spring, timing, fade, scale, slide, layout, shared element — live component + transition code)
- [x] UI Component Lab (switch, segmented control, stepper, toast)
- [x] Shared controls: `Slider`, `Segmented`, `CodeBlock`

Acceptance: at least three experiments are genuinely interactive. ✅ (four)

## M7 — System Features ✅
- [x] OS-030 Control Center (Motion, Dark/Light, Performance high/balanced → blur off, Sound with synthesised ticks, Brightness scrim, Recents, Lock; swipe-down on status icons or tap)
- [x] OS-031 Notification Center (`src/data/notifications.ts`; swipe/✕ dismiss, Clear all, tap → app; swipe-down on the clock or tap)
- [x] OS-032 Spotlight (index over apps, projects, case studies, lab, experience, skills, architecture; ⌘/Ctrl+K, Home search pill, swipe-down on Home; ↑↓ ↵ esc)
- [x] OS-033 App Switcher (recent apps as cards; swipe-up/✕ removes; S key, Control Center → Recents, or swipe-up-and-hold on the home indicator)
- [x] OS-034 Keyboard shortcuts (⌘K, Esc, H, P, A, L, E, C, R, S, N; desktop hint under the frame)
- [x] Overlays keep the open app mounted beneath them; all overlays are code-split

Acceptance: the experience feels like one coherent system. ✅

## M8 — Polish ✅
- [x] OS-035 Reduced-motion audit — every infinite/decorative animation is gated by `useOSReducedMotion()`; the Control Center toggle now also sets `data-motion="reduced"` on `<html>` so CSS animations/transitions stop like the system preference
- [x] OS-036 Responsive behaviour — `desktop` variant requires width ≥768 **and** height ≥560; the phone frame renders at 390×844 and is transform-scaled to fit (no reflow); `short` variant (≤640px tall) compacts Lock/Home and lets Home scroll; content columns are capped at 520–560px so landscape phones don't stretch; verified 320×568, 375×667, 430×932, 844×390, 768×1024, 1280×640, 1440×900
- [x] OS-037 Asset optimization — no raster assets yet (artwork is CSS gradients), Inter self-hosted via `next/font` (latin subset), Lucide icons tree-shaken; add real images via `next/image` when the owner supplies them
- [x] OS-041 Performance audit — production build: initial JS ≈ 200–217 KB gzip, dominated by framework (React DOM ~70, Motion + shell ~58, Next runtime ~45); apps/overlays/lab experiments are separate lazy chunks (Lab list 5 KB, experiments ~4–8 KB each); `contain: layout paint` on the device; `will-change: transform` on lock blobs
- [x] OS-042 Accessibility audit — axe-core (WCAG 2.1 AA + best-practice) clean on lock, home, app, all four overlays, lab, contact, architecture; contrast-safe tertiary text and `--os-accent-fill` for white-on-accent; focus scope hook (trap + restore) in overlays; app windows take focus on open and return it to the launching icon; Home/app are `inert` beneath higher layers; live-region announcer; single banner landmark
- [x] OS-043 Visual polish — light theme verified across lock/home/detail/overlays; styled `not-found.tsx` and `error.tsx`; in-window `AppErrorBoundary` keeps the OS alive if an app crashes
- [ ] Lock-screen / gesture tuning on real devices — needs a physical phone (owner to verify thresholds in `src/lib/constants.ts`)

Acceptance: audits pass; the OS feels calm and consistent across viewports. ✅

## M9 — Launch
- [ ] OS-038 PWA
- [ ] OS-039 SEO
- [ ] OS-040 E2E tests
- [ ] OS-044 Production deployment
