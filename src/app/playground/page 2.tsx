"use client";

import { useEffect, useRef, useState } from "react";
import { notFound } from "next/navigation";

/**
 * Claude.ai / Artifacts プレビュー用ページ
 * ----------------------------------------------------------------
 * Claude.ai で作った React コンポーネント(Artifact)を左に貼り付けると、
 * 右の隔離 iframe で「Claude.ai と同じ実行環境」を再現して表示します。
 *
 *  - React 19 / lucide-react / recharts / framer-motion などは
 *    import map 経由で esm.sh から解決(普通の import 文がそのまま動く)
 *  - Tailwind は Play CDN(Claude.ai と同じ。デフォルト色が効く)
 *  - さらにこのアプリのブランドトークン(bg-brand など)も注入してあるので、
 *    アプリに馴染む配色のまま確認できる
 *  - TSX / JSX は iframe 内の Babel standalone で変換
 *
 * ※ あくまで開発用のプレビューツールです。本番ページには含めません。
 */

const STORAGE_KEY = "playground:code";

const SAMPLE = `import { useState } from "react";
import { Heart, Tag } from "lucide-react";

// Claude.ai の Artifact をそのまま貼り付けてください。
// export default のコンポーネントが描画されます。
export default function App() {
  const [liked, setLiked] = useState(false);
  return (
    <div className="min-h-screen bg-brand-mist p-6 flex items-center justify-center">
      <div className="w-72 rounded-2xl bg-white shadow-md overflow-hidden">
        <div className="h-36 bg-gradient-to-br from-brand-light to-brand-dark" />
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-brand-dark">
            <Tag size={16} />
            <span className="text-sm font-medium">教科書</span>
          </div>
          <h3 className="font-bold text-gray-800">微分積分学 入門</h3>
          <div className="flex items-center justify-between">
            <span className="text-lg font-extrabold text-brand">¥800</span>
            <button
              onClick={() => setLiked((v) => !v)}
              className="rounded-full p-2 hover:bg-brand-pale transition"
            >
              <Heart
                size={20}
                className={liked ? "fill-brand text-brand" : "text-gray-400"}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`;

/** iframe に流し込む HTML を組み立てる */
function buildSrcDoc(code: string): string {
  // </script> による早期終了を避けつつ JSON 文字列として安全に埋め込む
  const encoded = JSON.stringify(code).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@19",
    "react/jsx-runtime": "https://esm.sh/react@19/jsx-runtime",
    "react-dom": "https://esm.sh/react-dom@19",
    "react-dom/client": "https://esm.sh/react-dom@19/client",
    "lucide-react": "https://esm.sh/lucide-react@latest?external=react",
    "recharts": "https://esm.sh/recharts?external=react",
    "framer-motion": "https://esm.sh/framer-motion?external=react",
    "clsx": "https://esm.sh/clsx",
    "tailwind-merge": "https://esm.sh/tailwind-merge",
    "class-variance-authority": "https://esm.sh/class-variance-authority"
  }
}
</script>
<script src="https://cdn.tailwindcss.com"></script>
<script>
  // このアプリのブランドトークンを Tailwind に登録(bg-brand / text-brand-dark など)
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          brand: {
            DEFAULT: "#0b7a4b",
            dark: "#075c38",
            light: "#6fb83a",
            lighter: "#aed87a",
            pale: "#e7f4d6",
            mist: "#f1f8e6",
          },
        },
      },
    },
  };
</script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<style>
  html, body { margin: 0; }
  body { font-family: "Hiragino Sans", "Noto Sans JP", system-ui, sans-serif; }
  #err {
    display: none;
    margin: 0; padding: 16px 20px;
    font: 13px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace;
    color: #b00020; background: #fff0f0;
    white-space: pre-wrap; word-break: break-word;
  }
