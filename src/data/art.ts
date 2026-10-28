import type { ArtPiece } from '@/types';

/** /art 艺术页文案 —— 个人艺术品位，与工作 / 专业无关 */
export const artIntro = {
  kicker: 'Personal Zine',
  title: '纸上的留白',
  titleEn: 'Gathered Scenes · A Quiet Zine',
  /** 策展语 */
  lede: '工作之外，我收集安静的瞬间：夜车的站台、雾未散的湖岸、一盏茶凉下去的时间。把照片撕开、贴回纸面 —— 摄影负责真实，插画负责呼吸；空白不是没画，是给情绪留的座位。',
  outroKicker: 'About the Series',
  outroTitle: '关于这个系列',
  outro: '实景拼贴（Gathered Scenes Zine）：以真实照片为锚，让简笔插画与单一印刷色在撕纸边缘内外流动。这个系列的三张纸，分别关于「等待」「雾」与「茶」—— 都是需要慢下来才看得见的东西。',
};

export const artPieces: ArtPiece[] = [
  {
    id: 'night-train',
    index: '01',
    title: '等一班夜车',
    titleEn: 'Waiting for the Night Train',
    year: '2026',
    medium: '实景拼贴 · 收藏级微喷',
    note: '把整夜压成一条竖直的照片带：孤灯与候车的人留在真实里，铁轨与电线越出撕纸的边缘，化作纸面上一道群青色的汇流。等待本身，是这张海报里最大的留白。',
    posterText: { zh: '等一班夜车', en: 'waiting for the night train' },
    image: '/images/art/01-transit.webp',
    alt: '实景拼贴海报：雨夜站台孤灯下候车人的剪影，铁轨延伸入群青色的夜',
  },
  {
    id: 'fog-shore',
    index: '02',
    title: '雾还没有散',
    titleEn: 'The Fog Remains',
    year: '2026',
    medium: '实景拼贴 · 收藏级微喷',
    note: '照片只在右下角锚住一棵斜向水面的树，其余全部交给纸的空白。雾是未印之处；一小块梨绿色，是树在雾散之前唯一想说的话。',
    posterText: { zh: '雾还没有散', en: 'the fog remains' },
    image: '/images/art/02-shore.webp',
    alt: '实景拼贴海报：晨雾湖岸，照片锚住的斜树与撕纸边缘外的留白雾场',
  },
  {
    id: 'cup-of-quiet',
    index: '03',
    title: '一盏茶的时间',
    titleEn: 'A Cup of Quiet',
    year: '2026',
    medium: '实景拼贴 · 收藏级微喷',
    note: '撕开墙面，露出窗外一整块高饱和的绿；热气只用一根断续的线。午后的光落在旧书上，时间在这里以杯为单位计量。',
    posterText: { zh: '一盏茶的时间', en: 'a cup of quiet' },
    image: '/images/art/03-sill.webp',
    alt: '实景拼贴海报：撕开的纸墙露出窗外绿意，木桌上一盏冒热气的茶与旧书',
  },
];
