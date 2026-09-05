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

## M2 — Boot + Lock polish (deferred)
- [ ] Notification previews on lock screen (needs `src/data/notifications.ts`, lands with M7 Notification Center)
- [ ] Lock-screen tuning on real devices

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

## M5 — Portfolio Apps
- [ ] OS-018 About
- [ ] OS-019 Projects
- [ ] OS-020 Project Detail
- [ ] OS-021 Case Studies
- [ ] OS-026 Experience
- [ ] OS-027 Architecture
- [ ] OS-028 Contact
- [ ] OS-029 Resume

## M6 — Developer Lab
- [ ] OS-022 Lab shell
- [ ] OS-023 Physics
- [ ] OS-024 Gesture
- [ ] OS-025 Animation

## M7 — System Features
- [ ] OS-030 Control Center
- [ ] OS-031 Notification Center
- [ ] OS-032 Spotlight
- [ ] OS-033 App Switcher
- [ ] OS-034 Keyboard shortcuts

## M8 — Polish
- [ ] OS-035 Reduced-motion audit
- [ ] OS-036 Responsive behaviour
- [ ] OS-037 Asset optimization
- [ ] OS-041 Performance audit
- [ ] OS-042 Accessibility audit
- [ ] OS-043 Visual polish

## M9 — Launch
- [ ] OS-038 PWA
- [ ] OS-039 SEO
- [ ] OS-040 E2E tests
- [ ] OS-044 Production deployment
