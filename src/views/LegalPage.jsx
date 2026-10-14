import { formatDate } from '@/lib/format.js';

export default function LegalPage({ doc }) {
  return (
    <main className="legal-page">
      <header className="phead">
        <div className="container phead__grid phead__grid--single">
          <h1 className="phead__title">{doc.title}</h1>
          <p className="lede phead__lede">{doc.summary}</p>
          <p className="legal-updated">Last updated <time dateTime={doc.updated}>{formatDate(doc.updated)}</time></p>
        </div>
      </header>

      <div className="container legal">
        <nav className="legal__toc" aria-label="On this page">
          <details open>
            <summary>On this page</summary>
            <ol>
              {doc.toc.map((t) => <li key={t.id}><a href={`#${t.id}`}>{t.text}</a></li>)}
            </ol>
          </details>
        </nav>
        <article className="prose legal__body" dangerouslySetInnerHTML={{ __html: doc.html }} />
      </div>
    </main>
  );
}
