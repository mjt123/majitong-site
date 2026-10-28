import type { ArticleBlock } from '@/types';

/** Markdown → 站点文章 blocks 的解析结果 */
export interface MdParseResult {
  /** 第一个 `# ` 一级标题（进元数据，不进正文块） */
  title: string;
  blocks: ArticleBlock[];
}

const RE = {
  heading: /^(#{1,4})\s+(.+?)\s*#*\s*$/,
  codeFence: /^\s*```\s*([A-Za-z0-9+#.-]*)\s*$/,
  fenceClose: /^\s*```\s*$/,
  mathFence: /^\s*\$\$\s*$/,
  tableRow: /^\s*\|.*\|\s*$/,
  tableSep: /^\s*\|?\s*:?-{3,}[-\s:|]*\|?\s*$/,
  ul: /^[-*+]\s+(.+)$/,
  ol: /^\d+[.)]\s+(.+)$/,
  quote: /^>\s?(.*)$/,
  image: /^!\[([^\]]*)\]\(([^)\s]+)[^)]*\)\s*$/,
  hr: /^\s*(-{3,}|\*{3,})\s*$/,
};

/** 行内整理：$$x$$ → $x$（行内双美元降级为单美元，交由 InlineText 渲染） */
function inlineTidy(s: string): string {
  return s.replace(/\$\$([^$]+)\$\$/g, (_, t: string) => `$${t.trim()}$`);
}

/**
 * 把 Markdown 文本解析为站点文章块。支持：#/##/### 标题、段落（**加粗** / `代码` / $公式$ 行内标记）、
 * $$ 数学块、``` 代码块、GFM 表格、有序/无序列表、> 引用（→ callout）、独立行图片（→ figure）、--- 分隔线。
 */
export function mdToBlocks(md: string): MdParseResult {
  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  const blocks: ArticleBlock[] = [];
  let title = '';
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) {
      const raw = para.join(' ').trim();
      // 整段恰为一个 $$…$$ 数学式 → 独立公式块
      const mMath = raw.match(/^\$\$(.+)\$\$$/);
      if (mMath) blocks.push({ type: 'equation', tex: mMath[1].trim() });
      else blocks.push({ type: 'para', text: inlineTidy(raw) });
      para = [];
    }
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // ``` 代码块
    const mCode = line.match(RE.codeFence);
    if (mCode) {
      flushPara();
      const buf: string[] = [];
      i += 1;
      while (i < lines.length && !RE.fenceClose.test(lines[i])) {
        buf.push(lines[i]);
        i += 1;
      }
      i += 1; // 跳过闭合 ```
      blocks.push({ type: 'code', lang: mCode[1] || undefined, code: buf.join('\n') });
      continue;
    }

    // $$ 数学块
    if (RE.mathFence.test(line)) {
      flushPara();
      const buf: string[] = [];
      i += 1;
      while (i < lines.length && !RE.mathFence.test(lines[i])) {
        buf.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push({ type: 'equation', tex: buf.join(' ').trim() });
      continue;
    }

    // # 标题
    const mH = line.match(RE.heading);
    if (mH) {
      flushPara();
      const text = mH[2].trim();
      if (mH[1].length === 1 && !title) title = text;
      else blocks.push({ type: 'heading', text, en: '' });
      i += 1;
      continue;
    }

    // --- 分隔线
    if (RE.hr.test(line)) {
      flushPara();
      i += 1;
      continue;
    }

    // GFM 表格：当前行是 | 行且下一行是分隔行
    if (RE.tableRow.test(line) && i + 1 < lines.length && RE.tableSep.test(lines[i + 1])) {
      flushPara();
      const rows: string[][] = [];
      while (i < lines.length && RE.tableRow.test(lines[i])) {
        const cells = lines[i]
          .trim()
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map((c) => c.trim());
        rows.push(cells);
        i += 1;
      }
      rows.splice(1, 1); // 去掉分隔行
      const [headers = [], ...rest] = rows;
      blocks.push({ type: 'table', headers, rows: rest, caption: '' });
      continue;
    }

    // > 引用 → callout
    if (RE.quote.test(line)) {
      flushPara();
      const buf: string[] = [];
      while (i < lines.length && RE.quote.test(lines[i])) {
        buf.push(lines[i].replace(RE.quote, '$1'));
        i += 1;
      }
      blocks.push({ type: 'callout', title: 'NOTE', text: inlineTidy(buf.join(' ').trim()) });
      continue;
    }

    // 列表（同级归一块；缩进行并入上一项）
    const mUl = line.match(RE.ul);
    const mOl = line.match(RE.ol);
    if (mUl || mOl) {
      flushPara();
      const ordered = Boolean(mOl);
      const items: string[] = [];
      while (i < lines.length) {
        const a = lines[i].match(RE.ul);
        const b = lines[i].match(RE.ol);
        if (a && !ordered) items.push(a[1]);
        else if (b && ordered) items.push(b[1]);
        else if (/^\s+\S/.test(lines[i]) && items.length > 0) items[items.length - 1] += ` ${lines[i].trim()}`;
        else break;
        i += 1;
      }
      blocks.push({ type: 'list', ordered, items: items.map((s) => inlineTidy(s.trim())) });
      continue;
    }

    // 独立行图片 → figure
    const mImg = line.match(RE.image);
    if (mImg) {
      flushPara();
      blocks.push({ type: 'figure', src: mImg[2], caption: mImg[1] || '插图' });
      i += 1;
      continue;
    }

    // 空行分段
    if (!line.trim()) {
      flushPara();
      i += 1;
      continue;
    }

    para.push(line.trim());
    i += 1;
  }
  flushPara();

  return { title, blocks };
}

/** 由正文块自动生成摘要（首段去标记，截断到 max 字） */
export function mdAutoExcerpt(blocks: ArticleBlock[], max = 96): string {
  const p = blocks.find((b) => b.type === 'para');
  const plain = p && p.type === 'para' ? p.text.replace(/\*\*|`|\$/g, '') : '';
  return plain.length > max ? `${plain.slice(0, max)}……` : plain;
}

/** 由正文块估算阅读时长（中文 ~400 字/分钟 + 英文 ~200 词/分钟，代码按词计） */
export function mdReadTime(blocks: ArticleBlock[]): string {
  let chars = 0;
  let words = 0;
  const collect = (s: string) => {
    chars += (s.match(/[\u4e00-\u9fff]/g) ?? []).length;
    words += (s.match(/[A-Za-z0-9]+/g) ?? []).length;
  };
  for (const b of blocks) {
    if (b.type === 'para') collect(b.text);
    else if (b.type === 'heading') collect(b.text);
    else if (b.type === 'list') b.items.forEach(collect);
    else if (b.type === 'callout') collect(b.text);
    else if (b.type === 'table') {
      b.headers.forEach(collect);
      b.rows.forEach((r) => r.forEach(collect));
    } else if (b.type === 'code') words += b.code.split(/\s+/).filter(Boolean).length;
  }
  return `${Math.max(1, Math.round(chars / 400 + words / 200))} min`;
}

/** 标题 → slug（仅 ASCII 词；中文标题返回空串，需手动填写） */
export function slugify(input: string): string {
  const s = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s;
}
