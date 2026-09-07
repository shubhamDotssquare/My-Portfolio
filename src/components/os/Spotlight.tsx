"use client";

import { CornerDownLeft, Search, X } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useFocusScope } from "@/hooks/useFocusScope";
import { screenFade } from "@/animations/osTransitions";
import { pickTransition } from "@/animations/spring";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";
import { buildSearchIndex, searchIndex, searchSuggestions, type SearchResult } from "@/lib/search";
import { cn } from "@/lib/utils";
import { useOSStore } from "@/store/osStore";
import { TintIcon } from "@/components/ui/TintIcon";
import { OverlayBackdrop } from "./OverlayBackdrop";

const panelVariants: Variants = {
  initial: { opacity: 0, scale: 0.96, y: -8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, y: -6, transition: { duration: 0.2, ease: "easeOut" } },
};

/** Spotlight — search across apps, projects, case studies, lab, experience, skills. */
export function Spotlight() {
  const reduced = useOSReducedMotion();
  const closeOverlay = useOSStore((s) => s.closeOverlay);
  const openApp = useOSStore((s) => s.openApp);
  const index = useMemo(() => buildSearchIndex(), []);
  const [query, setQuery] = useState("");
  const [selectedRaw, setSelected] = useState(0);
  const panelRef = useRef<HTMLElement>(null);
  const listId = useId();
  useFocusScope(panelRef);

  const results = useMemo(
    () => (query.trim() ? searchIndex(index, query) : searchSuggestions(index)),
    [index, query],
  );

  // Keep the highlight in range as results shrink (no effect needed).
  const selected = Math.min(selectedRaw, Math.max(0, results.length - 1));


  const open = (r: SearchResult) => openApp(r.appId, { params: r.params });

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter" && results[selected]) {
      e.preventDefault();
      open(results[selected]);
    }
  };

  // Group headers are rendered when the group changes between consecutive rows.
  const rows = results.map((r, i) => ({ r, i, header: i === 0 || results[i - 1].group !== r.group }));

  return (
    <>
      <OverlayBackdrop onClose={closeOverlay} label="Close Spotlight" />
      <motion.section
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Spotlight search"
        variants={reduced ? screenFade : panelVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pickTransition(reduced, "smooth")}
        className="absolute top-[calc(var(--os-safe-top)+var(--os-status-height)+0.5rem)] left-1/2 z-[35] flex max-h-[72%] w-[calc(100%-2rem)] max-w-[520px] -translate-x-1/2 flex-col gap-2"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-[18px] w-[18px] -translate-y-1/2 text-os-text-tertiary" aria-hidden />
          <input
            data-autofocus=""
            type="search"
            role="combobox"
            aria-expanded
            aria-controls={listId}
            aria-activedescendant={results[selected] ? `${listId}-${results[selected].id}` : undefined}
            aria-autocomplete="list"
            placeholder="Search Shubham…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            onKeyDown={onKeyDown}
            className="w-full rounded-[1.25rem] os-glass-elevated py-3.5 pr-11 pl-12 text-[16px] text-os-text-primary shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] outline-none placeholder:text-os-text-tertiary focus-visible:ring-2 focus-visible:ring-os-accent [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-3.5 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-os-border text-os-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-os-accent"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          )}
        </div>

        <ul
          id={listId}
          role="listbox"
          aria-label={query ? "Results" : "Suggestions"}
          className="flex min-h-0 flex-col overflow-y-auto rounded-[1.25rem] os-glass-elevated p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {rows.length === 0 && (
            <li className="px-4 py-8 text-center text-[14px] text-os-text-tertiary">No results for “{query}”</li>
          )}
          {rows.map(({ r, i, header }) => (
            <li key={r.id} role="presentation" className="contents">
              {header && (
                <span aria-hidden className="px-3 pt-2.5 pb-1 text-[11px] font-semibold tracking-[0.1em] text-os-text-tertiary uppercase">
                  {r.group}
                </span>
              )}
              <button
                type="button"
                id={`${listId}-${r.id}`}
                role="option"
                aria-selected={i === selected}
                onMouseEnter={() => setSelected(i)}
                onClick={() => open(r)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left outline-none",
                  i === selected ? "bg-os-accent-fill text-os-on-tint" : "text-os-text-primary",
                )}
              >
                <TintIcon icon={r.icon} tint={r.tint} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium">{r.title}</span>
                  <span className={cn("block truncate text-[12px]", i === selected ? "" : "text-os-text-secondary")}>
                    {r.subtitle}
                  </span>
                </span>
                {i === selected && <CornerDownLeft className="h-4 w-4 shrink-0 opacity-80" aria-hidden />}
              </button>
            </li>
          ))}
        </ul>

        <p aria-hidden className="hidden px-2 text-center text-[11px] text-os-text-tertiary desktop:block">
          ↑↓ navigate · ↵ open · esc close
        </p>
      </motion.section>
    </>
  );
}
