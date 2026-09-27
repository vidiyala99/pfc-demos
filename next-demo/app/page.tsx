import { loadSite } from "../../lib/content";
import { AlsoShowing, Arrow, Band, DONATE_URL, Footer, Masthead, Tab, asset, projectHref } from "../components/parts";
import { SeasonList } from "../components/SeasonList";

export default function Home() {
  const site = loadSite();
  const f = site.featured;

  return (
    <>
      <Masthead headline={site.home.headline} />
      <main id="main">
        <section className="programme" aria-labelledby="feature-title">
          <article className="feature">
            <figure className="feature__still">
              {f.image ? <img src={asset(f.image)} alt={f.imageAlt} fetchPriority="high" /> : <span className="placeholder">{f.placeholder}</span>}
            </figure>
            <h1 id="feature-title" className="feature__title display"><a href={projectHref(f.slug)}>{f.title}</a></h1>
            <p className="feature__credits">{f.lede} {f.place}.</p>
            <div className="feature__actions">
              <Tab strand={f.strand} large />
              <Band band={f.band} large />
              <span className="sep" aria-hidden="true" />
              <a className="ticket ticket--lg" href={DONATE_URL}><span className="ticket__inner">Donate to this project</span></a>
            </div>
          </article>
          <AlsoShowing projects={site.alsoShowing} />
        </section>

        <SeasonList projects={site.projects} />

        <section className="submissions" id="submissions" aria-labelledby="sub-title">
          <div className="submissions__inner">
            <div>
              <h2 id="sub-title" className="display">Submissions open</h2>
              <p>Issue-based films and projects can apply for fiscal sponsorship: a 501(c)(3) home for grants and donations, plus the support to get the work made and seen.</p>
              <p className="fine">Fees depend on the level of support. PFC confirms terms with each project.</p>
              <a className="button-line" href="https://partnershipsforchange.org/fiscal-sponsorship-application/">Apply for fiscal sponsorship <Arrow /></a>
            </div>
            <ul className="offer" aria-label="What PFC provides">
              <li>Fiscal sponsorship</li><li>Funding networks</li><li>Financial development</li><li>Talent</li><li>Design and packaging</li><li>Distribution</li>
            </ul>
          </div>
        </section>

        <section className="section" id="record" aria-labelledby="record-title">
          <div className="section__head">
            <div>
              <h2 id="record-title" className="section__title display">The record</h2>
              <p className="section__lede">Solid figures are checked against independent records. Outlined figures are PFC&apos;s own and wait for a source.</p>
            </div>
          </div>
          <div className="record">
            <div className="figure"><span className="figure__n">$1.16M</span><p className="figure__what">Revenue in fiscal year 2024</p><p className="figure__src"><strong>Verified.</strong> <a href="https://projects.propublica.org/nonprofits/organizations/880303288">IRS Form 990, via ProPublica</a></p></div>
            <div className="figure"><span className="figure__n figure__n--ghost">1990</span><p className="figure__what">Year PFC began its work</p><p className="figure__src">Awaiting source</p></div>
            <div className="figure"><span className="figure__n figure__n--ghost">$40M+</span><p className="figure__what">Support directed to projects</p><p className="figure__src">Awaiting source and period</p></div>
            <div className="figure"><span className="figure__n figure__n--ghost">80-85%</span><p className="figure__what">Of funds to direct project work</p><p className="figure__src">PFC FAQ; awaiting Form 990 match</p></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
