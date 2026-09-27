"use client";
import { useState } from "react";
import type { Project } from "../../lib/content";
import { Arrow, Band, DONATE_URL, Tab, projectHref } from "./parts";

const STRANDS = ["all", "education", "health", "climate", "media"] as const;

export function SeasonList({ projects }: { projects: Project[] }) {
  const [strand, setStrand] = useState<(typeof STRANDS)[number]>("all");
  return (
    <section className="section" id="season" aria-labelledby="season-title">
      <div className="section__head">
        <div>
          <h2 id="season-title" className="section__title display">The season</h2>
          <p className="section__lede">Every film and project PFC backs, billed together. Statuses are confirmed by PFC before launch.</p>
        </div>
        <div className="filters" role="group" aria-label="Filter by strand">
          {STRANDS.map((s) => (
            <button key={s} className="filter" type="button" aria-pressed={strand === s} onClick={() => setStrand(s)}>
              {s === "all" ? "All" : s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <ol className="season">
        {projects.map((p) => (
          <li key={p.slug} className="entry" id={p.slug} data-dim={strand !== "all" && p.strand.toLowerCase() !== strand ? "" : undefined}>
            <Tab strand={p.strand} />
            <div>
              <h3 className="entry__title display"><a href={projectHref(p.slug)}>{p.title}</a></h3>
              <p className="entry__place">{p.place}</p>
            </div>
            <span className="kind entry__kind">{p.kind}</span>
            <span className="entry__status"><Band band={p.band} /></span>
            <span className="entry__go">
              {p.band.style === "solid"
                ? <a href={DONATE_URL}>Give <Arrow /></a>
                : <a href={projectHref(p.slug)}>Read <Arrow /></a>}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
