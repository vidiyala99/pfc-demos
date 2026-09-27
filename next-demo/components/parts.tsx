import type { Band as BandT, Project, Strand } from "../../lib/content";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (p: string) => `${BASE}${p}`;
export const DONATE_URL = "https://partnershipsforchange.org/donate/";

export function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Tab({ strand, large }: { strand: Strand; large?: boolean }) {
  return <span className={`tab tab--${strand.toLowerCase()}${large ? " tab--lg" : ""}`}>{strand}</span>;
}

export function Band({ band, large }: { band: BandT; large?: boolean }) {
  const style = band.style === "solid" ? "" : ` band--${band.style}`;
  return <span className={`band${style}${large ? " band--lg" : ""}`}>{band.text}</span>;
}

export function Thumb({ project }: { project: Project }) {
  if (!project.image) return <span className="placeholder">{project.placeholder}</span>;
  return <img src={asset(project.image)} alt={project.imageAlt} loading="lazy" />;
}

export const projectHref = (slug: string) => `${BASE}/work/${slug}/`;

export function Masthead({ headline, current }: { headline: string; current?: "work" }) {
  const links = [
    ["Our work", `${BASE}/#season`],
    ["Films", `${BASE}/#season`],
    ["Impact", `${BASE}/#record`],
    ["About", "#footer"],
    ["Fiscal sponsorship", `${BASE}/#submissions`],
  ] as const;
  return (
    <header className="masthead">
      <div className="masthead__row">
        <a className="masthead__logo" href={`${BASE}/`} aria-label="Partnerships For Change home">
          <img src={asset("/images/pfc-logo.png")} alt="Partnerships For Change" width={270} height={87} />
        </a>
        <p className="masthead__line">{headline}</p>
        <nav className="nav" aria-label="Main">
          {links.map(([label, href], i) => (
            <a key={label} href={href} aria-current={current === "work" && i === 0 ? "page" : undefined}>{label}</a>
          ))}
        </nav>
        <details className="menu">
          <summary aria-label="Menu">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </summary>
          <nav aria-label="Main menu">
            {links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
          </nav>
        </details>
        <a className="ticket" href={DONATE_URL}>Donate</a>
      </div>
    </header>
  );
}

export function AlsoShowing({ projects, wide }: { projects: Project[]; wide?: boolean }) {
  return (
    <aside className={`showing${wide ? " showing--wide" : ""}`} aria-labelledby="showing-title">
      <h2 id="showing-title" className="showing__title display">Also showing</h2>
      <ol>
        {projects.map((p, i) => (
          <li key={p.slug}>
            <a className="row" style={{ ["--i" as string]: i }} href={projectHref(p.slug)}>
              <span className="row__thumb"><Thumb project={p} /></span>
              <span className="row__body">
                <span className="row__title display">{p.title}</span>
                <Tab strand={p.strand} />
                <span className="kind">{p.kind}</span>
                {p.kind === "Project" && p.place.includes("Partnership") ? <span className="row__credit">{p.place}</span> : null}
                <span className="row__cue">See project <Arrow /></span>
              </span>
            </a>
          </li>
        ))}
      </ol>
      <p className="showing__foot"><a className="button-line" href={`${BASE}/#submissions`}>Fiscal sponsorship: submissions open <Arrow /></a></p>
    </aside>
  );
}

export function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer__inner">
        <div>
          <p className="footer__name">Partnerships For Change®</p>
          <address>The Presidio of San Francisco<br />1016 Lincoln Blvd., Suite 222<br />San Francisco, CA 94129<br />(415) 548-3330 [confirm as primary]</address>
        </div>
        <div>
          <h2>Explore</h2>
          <ul><li><a href={`${BASE}/#season`}>Our work</a></li><li><a href={`${BASE}/#season`}>Films</a></li><li><a href={`${BASE}/#record`}>Impact</a></li><li><a href={`${BASE}/#submissions`}>Fiscal sponsorship</a></li></ul>
        </div>
        <div>
          <h2>Policies</h2>
          <ul><li>Privacy [to write]</li><li>Accessibility [to write]</li><li>Donation disclosure [to write]</li><li>Terms [to write]</li></ul>
        </div>
        <div>
          <h2>Programme updates</h2>
          <p style={{ margin: 0 }}>Email sign-up [service to choose at no cost]</p>
        </div>
      </div>
      <p className="footer__legal">© 2026 Partnerships For Change. A 501(c)(3) nonprofit, EIN 88-0303288, incorporated in Nevada.</p>
    </footer>
  );
}