</style>
<script id="source" type="application/json">${encoded}</script>
</head>
<body>
<div id="root"></div>
<pre id="err"></pre>
<script type="module">
  const showError = (msg) => {
    const el = document.getElementById("err");
    el.style.display = "block";
    el.textContent = String(msg);
  };
  window.addEventListener("error", (e) => showError(e.message || e.error));
  window.addEventListener("unhandledrejection", (e) =>
    showError(e.reason && e.reason.stack ? e.reason.stack : e.reason)
  );

  try {
    const source = JSON.parse(document.getElementById("source").textContent);
    // TSX/JSX を変換(自動ランタイムなので import React は不要)
    const out = Babel.transform(source, {
      filename: "artifact.tsx",
      presets: [
        ["react", { runtime: "automatic" }],
        ["typescript", { isTSX: true, allExtensions: true }],
      ],
    }).code;

    // 変換済みコードをモジュール化して読み込む(import 文は import map で解決)
    const url = URL.createObjectURL(
      new Blob([out], { type: "text/javascript" })
    );
    const mod = await import(url);

    const Comp =
      mod.default ||
      mod.App ||
      Object.values(mod).find((v) => typeof v === "function");

    if (!Comp) {
      throw new Error(
        "描画できるコンポーネントが見つかりません。export default function App() {...} の形にしてください。"
      );
    }

    const React = (await import("react")).default;
    const { createRoot } = await import("react-dom/client");
    createRoot(document.getElementById("root")).render(
      React.createElement(Comp)
    );
  } catch (e) {
    showError(e && e.stack ? e.stack : e);
  }
</script>
</body>
</html>`;
}

export default function PlaygroundPage() {
  // 開発専用ツール。外部CDNを読み込み任意のTSXを実行するため、本番には絶対に出さない。
  if (process.env.NODE_ENV === "production") notFound();

  const [code, setCode] = useState("");
  const [srcDoc, setSrcDoc] = useState("");
  const [iframeKey, setIframeKey] = useState(0);
  const taRef = useRef<HTMLTextAreaElement>(null);

  // 初回読み込み:保存済みコード or サンプルを復元して即プレビュー
  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;
    const initial = saved ?? SAMPLE;
    // localStorage はサーバーで読めないため、マウント後に復元する必要がある。
    // (ハイドレーション不一致を避けるための初期化なので effect 内 setState で問題ない)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCode(initial);
    setSrcDoc(buildSrcDoc(initial));
  }, []);

  const run = () => {
    window.localStorage.setItem(STORAGE_KEY, code);
    setSrcDoc(buildSrcDoc(code));
    setIframeKey((k) => k + 1); // CDN 再読込のため iframe を作り直す
  };

  const reset = () => {
    setCode(SAMPLE);
    setSrcDoc(buildSrcDoc(SAMPLE));
    setIframeKey((k) => k + 1);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="flex h-dvh flex-col bg-brand-mist">
      {/* ツールバー */}
      <header className="flex shrink-0 items-center gap-3 border-b border-brand-pale bg-white px-4 py-2.5">
        <span className="font-bold text-brand-dark">🎨 Artifacts プレビュー</span>
        <span className="hidden text-xs text-gray-500 sm:inline">
          Claude.ai で作った React を貼って「実行」
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={reset}
            className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
          >
            サンプルに戻す
          </button>
          <button
            onClick={run}
            className="rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            ▶ 実行 (⌘/Ctrl+Enter)
          </button>
        </div>
      </header>

      {/* エディタ + プレビュー */}
      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2">
        <section className="flex min-h-0 flex-col border-r border-brand-pale">
          <textarea
            ref={taRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                run();
              }
            }}
            spellCheck={false}
            placeholder="ここに Claude.ai の Artifact (React/TSX) を貼り付け…"
            className="h-full w-full resize-none bg-[#1e1e1e] p-4 font-mono text-sm leading-relaxed text-[#d4d4d4] outline-none"
          />
        </section>

        <section className="min-h-0 bg-white">
          <iframe
            key={iframeKey}
            srcDoc={srcDoc}
            title="artifact-preview"
            sandbox="allow-scripts"
            className="h-full w-full border-0"
          />
        </section>
      </div>
    </div>
  );
}
