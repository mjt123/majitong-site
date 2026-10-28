import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EASE } from '@/theme/animation';
import { Icon } from '@/components/ui/Icon';
import { ArticleBody } from '@/components/article/ArticleBody';
import { mdToBlocks, mdAutoExcerpt, mdReadTime, slugify } from '@/utils/mdToBlocks';import { usePageTitle } from '@/hooks/usePageTitle';


type Tab = 'preview' | 'entry' | 'blocks';

const inputCls =
  'mt-1 w-full border border-line bg-surface-raised px-3 py-2 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-tertiary focus:border-accent-line';
const labelCls = 'block font-mono text-[10.5px] tracking-[0.12em] text-ink-tertiary';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** 11 博客导入工具 —— Markdown → 站点文章数据（解析 / 预览 / 导出片段） */
export function BlogImportPage() {
  usePageTitle('MD 导入工具');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [md, setMd] = useState('');
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [tab, setTab] = useState<Tab>('preview');
  const [copied, setCopied] = useState('');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [date, setDate] = useState(today());
  const [tags, setTags] = useState('');
  const [readTime, setReadTime] = useState('12 min');
  const [excerpt, setExcerpt] = useState('');
  const touched = useRef<Set<string>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);

  const parsed = useMemo(() => mdToBlocks(md), [md]);

  // 自动填充：标题 / slug / 摘要 / 阅读时长（用户手动编辑过的字段不再覆盖）
  const autoTitle = parsed.title || fileName.replace(/\.(md|markdown|txt)$/i, '');
  if (!touched.current.has('title') && autoTitle && title !== autoTitle) setTitle(autoTitle);
  if (!touched.current.has('slug')) {
    const auto = slugify(autoTitle) || date.replace(/-/g, '');
    if (auto && slug !== auto) setSlug(auto);
  }
  if (!touched.current.has('excerpt')) {
    const auto = mdAutoExcerpt(parsed.blocks);
    if (auto && excerpt !== auto) setExcerpt(auto);
  }
  if (!touched.current.has('readTime')) {
    const auto = mdReadTime(parsed.blocks);
    if (md && readTime !== auto) setReadTime(auto);
  }

  const markTouched = (key: string) => (value: string) => {
    touched.current.add(key);
    if (key === 'title') setTitle(value);
    if (key === 'slug') setSlug(value);
    if (key === 'date') setDate(value);
    if (key === 'tags') setTags(value);
    if (key === 'readTime') setReadTime(value);
    if (key === 'excerpt') setExcerpt(value);
  };

  const tagList = tags
    .split(/[,，]/)
    .map((t) => t.trim())
    .filter(Boolean);
  const ready = Boolean(md.trim() && title.trim() && /^[a-z0-9-]+$/.test(slug));

  const entryCode = useMemo(() => {
    if (!ready) return '';
    return [
      '  {',
      `    slug: '${slug}',`,
      `    title: ${JSON.stringify(title)},`,
      `    excerpt: ${JSON.stringify(excerpt)},`,
      `    date: '${date}',`,
      `    tags: [${tagList.map((t) => `'${t}'`).join(', ')}],`,
      `    readTime: '${readTime}',`,
      '    hasArticle: true,',
      '  },',
    ].join('\n');
  }, [ready, slug, title, excerpt, date, tagList, readTime]);

  const blocksCode = useMemo(() => {
    if (!ready) return '';
    const json = JSON.stringify(parsed.blocks, null, 2)
      .split('\n')
      .map((l, j) => (j === 0 ? l : `  ${l}`))
      .join('\n');
    return `  '${slug}': {\n    blocks: ${json},\n  },`;
  }, [ready, slug, parsed.blocks]);

  const code = tab === 'entry' ? entryCode : blocksCode;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(tab);
      setTimeout(() => setCopied(''), 1600);
    } catch {
      setCopied('');
    }
  };

  const readFile = async (file: File) => {
    const text = await file.text();
    setMd(text);
    setFileName(file.name);
    touched.current.clear();
    setTitle('');
    setSlug('');
  };

  const enter = reduce
    ? {}
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease: EASE.precise } };

  return (
    <main className="bg-bg">
      {/* —— 头部 —— */}
      <section className="relative overflow-hidden bg-hero-bg">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(720px 320px at 80% -10%, var(--color-hero-glow), transparent 62%)' }}
        />
        <div className="container-site relative pb-14 pt-24 lg:pt-28">
          <motion.div {...enter}>
            <Link
              to="/"
              state={{ scrollTo: 'blog' }}
              className="group inline-flex items-center gap-2 font-mono text-[11.5px] tracking-[0.14em] text-hero-text-2 transition-colors hover:text-hero-text"
            >
              <Icon name="arrow-left" size={13} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
              BACK / 技术博客
            </Link>
          </motion.div>
          <div className="mt-8 max-w-3xl">
            <motion.p {...enter} className="kicker flex items-center gap-2.5 text-hero-text-2">
              <span aria-hidden className="inline-block h-[7px] w-[7px] border border-accent-strong" />
              TOOLS / MARKDOWN IMPORT
            </motion.p>
            <motion.h1 {...enter} className="mt-4 text-[1.7rem] font-bold leading-[1.3] text-hero-text sm:text-[2.1rem]">
              文章导入
            </motion.h1>
            <motion.p {...enter} className="mt-5 max-w-2xl border-l-2 border-accent/60 pl-4 text-[13.5px] leading-[1.9] text-hero-text-2">
              把 Markdown 笔记转成站点文章数据：解析 → 预览 → 复制数据片段，分别贴回 <code className="font-mono text-[12px]">src/data/blog.ts</code> 与{' '}
              <code className="font-mono text-[12px]">src/data/blogArticles.ts</code>，重新构建后即生效。
            </motion.p>
          </div>
        </div>
      </section>

      {/* —— 主体：左输入 / 右预览导出 —— */}
      <section className="py-14 lg:py-16">
        <div className="container-site">
          <div className="mx-auto grid max-w-[1240px] items-start gap-8 lg:grid-cols-2">
            {/* 左：输入 */}
            <div className="space-y-6">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) void readFile(file);
                }}
                onClick={() => fileRef.current?.click()}
                className={
                  'cursor-pointer rounded-card border border-dashed px-5 py-6 text-center transition-colors ' +
                  (dragOver ? 'border-accent bg-surface' : 'border-line bg-surface hover:border-accent-line')
                }
              >
                <p className="font-mono text-[11.5px] tracking-[0.1em] text-ink-secondary">
                  {fileName ? fileName : '拖入 .md 文件，或点击选择'}
                </p>
                <p className="mt-1 text-[11.5px] text-ink-tertiary">支持标题 / 加粗 / 行内代码 / $公式$ / $$数学块 / 代码块 / 表格 / 列表 / 引用 / 图片</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".md,.markdown,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void readFile(file);
                  }}
                />
              </div>

              <div>
                <p className={labelCls}>MARKDOWN 源</p>
                <textarea
                  value={md}
                  onChange={(e) => setMd(e.target.value)}
                  placeholder={'# 文章标题\n\n正文段落，支持 **加粗**、`代码` 与 $行内公式$。\n\n## 章节\n\n- 列表项\n\n| 列 A | 列 B |\n| --- | --- |\n| 1 | 2 |'}
                  className={inputCls + ' h-64 resize-y font-mono text-[12px] leading-relaxed'}
                />
                <p className="mt-1.5 font-mono text-[10.5px] text-ink-tertiary">
                  {parsed.blocks.length > 0 ? `${parsed.blocks.length} 个内容块` : '等待输入'}
                  {parsed.title ? ` · 识别到标题「${parsed.title}」` : ''}
                </p>
              </div>

              <div className="rounded-card border border-line bg-surface p-5">
                <p className="font-mono text-[10.5px] tracking-[0.14em] text-accent">元数据</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>标题</label>
                    <input value={title} onChange={(e) => markTouched('title')(e.target.value)} className={inputCls} placeholder="文章标题" />
                  </div>
                  <div>
                    <label className={labelCls}>SLUG（/blog/…，小写字母数字连字符）</label>
                    <input value={slug} onChange={(e) => markTouched('slug')(e.target.value)} className={inputCls} placeholder="my-note" />
                  </div>
                  <div>
                    <label className={labelCls}>日期</label>
                    <input type="date" value={date} onChange={(e) => markTouched('date')(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>标签（逗号分隔）</label>
                    <input value={tags} onChange={(e) => markTouched('tags')(e.target.value)} className={inputCls} placeholder="控制, MPC" />
                  </div>
                  <div>
                    <label className={labelCls}>阅读时长</label>
                    <input value={readTime} onChange={(e) => markTouched('readTime')(e.target.value)} className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>摘要</label>
                    <textarea
                      value={excerpt}
                      onChange={(e) => markTouched('excerpt')(e.target.value)}
                      className={inputCls + ' h-16 resize-none'}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 右：预览 / 导出 */}
            <div className="rounded-card border border-line bg-surface shadow-card">
              <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
                <div className="flex gap-1">
                  {(
                    [
                      ['preview', '预览'],
                      ['entry', 'blog.ts 条目'],
                      ['blocks', 'blogArticles.ts 片段'],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTab(key)}
                      className={
                        'px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] transition-colors ' +
                        (tab === key ? 'bg-surface-raised text-accent' : 'text-ink-tertiary hover:text-ink')
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {tab !== 'preview' && (
                  <button
                    type="button"
                    onClick={() => void copy()}
                    disabled={!ready}
                    className="border border-line px-3 py-1.5 font-mono text-[10.5px] tracking-[0.1em] text-ink-secondary transition-colors hover:border-accent-line hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {copied === tab ? '已复制 ✓' : '复制'}
                  </button>
                )}
              </div>

              {tab === 'preview' ? (
                <div className="max-h-[760px] overflow-y-auto px-6 py-6">
                  {parsed.blocks.length > 0 ? (
                    <>
                      <h1 className="text-[1.5rem] font-bold leading-snug text-ink">{title || '（未命名文章）'}</h1>
                      <p className="mt-2 font-mono text-[11px] tracking-[0.06em] text-ink-tertiary">
                        {date} · {readTime.toUpperCase()}
                        {tagList.length > 0 ? ` · ${tagList.join(' · ')}` : ''}
                      </p>
                      <div className="mt-6">
                        <ArticleBody blocks={parsed.blocks} />
                      </div>
                    </>
                  ) : (
                    <p className="py-24 text-center text-[13px] text-ink-tertiary">左侧输入或拖入 Markdown 后，这里实时预览文章页效果</p>
                  )}
                </div>
              ) : (
                <div className="max-h-[760px] overflow-auto px-5 py-4">
                  {code ? (
                    <pre className="whitespace-pre font-mono text-[11.5px] leading-relaxed text-ink-secondary">{code}</pre>
                  ) : (
                    <p className="py-24 text-center text-[13px] text-ink-tertiary">填写标题与 slug 后生成代码片段</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* —— 工作流说明 —— */}
          <div className="mx-auto mt-10 max-w-[1240px] rounded-card border border-line bg-surface p-5">
            <p className="font-mono text-[10.5px] tracking-[0.14em] text-accent">工作流</p>
            <ol className="mt-3 space-y-1.5 text-[12.5px] leading-relaxed text-ink-secondary">
              <li>
                <span className="mr-2 font-mono text-[11px] text-ink-tertiary">01</span>
                拖入 / 粘贴 Markdown，核对预览与元数据（slug 仅限小写字母、数字与连字符；图片先放 <code className="font-mono text-[11.5px]">public/images/blog/</code>，正文用绝对路径引用）。
              </li>
              <li>
                <span className="mr-2 font-mono text-[11px] text-ink-tertiary">02</span>
                复制右侧两段代码，分别贴回 <code className="font-mono text-[11.5px]">src/data/blog.ts</code> 的 <code className="font-mono text-[11.5px]">blogPosts</code> 数组（建议放在最前）与{' '}
                <code className="font-mono text-[11.5px]">src/data/blogArticles.ts</code> 的对象内。
              </li>
              <li>
                <span className="mr-2 font-mono text-[11px] text-ink-tertiary">03</span>
                <code className="font-mono text-[11.5px]">npm run build</code> 后文章即上线（列表按日期排序，新文章显示在最前）。
              </li>
            </ol>
          </div>
        </div>
      </section>
    </main>
  );
}
