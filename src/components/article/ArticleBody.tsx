import { Reveal } from '@/components/ui/Reveal';
import { Tex } from '@/components/ui/Tex';
import type { ArticleBlock } from '@/types';

/** 正文行内标记：**加粗**、`行内代码` 与 $行内公式$（非贪婪匹配） */
export function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[\s\S]+?\*\*|`[^`]+`|\$[^$]+?\$)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**') && p.length > 4)
          return (
            <strong key={i} className="font-semibold text-ink">
              {p.slice(2, -2)}
            </strong>
          );
        if (p.startsWith('`') && p.endsWith('`') && p.length > 2)
          return (
            <code key={i} className="rounded-sm border border-line bg-surface-raised px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
              {p.slice(1, -1)}
            </code>
          );
        if (p.startsWith('$') && p.endsWith('$') && p.length > 2)
          return <Tex key={i} tex={p.slice(1, -1)} className="text-ink" />;
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

/** 文章正文块渲染器 —— BlogPostPage 与 BlogImportPage 共用；章节 / 图版 / 表格自动编号 */
export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  let headingNo = 0;
  let figureNo = 0;
  let tableNo = 0;

  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'heading': {
            headingNo += 1;
            return (
              <Reveal key={i} className="mt-14 first:mt-2">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] font-medium tracking-[0.18em] text-accent">
                    {String(headingNo).padStart(2, '0')}
                  </span>
                  <h2 className="text-lg font-semibold tracking-[0.01em] text-ink sm:text-xl">{b.text}</h2>
                  {b.en && <span className="hidden font-serif text-[12px] italic text-ink-tertiary md:inline">/ {b.en}</span>}
                </div>
                <span aria-hidden className="mt-3 block h-px bg-line" />
              </Reveal>
            );
          }
          case 'para':
            return (
              <Reveal key={i}>
                <p className="mt-5 text-[14px] leading-[2.05] text-ink-secondary">
                  <InlineText text={b.text} />
                </p>
              </Reveal>
            );
          case 'equation':
            return (
              <Reveal key={i}>
                <div className="mt-6 rounded-tile border border-line bg-surface px-5 py-4">
                  <div className="flex items-center justify-between gap-4 overflow-x-auto">
                    <Tex tex={b.tex} display className="min-w-0 shrink-[2] text-[13.5px] text-ink" />
                    {b.label && <span className="shrink-0 font-mono text-[11px] text-ink-tertiary">{b.label}</span>}
                  </div>
                  {b.note && (
                    <p className="mt-2 border-t border-line pt-2 text-[11.5px] leading-relaxed text-ink-tertiary">
                      <InlineText text={b.note} />
                    </p>
                  )}
                </div>
              </Reveal>
            );
          case 'figure': {
            figureNo += 1;
            return (
              <Reveal key={i}>
                <figure className="mt-6 overflow-hidden rounded-card border border-line bg-surface shadow-card">
                  <img src={b.src} alt={b.caption} loading="lazy" className="mx-auto block max-h-[460px] w-auto max-w-full" />
                  <figcaption className="flex gap-3 border-t border-line px-5 py-3">
                    <span className="shrink-0 pt-px font-mono text-[10.5px] tracking-[0.14em] text-accent">
                      FIG.{String(figureNo).padStart(2, '0')}
                    </span>
                    <span className="text-[12px] leading-relaxed text-ink-tertiary">{b.caption}</span>
                  </figcaption>
                </figure>
              </Reveal>
            );
          }
          case 'table': {
            tableNo += 1;
            return (
              <Reveal key={i}>
                <figure className="mt-6 overflow-hidden rounded-card border border-line bg-surface shadow-card">
                  <div className="overflow-x-auto px-4 py-2 sm:px-5">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr>
                          {b.headers.map((h, j) => (
                            <th
                              key={j}
                              className="border-b border-accent-line px-3 py-2.5 font-mono text-[11px] font-medium tracking-[0.06em] text-ink"
                            >
                              <InlineText text={h} />
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {b.rows.map((row, j) => (
                          <tr key={j} className="border-b border-line last:border-b-0">
                            {row.map((cell, k) => (
                              <td key={k} className="px-3 py-2.5 align-top text-[12.5px] leading-relaxed text-ink-secondary">
                                <InlineText text={cell} />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <figcaption className="flex gap-3 border-t border-line px-5 py-3">
                    <span className="shrink-0 pt-px font-mono text-[10.5px] tracking-[0.14em] text-accent">
                      TABLE.{String(tableNo).padStart(2, '0')}
                    </span>
                    <span className="text-[12px] leading-relaxed text-ink-tertiary">{b.caption}</span>
                  </figcaption>
                </figure>
              </Reveal>
            );
          }
          case 'code':
            return (
              <Reveal key={i}>
                <div className="mt-6 overflow-hidden rounded-card border border-line bg-surface">
                  <div className="flex items-center justify-between border-b border-line px-5 py-2">
                    <span className="font-mono text-[10.5px] tracking-[0.14em] text-accent">
                      {(b.lang || 'CODE').toUpperCase()}
                    </span>
                  </div>
                  <pre className="overflow-x-auto px-5 py-4">
                    <code className="whitespace-pre font-mono text-[12px] leading-relaxed text-ink-secondary">{b.code}</code>
                  </pre>
                </div>
              </Reveal>
            );
          case 'list':
            return (
              <Reveal key={i}>
                <ul className="mt-5 space-y-2.5">
                  {b.items.map((item, j) => (
                    <li key={j} className="flex gap-3 text-[13.5px] leading-[1.9] text-ink-secondary">
                      <span aria-hidden className="mt-[2px] shrink-0 font-mono text-[11px] text-ink-tertiary">
                        {b.ordered ? String(j + 1).padStart(2, '0') : '—'}
                      </span>
                      <span>
                        <InlineText text={item} />
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          case 'callout':
            return (
              <Reveal key={i}>
                <aside className="mt-8 rounded-r-card border-l-2 border-accent bg-surface px-5 py-4">
                  <p className="font-mono text-[10.5px] tracking-[0.14em] text-accent">{b.title}</p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-ink-secondary">{b.text}</p>
                </aside>
              </Reveal>
            );
          case 'references':
            return (
              <Reveal key={i}>
                <div className="mt-14 border-t border-line pt-6">
                  <p className="font-mono text-[10.5px] tracking-[0.14em] text-accent">REFERENCES</p>
                  <ol className="mt-4 space-y-2.5">
                    {b.items.map((r, j) => (
                      <li key={j} className="flex gap-3">
                        <span className="shrink-0 pt-px font-mono text-[11px] text-ink-tertiary">[{j + 1}]</span>
                        <span className="font-serif text-[12.5px] leading-relaxed text-ink-tertiary">{r}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
