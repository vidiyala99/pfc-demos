import { loadSite } from "../../../../lib/content";
import { AlsoShowing, Band, DONATE_URL, Footer, Masthead, Tab, asset } from "../../../components/parts";

export function generateStaticParams() {
  return loadSite().projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = loadSite().projects.find((x) => x.slug === slug)!;
  return { title: `${p.title} | Partnerships For Change`, description: p.lede };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = loadSite();
  const p = site.projects.find((x) => x.slug === slug)!;
  const others = site.projects.filter((x) => x.showInAlsoShowing && x.slug !== p.slug).slice(0, 4);
  const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <>
      <Masthead headline={site.home.headline} current="work" />
      <main id="main">
        <article className="screening" aria-labelledby="title">
          <nav className="crumbs" aria-label="Breadcrumb"><a href={`${BASE}/#season`}>Our work</a><span aria-hidden="true">/</span><span>{p.title}</span></nav>
          <figure className="screening__still">
            {p.image ? <img src={asset(p.image)} alt={p.imageAlt} fetchPriority="high" /> : <span className="placeholder">{p.placeholder}</span>}
          </figure>
          <h1 id="title" className="screening__title display">{p.title}</h1>
          <p className="screening__credits">{p.place}</p>
          <div className="screening__meta">
            <Tab strand={p.strand} large />
            <Band band={p.band} large />
            <span className="sep" aria-hidden="true" />
            <a className="ticket ticket--lg" href={DONATE_URL}><span className="ticket__inner">Donate to this project</span></a>
          </div>
          <div className="screening__body">
            <div className="prose" dangerouslySetInnerHTML={{ __html: p.html }} />
            <dl className="facts">
              <div><dt>Strand</dt><dd>{p.strand}</dd></div>
              <div><dt>Kind</dt><dd>{p.kind}</dd></div>
              <div><dt>Status</dt><dd>{p.band.text}</dd></div>
              <div><dt>Last reviewed</dt><dd><time dateTime={p.lastReviewed}>{p.lastReviewed}</time></dd></div>
            </dl>
          </div>
        </article>
        <section className="section" aria-label="More from the programme">
          <AlsoShowing projects={others} wide />
        </section>
      </main>
      <Footer />
    </>
  );
}
