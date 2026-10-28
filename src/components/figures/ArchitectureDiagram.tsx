import type { Project } from '@/types';

/** 系统架构图 —— 串级 block + 反馈回路，随数据生成 */
export function ArchitectureDiagram({ architecture }: { architecture: Project['detail']['architecture'] }) {
  const n = architecture.blocks.length;
  const blockW = 132;
  const gap = 34;
  const width = n * blockW + (n - 1) * gap + 24;
  const height = 132;
  const y = 22;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label="系统架构框图"
    >
      <defs>
        <marker id="arch-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 Z" fill="var(--color-text-tertiary)" />
        </marker>
        <marker id="arch-arrow-accent" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 Z" fill="var(--color-accent)" />
        </marker>
      </defs>

      {architecture.blocks.map((b, i) => {
        const x = 12 + i * (blockW + gap);
        const cx = x + blockW / 2;
        return (
          <g key={b.label}>
            <rect
              x={x}
              y={y}
              width={blockW}
              height={56}
              rx={4}
              fill="var(--color-surface)"
              stroke={i === n - 1 ? 'var(--color-accent-line)' : 'var(--color-border-strong)'}
              strokeWidth={1.1}
            />
            <text x={cx} y={y + 25} textAnchor="middle" className="font-heading" fontSize={13} fontWeight={600} fill="var(--color-text-primary)">
              {b.label}
            </text>
            {b.sub && (
              <text x={cx} y={y + 43} textAnchor="middle" className="font-mono" fontSize={8.5} fill="var(--color-text-tertiary)">
                {b.sub}
              </text>
            )}
            {i < n - 1 && (
              <path
                d={`M ${x + blockW + 3} ${y + 28} H ${x + blockW + gap - 4}`}
                stroke="var(--color-text-tertiary)"
                strokeWidth={1.1}
                markerEnd="url(#arch-arrow)"
              />
            )}
            {/* 反馈回路锚点 */}
            {i === 0 && <circle cx={cx} cy={y + 78} r={2.2} fill="var(--color-accent)" />}
            {i === n - 1 && <circle cx={cx} cy={y + 78} r={2.2} fill="var(--color-accent)" />}
          </g>
        );
      })}

      {/* 反馈回路 */}
      <path
        d={`M ${12 + (n - 1) * (blockW + gap) + blockW / 2} ${y + 78} V ${y + 88} H ${12 + blockW / 2} V ${y + 80}`}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={1.1}
        strokeDasharray="4 3"
        markerEnd="url(#arch-arrow-accent)"
      />
      <text
        x={width / 2}
        y={y + 104}
        textAnchor="middle"
        className="font-mono"
        fontSize={9}
        fill="var(--color-accent)"
      >
        ⟲ {architecture.feedbackLabel}
      </text>
    </svg>
  );
}
