import type { IconName } from '@/types';

/** 极简线性图标集 —— 24 viewBox · 1.5 stroke，与「工程图纸」视觉语言统一 */
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const ICONS: Record<IconName, JSX.Element> = {
  briefcase: (
    <g {...stroke}>
      <rect x="3" y="7.5" width="18" height="12.5" rx="1.5" />
      <path d="M9 7.5V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5v2" />
      <path d="M3 13h18" />
    </g>
  ),
  document: (
    <g {...stroke}>
      <path d="M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5z" />
      <path d="M14 3v4.5h4.5" />
      <path d="M9 12.5h6M9 16h4" />
    </g>
  ),
  code: (
    <g {...stroke}>
      <polyline points="9 7 4 12 9 17" />
      <polyline points="15 7 20 12 15 17" />
    </g>
  ),
  award: (
    <g {...stroke}>
      <circle cx="12" cy="8.5" r="5.5" />
      <path d="M15 13.5 16.5 21l-4.5-2.6L7.5 21 9 13.5" />
    </g>
  ),
  function: (
    <g {...stroke}>
      <path d="M4.5 4v15.5H20" />
      <path d="M7.5 16.5c4.5 0 3.5-9 9-9" />
      <circle cx="16.5" cy="7.5" r="1.4" />
    </g>
  ),
  nodes: (
    <g {...stroke}>
      <circle cx="6" cy="6.5" r="2.3" />
      <circle cx="18" cy="6.5" r="2.3" />
      <circle cx="12" cy="17.5" r="2.3" />
      <path d="M8 7.6l2.6 7.6M16 7.6l-2.6 7.6M8.3 6.5h7.4" />
    </g>
  ),
  chip: (
    <g {...stroke}>
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <path d="M9.5 4v3M14.5 4v3M9.5 17v3M14.5 17v3M4 9.5h3M4 14.5h3M17 9.5h3M17 14.5h3" />
    </g>
  ),
  'arrow-right': (
    <g {...stroke}>
      <path d="M4.5 12h15" />
      <path d="M13.5 6l6 6-6 6" />
    </g>
  ),
  'arrow-up-right': (
    <g {...stroke}>
      <path d="M6.5 17.5 17.5 6.5" />
      <path d="M8 6.5h9.5V16" />
    </g>
  ),
  'arrow-left': (
    <g {...stroke}>
      <path d="M19.5 12h-15" />
      <path d="M10.5 6l-6 6 6 6" />
    </g>
  ),
  'arrow-up': (
    <g {...stroke}>
      <path d="M12 19.5v-15" />
      <path d="M6 10.5l6-6 6 6" />
    </g>
  ),
  download: (
    <g {...stroke}>
      <path d="M12 3.5V15" />
      <path d="M7 10.5l5 5 5-5" />
      <path d="M4 19.5h16" />
    </g>
  ),
  mail: (
    <g {...stroke}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </g>
  ),
  github: (
    <path
      fill="currentColor"
      d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
    />
  ),
  linkedin: (
    <path
      fill="currentColor"
      d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"
    />
  ),
  'map-pin': (
    <g {...stroke}>
      <path d="M12 21s-7-5.4-7-11a7 7 0 0 1 14 0c0 5.6-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </g>
  ),
  menu: (
    <g {...stroke}>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </g>
  ),
  close: (
    <g {...stroke}>
      <path d="M6 6l12 12M18 6L6 18" />
    </g>
  ),
  'file-text': (
    <g {...stroke}>
      <path d="M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5z" />
      <path d="M14 3v4.5h4.5" />
      <path d="M9 12h6M9 15.5h6M9 8.5h2" />
    </g>
  ),
  calendar: (
    <g {...stroke}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
      <path d="M8 3v4M16 3v4M3.5 10.5h17" />
    </g>
  ),
  clock: (
    <g {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.2l3.2 2" />
    </g>
  ),
  check: (
    <g {...stroke}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </g>
  ),
  target: (
    <g {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
    </g>
  ),
  layers: (
    <g {...stroke}>
      <path d="M12 3.5l8.5 4.5-8.5 4.5L3.5 8z" />
      <path d="M3.5 12.5l8.5 4.5 8.5-4.5" />
      <path d="M3.5 16.5L12 21l8.5-4.5" />
    </g>
  ),
  phone: (
    <path
      fill="currentColor"
      d="M19.95 21c-2.13 0-4.35-.62-6.34-1.62a21.3 21.3 0 0 1-5.72-4.27 21.3 21.3 0 0 1-4.27-5.72C2.62 7.4 2 5.18 2 3.05 2 2.47 2.47 2 3.05 2h3.5c.48 0 .9.34.98.81l.7 3.9c.08.43-.1.87-.46 1.12L5.9 9.13a15.4 15.4 0 0 0 5.93 5.93l1.32-1.85c.25-.36.69-.54 1.12-.46l3.9.7c.47.08.81.5.81.98v3.5c0 .58-.47 1.05-1.05 1.05z"
    />
  ),
};

export function Icon({
  name,
  size = 16,
  className,
  strokeWidth,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
      style={strokeWidth ? { strokeWidth } : undefined}
    >
      {ICONS[name]}
    </svg>
  );
}
