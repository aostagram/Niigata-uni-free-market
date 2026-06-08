/*
 * Tailwind Play CDN 用の設定。
 * 実アプリ(src/app/globals.css の @theme inline)と同じブランドトークンを再現する。
 * 各 HTML で <script src="cdn.tailwindcss.com"></script> の直後に読み込む。
 * ※ 配色を変えるときは globals.css / styles.css も一緒に更新すること。
 */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        background: "#fbfdf7", // ごく淡い緑がかった白
        foreground: "#3c4a2e", // インク(濃いオリーブグレー)
        brand: {
          DEFAULT: "#84ad3f", // オリーブ系ブランドカラー
          deep: "#5f8128",
          deeper: "#4d6a1f",
          // 旧トークン名の後方互換
          dark: "#5f8128",
          light: "#9cc659",
          lighter: "#aed87a",
          pale: "#e7f4d6",
          mist: "#f1f8e6",
        },
        ink: {
          DEFAULT: "#3c4a2e",
          soft: "#74806a",
          faint: "#9aa48d",
        },
        panel: "#f5f8ec",
        line: "#e7eed9",
        coral: "#db6a4f",
        star: "#9bb83f",
        like: "#e1607a",
      },
      fontFamily: {
        sans: [
          "Zen Kaku Gothic New",
          "Hiragino Sans",
          "Noto Sans JP",
          "Yu Gothic",
          "Meiryo",
          "system-ui",
          "sans-serif",
        ],
        round: ["Zen Maru Gothic", "system-ui", "sans-serif"],
        latin: ["Comfortaa", "cursive"],
      },
      borderRadius: {
        ds: "18px",
      },
    },
  },
};
