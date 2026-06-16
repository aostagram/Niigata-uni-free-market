/* =========================================================
   ヒーローのキャンパス風 抽象水彩イラスト(SVG)
   ※ 新潟大学の公式ロゴ・公式マークは使用しない抽象シルエット。
   トップページとプレビューページで共有する。
   ========================================================= */
export function CampusArt() {
  return (
    <div className="wc-bleed-2 overflow-hidden">
      <svg
        viewBox="0 0 440 300"
        className="h-auto w-full"
        role="img"
        aria-label="キャンパスの水彩イラスト"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d6efff" />
            <stop offset="1" stopColor="#f3fbff" />
          </linearGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#cdeb9a" />
            <stop offset="1" stopColor="#a9d473" />
          </linearGradient>
          <linearGradient id="tree" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6fb83a" />
            <stop offset="1" stopColor="#2f7d3a" />
          </linearGradient>
          <linearGradient id="tower" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3f8f6b" />
            <stop offset="1" stopColor="#0b7a4b" />
          </linearGradient>
        </defs>

        {/* 空 */}
        <rect x="0" y="0" width="440" height="300" fill="url(#sky)" />
        {/* 太陽 */}
        <circle cx="370" cy="60" r="34" fill="#fdf0a8" opacity="0.85" />
        {/* 雲(水彩のにじみ) */}
        <ellipse cx="80" cy="50" rx="46" ry="20" fill="#ffffff" opacity="0.8" />
        <ellipse cx="120" cy="58" rx="34" ry="16" fill="#ffffff" opacity="0.7" />

        {/* 遠くの丘 */}
        <ellipse cx="120" cy="210" rx="180" ry="60" fill="#bfe089" opacity="0.7" />
        <ellipse cx="360" cy="220" rx="160" ry="55" fill="#cdeb9a" opacity="0.7" />

        {/* 時計塔風の抽象シルエット(公式マークではない) */}
        <g>
          <rect x="206" y="92" width="28" height="120" rx="4" fill="url(#tower)" />
          <polygon points="206,92 220,66 234,92" fill="#0b7a4b" />
          <circle cx="220" cy="116" r="7" fill="#f3fbff" />
          <circle cx="220" cy="116" r="2.4" fill="#0b7a4b" />
          <rect x="213" y="150" width="14" height="20" rx="3" fill="#f3fbff" opacity="0.7" />
        </g>

        {/* 木々 */}
        <g>
          <rect x="92" y="170" width="8" height="40" fill="#7a5230" />
          <ellipse cx="96" cy="158" rx="40" ry="36" fill="url(#tree)" />
          <ellipse cx="74" cy="168" rx="24" ry="22" fill="#6fb83a" opacity="0.9" />

          <rect x="338" y="176" width="7" height="36" fill="#7a5230" />
          <ellipse cx="342" cy="166" rx="32" ry="30" fill="url(#tree)" />
          <ellipse cx="362" cy="176" rx="20" ry="18" fill="#8cc84f" opacity="0.9" />
        </g>

        {/* 地面 */}
        <path d="M0 214 Q220 188 440 214 L440 300 L0 300 Z" fill="url(#ground)" />
        {/* 小道 */}
        <path d="M150 300 Q210 250 220 214 Q232 250 300 300 Z" fill="#eaf4d2" opacity="0.8" />

        {/* 歩く学生のシルエット */}
        <g fill="#2f7d3a">
          <g transform="translate(196 232)">
            <circle cx="0" cy="0" r="6" />
            <path d="M-6 8 Q0 6 6 8 L5 30 L-5 30 Z" />
          </g>
          <g transform="translate(244 240)" fill="#0b7a4b">
            <circle cx="0" cy="0" r="5" />
            <path d="M-5 7 Q0 5 5 7 L4 26 L-4 26 Z" />
          </g>
          <g transform="translate(176 246)" fill="#4a9b58">
            <circle cx="0" cy="0" r="5" />
            <path d="M-5 7 Q0 5 5 7 L4 24 L-4 24 Z" />
          </g>
        </g>
      </svg>
    </div>
  );
}
