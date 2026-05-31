"use client";

import { useState } from "react";
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
    <form action={handleSubmit} className="space-y-6">
      {/* 画像 */}
      <div>
        <label className="mb-2 block text-sm font-medium">商品画像</label>
        {thumbnail ? (
          <div className="relative h-40 w-40 overflow-hidden rounded-lg border border-gray-200">
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
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-sm text-white"
              >
                ×
              </button>
            )}
          </div>
        ) : (
          <label className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-brand hover:text-brand">
            <span className="text-3xl leading-none">＋</span>
            <span className="mt-1 text-xs">写真を選ぶ</span>
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
          <p className="mt-2 text-xs text-green-700">
            最適化完了: WebP / {Math.round(image.size / 1024)}KB に圧縮しました。
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          ※ 長辺800px・WebP・約100KB以下に自動圧縮されます（通信量・保存容量の節約のため）。
        </p>
      </div>

      {/* 商品名 */}
      <Field label="商品名" required>
        <input
          name="title"
          required
          maxLength={100}
          placeholder="例: 微分積分学I 教科書 / Switch ソフト〇〇"
          className="input"
        />
      </Field>

      {/* カテゴリ */}
      <Field label="カテゴリ" required>
        <select name="category" required defaultValue="" className="input">
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

      {/* 価格 */}
      <Field label="価格">
        <label className="mb-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={free}
            onChange={(e) => setFree(e.target.checked)}
          />
          無料で譲る
        </label>
        {!free && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500">¥</span>
            <input
              name="price"
              type="number"
              min={0}
              step={10}
              defaultValue={0}
              className="input"
            />
          </div>
        )}
        <p className="mt-1 text-xs text-gray-500">
          ※ お金のやり取りはキャンパスでの対面受け渡し時に行ってください。
        </p>
      </Field>

      {/* 説明 */}
      <Field label="商品の説明">
        <textarea
          name="description"
          rows={5}
          maxLength={2000}
          placeholder="状態、購入時期、受け渡し場所の希望などを書きましょう。"
          className="input resize-none"
        />
      </Field>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || busy}
        className="w-full rounded-xl bg-brand py-3 font-medium text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {submitting ? "出品中…" : "出品する"}
      </button>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #d1d5db;
          background: #fff;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          outline: none;
        }
        :global(.input:focus) {
          border-color: var(--brand);
        }
      `}</style>
    </form>
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
      <label className="mb-2 block text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
