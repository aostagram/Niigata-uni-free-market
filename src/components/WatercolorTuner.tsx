"use client";

import { useEffect, useState } from "react";

/* =========================================================
   水彩アンビエントの調整パネル
   globals.css の CSS 変数(--wc-*)をブラウザ上のスライダーから
   リアルタイムに書き換える。値は localStorage に保存され、
   リロードしても維持される。「いい感じ」になったら "CSSをコピー" で
   globals.css の :root に貼り付けて確定できる。
   ========================================================= */

type Knob = {
  key: string; // CSS変数名(-- は除く)
  label: string;
  min: number;
  max: number;
  step: number;
  unit: "" | "%";
  hint: string;
};

const KNOBS: Knob[] = [
  {
    key: "wc-intensity",
    label: "全体の濃さ",
    min: 0,
    max: 2,
    step: 0.05,
    unit: "",
    hint: "水彩全体の色の濃さ",
  },
  {
    key: "wc-top",
    label: "上の広がり",
    min: 20,
    max: 90,
    step: 1,
    unit: "%",
    hint: "上部の水彩がどこまで下りてくるか",
  },
  {
    key: "wc-bottom",
    label: "下の広がり",
    min: 0,
    max: 80,
    step: 1,
    unit: "%",
    hint: "下部の水彩がどこまで上がるか",
  },
  {
    key: "wc-hero",
    label: "ヒーローのなじみ",
    min: 0,
    max: 0.6,
    step: 0.01,
    unit: "",
    hint: "0=境目くっきり / 大きいほど下端が溶ける",
  },
];

const DEFAULTS: Record<string, number> = {
  "wc-intensity": 1,
  "wc-top": 58,
  "wc-bottom": 40,
  "wc-hero": 0.22,
};

const STORAGE_KEY = "wc-tuner-v1";

function format(knob: Knob, value: number) {
  const v = knob.step < 1 ? value.toFixed(2) : String(Math.round(value));
  return `${v}${knob.unit}`;
}

function applyToDocument(values: Record<string, number>) {
  const root = document.documentElement;
  for (const knob of KNOBS) {
    root.style.setProperty(`--${knob.key}`, format(knob, values[knob.key]));
  }
}

function loadInitial(): Record<string, number> {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function WatercolorTuner() {
  const [open, setOpen] = useState(false);
  // localStorage からの復元は遅延初期化で(effect 内 setState を避ける)。
  // パネルは初期状態で閉じているので、保存値に依存する DOM は
  // ハイドレーション時にはまだ描画されず、不一致は起きない。
  const [values, setValues] = useState<Record<string, number>>(loadInitial);
  const [copied, setCopied] = useState(false);

  // 復元した値を CSS 変数へ反映(外部システムへの同期。setState はしない)
  useEffect(() => {
    applyToDocument(values);
  }, [values]);

  function update(key: string, value: number) {
    const next = { ...values, [key]: value };
    setValues(next);
    applyToDocument(next);
    setCopied(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // 保存できなくても操作自体は継続
    }
  }

  function reset() {
    setValues(DEFAULTS);
    applyToDocument(DEFAULTS);
    setCopied(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  function cssSnippet() {
    return [
      ":root {",
      ...KNOBS.map((k) => `  --${k.key}: ${format(k, values[k.key])};`),
      "}",
    ].join("\n");
  }

  async function copyCss() {
    try {
      await navigator.clipboard.writeText(cssSnippet());
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 print:hidden">
      {open ? (
        <div className="w-72 rounded-2xl border border-brand/15 bg-white/95 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-brand-dark">水彩の調整</p>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
              aria-label="閉じる"
            >
              閉じる
            </button>
          </div>

          <div className="space-y-3">
            {KNOBS.map((knob) => (
              <label key={knob.key} className="block">
                <span className="flex items-center justify-between text-xs font-medium text-gray-700">
                  {knob.label}
                  <span className="tabular-nums text-brand">
                    {format(knob, values[knob.key])}
                  </span>
                </span>
                <input
                  type="range"
                  min={knob.min}
                  max={knob.max}
                  step={knob.step}
                  value={values[knob.key]}
                  onChange={(e) => update(knob.key, Number(e.target.value))}
                  className="mt-1 w-full accent-brand"
                />
                <span className="text-[10px] leading-tight text-gray-400">
                  {knob.hint}
                </span>
              </label>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={copyCss}
              className="flex-1 rounded-full bg-gradient-to-br from-brand-light to-brand-dark px-3 py-2 text-xs font-medium text-white shadow-sm hover:brightness-105"
            >
              {copied ? "コピーしました" : "CSSをコピー"}
            </button>
            <button
              onClick={reset}
              className="rounded-full border border-brand/20 px-3 py-2 text-xs text-brand-dark hover:bg-brand-pale/60"
            >
              リセット
            </button>
          </div>

          <p className="mt-2 text-[10px] leading-tight text-gray-400">
            動かすとページ全体の水彩がリアルタイムに変わります。値はこの端末に保存されます。
          </p>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-brand-dark shadow-lg ring-1 ring-brand/15 backdrop-blur hover:bg-white"
        >
          🎨 水彩を調整
        </button>
      )}
    </div>
  );
}
