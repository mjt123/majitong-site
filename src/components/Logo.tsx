/** 个人 Logo —— 抽象自「Z 字形 + 行驶轨迹」：上横线 / 轨迹对角线 / 下横线 */
export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      {/* 上横线 */}
      <path d="M6 7.5h20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {/* 轨迹对角线：一条带箭头的行驶轨迹 */}
      <path
        d="M25 11.5 C 19 13.5, 13.5 16.5, 8.6 21.4"
        stroke="var(--color-accent-strong)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M8.2 16.6 L 7.9 22.1 L 13.2 21.2" stroke="var(--color-accent-strong)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* 参考点（金色极小点缀） */}
      <circle cx="25" cy="11.5" r="1.7" fill="var(--color-gold)" />
      {/* 下横线 */}
      <path d="M6 25h20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
