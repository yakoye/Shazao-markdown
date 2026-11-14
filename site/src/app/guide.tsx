import { ArrowIcon, PageHero, releaseUrl, repoUrl, storeUrl, useLocale } from "./pages";
import content from "./guide-content.json";

// Generated from content/guide.src.json by scripts/gen_guide.py (adds the zh-TW text).
type Text = { zh: string; tw: string; en: string };
type Block = {
  p?: Text;
  list?: Text[];
  steps?: Text[];
  shot?: string;
  caption?: Text;
  narrow?: boolean;
  defs?: [Text, Text][];
  cards?: [Text, Text][];
  keygroups?: [Text, [string, Text][]][];
  actions?: "start" | "feedback";
};
type Section = { id: string; title: Text; blocks: Block[] };

const guide = content as unknown as { hero: Text; sections: Section[] };
const NEW_TAG = /^(0\.6\.2\d) /;

function Keys({ combo }: { combo: string }) {
  const parts = combo === "Ctrl+=" ? ["Ctrl", "="] : combo.split("+").filter(Boolean);
  if (combo.endsWith("++")) parts.push("+");
  return (
    <span className="keys">
      {parts.map((key, index) => (
        <kbd key={index}>{key.replace("Left", "←").replace("Right", "→").replace("Up", "↑").replace("Down", "↓")}</kbd>
      ))}
    </span>
  );
}

export function GuidePage() {
  const { locale } = useLocale();
  const L = (text: Text) => text[locale];
  const item = (text: Text) => {
    const value = L(text);
    const match = value.match(NEW_TAG);
    return match ? (
      <>
        <span className="new-badge">{match[1]}</span>
        {value.slice(match[0].length)}
      </>
    ) : (
      value
    );
  };

  const renderBlock = (block: Block, index: number) => {
    if (block.p) return <p key={index}>{item(block.p)}</p>;
    if (block.list)
      return (
        <ul key={index}>
          {block.list.map((entry, i) => (
            <li key={i}>{item(entry)}</li>
          ))}
        </ul>
      );
    if (block.steps)
      return (
        <ol key={index}>
          {block.steps.map((entry, i) => (
            <li key={i}>{item(entry)}</li>
          ))}
        </ol>
      );
    if (block.shot)
      return (
        <figure key={index} className={`doc-shot${block.narrow ? " narrow" : ""}`}>
          <div className="screenshot">
            <img
              src={`${import.meta.env.BASE_URL}screens/${block.shot}`}
              alt={block.caption ? L(block.caption) : ""}
              loading="lazy"
            />
          </div>
          {block.caption && <figcaption>{L(block.caption)}</figcaption>}
        </figure>
      );
    if (block.defs)
      return (
        <dl key={index} className="doc-legend">
          {block.defs.map(([term, desc], i) => (
            <div key={i}>
              <dt>{L(term)}</dt>
              <dd>{L(desc)}</dd>
            </div>
          ))}
        </dl>
      );
    if (block.cards)
      return (
        <div key={index} className="mode-cards">
          {block.cards.map(([title, desc], i) => (
            <div key={i}>
              <b>{L(title)}</b>
              <p>{L(desc)}</p>
            </div>
          ))}
        </div>
      );
    if (block.keygroups)
      return (
        <div key={index} className="shortcut-groups">
          {block.keygroups.map(([title, rows], i) => (
            <section key={i}>
              <h3>{L(title)}</h3>
              <div className="shortcut-table">
                {rows.map(([combo, label]) => (
                  <div key={combo}>
                    <Keys combo={combo} />
                    <span>{L(label)}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      );
    if (block.actions === "start")
      return (
        <div key={index} className="doc-actions">
          <a className="button" href={storeUrl}>
            Microsoft Store <ArrowIcon />
          </a>
          <a className="button ghost" href={releaseUrl}>
            GitHub Releases
          </a>
          <a className="button ghost" href={`${repoUrl}/tree/main/demo`}>
            {L({ zh: "演示文档", tw: "示範文件", en: "Demo documents" })}
          </a>
        </div>
      );
    if (block.actions === "feedback")
      return (
        <div key={index} className="doc-actions">
          <a className="button" href={`${repoUrl}/issues`}>
            GitHub Issues <ArrowIcon />
          </a>
          <a className="button ghost" href={`${repoUrl}/blob/main/doc/CHANGELOG.md`}>
            {L({ zh: "更新日志", tw: "更新日誌", en: "Changelog" })}
          </a>
          <a className="button ghost" href={`${repoUrl}/blob/main/doc/PUBLIC_ROADMAP.md`}>
            {L({ zh: "开发计划", tw: "開發計畫", en: "Roadmap" })}
          </a>
        </div>
      );
    return null;
  };

  return (
    <main>
      <PageHero
        eyebrow="DOCUMENTATION"
        title={L({ zh: "使用指南", tw: "使用指南", en: "Guide" })}
        description={L(guide.hero)}
      />
      <section className="guide-page section-wrap">
        <aside className="docs-nav">
          {guide.sections.map((section, index) => (
            <a key={section.id} href={`#${section.id}`}>
              <small>{String(index + 1).padStart(2, "0")}</small>
              {L(section.title)}
            </a>
          ))}
        </aside>
        <div className="docs-content">
          {guide.sections.map((section, index) => (
            <article key={section.id} id={section.id}>
              <small>{String(index + 1).padStart(2, "0")}</small>
              <h2>{L(section.title)}</h2>
              {section.blocks.map(renderBlock)}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
