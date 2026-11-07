import { Link, useParams } from "react-router-dom";
import { DraftBanner, legalDocs, legalHtml } from "./legal";
import { Photo } from "./Photo";
import { HERO } from "./photos";

export function LegalIndex() {
  const docs = legalDocs();
  return (
    <article className="legal">
      <div className="legal-banner"><Photo shot={HERO.interior} alt="" sizes="(max-width: 760px) 100vw, 760px" /></div>
      <DraftBanner />
      <h1>Legal drafts</h1>
      <p className="muted">23 drafts for a solicitor to review. Nothing here is legal advice. Marketplace agreement LEG-17 is a stub and is not in use.</p>
      <ul>
        {docs.map((doc) => (
          <li key={doc.id}>
            <Link to={`/legal/${doc.id}`}>{doc.title}</Link>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function LegalPage() {
  const { id } = useParams();
  const doc = legalDocs().find((row) => row.id === id);
  if (!doc) return <p>That draft was not found.</p>;
  return (
    <article className="legal">
      <DraftBanner />
      <p><Link to="/legal">All drafts</Link></p>
      <div dangerouslySetInnerHTML={{ __html: legalHtml(doc.markdown) }} />
    </article>
  );
}
