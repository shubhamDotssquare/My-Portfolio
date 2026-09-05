"use client";

import { Search, X } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { featuredProjects, projects, PROJECTS_ARE_PLACEHOLDER, type Project } from "@/data/projects";
import { useOSStore } from "@/store/osStore";
import { Artwork } from "@/components/ui/Artwork";
import { LargeTitle } from "@/components/ui/LargeTitle";
import { ListGroup, ListRow } from "@/components/ui/ListRow";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function ProjectsList() {
  const openApp = useOSStore((s) => s.openApp);
  const [query, setQuery] = useState("");
  const searchId = useId();
  const open = (p: Project) => openApp("projects", { params: [p.id] });

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) return projects;
    return projects.filter((p) =>
      [p.name, p.category, p.tagline, ...p.technologies].some((s) => s.toLowerCase().includes(q)),
    );
  }, [q]);

  return (
    <div className="flex flex-col pb-4">
      <Reveal>
        <LargeTitle title="Projects" subtitle="My applications." />
      </Reveal>

      <Reveal index={1} className="mt-5">
        <label htmlFor={searchId} className="sr-only">
          Search projects
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-os-text-tertiary"
            aria-hidden
          />
          <input
            id={searchId}
            type="search"
            placeholder="Search projects, stacks…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl os-glass py-3 pr-10 pl-11 text-[15px] text-os-text-primary outline-none placeholder:text-os-text-tertiary focus-visible:ring-2 focus-visible:ring-os-accent [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-os-border text-os-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-os-accent"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          )}
        </div>
      </Reveal>

      {!q && (
        <Reveal index={2}>
          <Section title="Featured">
            <ul className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {featuredProjects.map((p) => (
                <li key={p.id} className="snap-start">
                  <button
                    type="button"
                    onClick={() => open(p)}
                    aria-label={`Open ${p.name}, ${p.tagline}`}
                    className="group relative block h-44 w-60 overflow-hidden rounded-[1.6rem] text-left outline-none focus-visible:ring-2 focus-visible:ring-os-accent focus-visible:ring-offset-2 focus-visible:ring-offset-os-background"
                  >
                    <Artwork tint={p.tint} label={p.name} className="absolute inset-0 text-[2.2rem] transition-transform duration-300 group-hover:scale-[1.03]" />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-10">
                      <span className="block text-[16px] font-semibold text-white">{p.name}</span>
                      <span className="block text-[13px] text-white/80">{p.tagline}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Section>
        </Reveal>
      )}

      <Reveal index={3}>
        <Section title={q ? `Results · ${results.length}` : "All Projects"}>
          {results.length === 0 ? (
            <p className="px-1 py-6 text-center text-[14px] text-os-text-tertiary">
              Nothing matches “{query}”.
            </p>
          ) : (
            <ListGroup>
              {results.map((p) => (
                <ListRow
                  key={p.id}
                  title={p.name}
                  subtitle={`${p.category} · ${p.year}`}
                  onClick={() => open(p)}
                  leading={<Artwork tint={p.tint} label={p.name} className="h-11 w-11 rounded-xl text-[0.9rem]" />}
                />
              ))}
            </ListGroup>
          )}
        </Section>
      </Reveal>

      {PROJECTS_ARE_PLACEHOLDER && <PlaceholderNotice />}
    </div>
  );
}
