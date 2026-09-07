"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface FocusScopeOptions {
  /** Keep Tab / Shift+Tab cycling inside the scope (modal overlays). */
  trap?: boolean;
  /** Move focus into the scope on mount (`[data-autofocus]`, else first focusable, else the root). */
  autoFocus?: boolean;
  /** Return focus to the previously focused element on unmount. */
  restore?: boolean;
}

/**
 * Focus management for layered surfaces: overlays trap and restore focus;
 * app windows move focus in on open and hand it back to the launching icon
 * on close. Gestures are never the only path, and neither is the pointer.
 */
export function useFocusScope<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { trap = true, autoFocus = true, restore = true }: FocusScopeOptions = {},
) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusables = () =>
      Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getAttribute("aria-hidden") !== "true" && el.offsetParent !== null,
      );

    let frame = 0;
    if (autoFocus) {
      frame = requestAnimationFrame(() => {
        const target = root.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[0] ?? root;
        target.focus({ preventScroll: true });
      });
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (!trap || e.key !== "Tab") return;
      const els = focusables();
      if (els.length === 0) {
        e.preventDefault();
        root.focus();
        return;
      }
      const first = els[0];
      const last = els[els.length - 1];
      const active = document.activeElement;
      const inside = active instanceof Node && root.contains(active);
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown, true);
      if (restore && previous && previous.isConnected && !previous.closest("[inert]")) {
        previous.focus({ preventScroll: true });
      }
    };
  }, [ref, trap, autoFocus, restore]);
}
