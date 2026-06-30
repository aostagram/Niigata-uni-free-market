"use client";

import { useState } from "react";
import { Camera, Sprout, ArrowRight } from "lucide-react";
import { createItem } from "@/app/actions/items";
import { compressToWebp, uploadWebp, removeItemImage } from "@/lib/upload";
import { CATEGORIES } from "@/lib/constants";

type Phase = "idle" | "compressing" | "uploading";

export function AddItemForm({ userId }: { userId: string }) {
  const [image, setImage] = useState<{
    url: string;
    path: string;
    size: number;
  } | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // 圧縮前のローカルプレビュー
  const [phase, setPhase] = useState<Phase>("idle");
  const [submitting, setSubmitting] = useState(false);
  const [free, setFree] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const busy = phase !== "idle";

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);

    // 既存画像があれば差し替え前に削除
    if (image) {
      await removeItemImage(image.path);
      setImage(null);
    }

    // 選択直後にローカルプレビューを表示
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      // 1) クライアント側で圧縮(WebP / 長辺800px / 100KB目標)
      setPhase("compressing");
      const webp = await compressToWebp(file);
      // 2) Supabase Storage へアップロード(200KB超なら uploadWebp が拒否)
      setPhase("uploading");
      const result = await uploadWebp(userId, webp);
      setImage(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "画像の処理に失敗しました。");
      setPreview(null);
    } finally {
      setPhase("idle");
      URL.revokeObjectURL(localUrl);
    }
  }

  async function clearImage() {
    if (image) await removeItemImage(image.path);
    setImage(null);
    setPreview(null);
  }

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    const result = await createItem({
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      price: free ? 0 : Number(formData.get("price") ?? 0),
      category: String(formData.get("category") ?? ""),
      imageUrl: image?.url ?? null,
    });
    // 成功時はサーバー側で redirect されるためここには到達しない。
    if (result?.error) {
      setError(result.error);
      setSubmitting(false);
    }
  }

  const thumbnail = image?.url ?? preview;

  return (
    <form action={handleSubmit} className="space-y-5">
      {/* 商品写真 */}
      <Section title="商品写真">
        {thumbnail ? (
          <div className="relative h-44 w-44 overflow-hidden rounded-2xl border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbnail} alt="" className="h-full w-full object-cover" />
            {busy && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/55 text-xs text-white">
                <Spinner />
                <span>
                  {phase === "compressing" ? "画像を圧縮中…" : "アップロード中…"}
                </span>
              </div>
            )}
            {!busy && (
              <button
                type="button"
                onClick={clearImage}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-sm text-white"
              >
                ×
              </button>
            )}
          </div>
        ) : (
          <label
            className="flex h-44 w-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand text-center"
            style={{ background: "rgba(132,173,63,.04)" }}
          >
            <span className="mb-2.5 flex h-14 w-14 items-center justify-center rounded-full bg-panel">
              <Camera size={26} className="text-brand-deep" />
            </span>
            <span className="font-round text-sm font-bold text-brand-deep">
              写真を追加する
            </span>
            <span className="mt-1 text-[11px] text-ink-soft">
              クリックして選択
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={busy}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
        )}
        {image && !busy && (
          <p className="mt-2.5 text-xs text-brand-deep">
            最適化完了: WebP / {Math.round(image.size / 1024)}KB に圧縮しました。
          </p>
        )}
        <p className="mt-1 text-xs text-ink-soft">
          ※ 長辺800px・WebP・約100KB以下に自動圧縮されます（通信量・保存容量の節約のため）。
        </p>
      </Section>

      {/* 商品情報 */}
      <Section title="商品情報">
        <div className="space-y-5">
          <Field label="商品名" required>
            <input
              name="title"
              required
              maxLength={100}
              placeholder="例: 微分積分学I 教科書 / Switch ソフト〇〇"
              className="field"
            />
          </Field>

          <Field label="カテゴリ" required>
            <select name="category" required defaultValue="" className="field">
              <option value="" disabled>
                選択してください
              </option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="価格">
            <label className="mb-2 flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={free}
                onChange={(e) => setFree(e.target.checked)}
                className="accent-[color:var(--brand)]"
              />
              無料で譲る
            </label>
            {!free && (
              <div className="flex items-center gap-2">
                <span className="text-ink-soft">¥</span>
                <input
                  name="price"
                  type="number"
                  min={0}
                  step={10}
                  defaultValue={0}
                  className="field"
                />
              </div>
            )}
            <p className="mt-1 text-xs text-ink-soft">
              ※ お金のやり取りはキャンパスでの対面受け渡し時に行ってください。
            </p>
          </Field>

          <Field label="商品の説明">
            <textarea
              name="description"
              rows={5}
              maxLength={2000}
              placeholder="状態、購入時期、受け渡し場所の希望などを書きましょう。"
              className="field resize-none"
            />
          </Field>
        </div>
      </Section>

      {error && (
        <p className="rounded-xl border border-coral-line bg-coral-bg px-4 py-3 text-sm text-coral">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || busy}
        className="btn btn-primary w-full py-4 text-base"
      >
        {submitting ? "出品中…" : "出品する"}
        {!submitting && <ArrowRight size={18} />}
      </button>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="ds-card p-6">
      <div className="heading-row mb-4">
        <Sprout size={19} className="text-brand" />
        <h2 className="font-round text-lg font-bold text-ink">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-1 text-coral">*</span>}
      </label>
      {children}
    </div>
  );
}
