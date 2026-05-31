import imageCompression from "browser-image-compression";
import { createClient } from "@/lib/supabase/client";
import { ITEM_IMAGE_BUCKET } from "@/lib/constants";

/**
 * 画像アップロードのコスト最適化方針(Supabase 無料枠: 1GB Storage / 5GB 帯域)
 *  - 長辺 800px に縮小
 *  - WebP に変換
 *  - 目標 100KB 以下まで圧縮
 *  - 念のため 200KB を超えたらアップロードを拒否
 */
const MAX_WIDTH_OR_HEIGHT = 800;
const TARGET_SIZE_MB = 0.1; // ≒ 100KB
const HARD_LIMIT_BYTES = 200 * 1024; // 200KB

/** ファイル名の拡張子を .webp に置き換える */
function toWebpName(name: string): string {
  const base = name.replace(/\.[^/.]+$/, "");
  return `${base || "image"}.webp`;
}

/**
 * 画像を 800px / WebP / 100KB目標 に圧縮する。
 * テキスト(教科書の表紙など)の可読性を保ちつつ容量を最小化する。
 */
export async function compressToWebp(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("画像ファイルを選択してください。");
  }

  const compressedBlob = await imageCompression(file, {
    maxWidthOrHeight: MAX_WIDTH_OR_HEIGHT,
    maxSizeMB: TARGET_SIZE_MB,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.8,
  });

  return new File([compressedBlob], toWebpName(file.name), {
    type: "image/webp",
  });
}

export type UploadedImage = { url: string; path: string; size: number };

/** 圧縮済み(200KB超なら拒否)の WebP を Supabase Storage にアップロードする */
export async function uploadWebp(
  userId: string,
  webp: File,
): Promise<UploadedImage> {
  if (webp.size > HARD_LIMIT_BYTES) {
    throw new Error(
      `圧縮後も画像が大きすぎます（${Math.round(
        webp.size / 1024,
      )}KB）。よりシンプルな写真や、別の画像でお試しください。`,
    );
  }

  const supabase = createClient();
  const path = `${userId}/${crypto.randomUUID()}.webp`;

  const { error } = await supabase.storage
    .from(ITEM_IMAGE_BUCKET)
    .upload(path, webp, {
      cacheControl: "3600",
      contentType: "image/webp",
      upsert: false,
    });

  if (error) {
    throw new Error(
      "アップロードに失敗しました。Storage バケット（item-images）の設定をご確認ください。",
    );
  }

  const { data } = supabase.storage.from(ITEM_IMAGE_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path, size: webp.size };
}

/**
 * 画像を圧縮して Supabase Storage(item-images)へアップロードし、
 * 公開URL・パス・最終サイズを返す。圧縮後でも 200KB を超える場合は拒否する。
 */
export async function uploadItemImage(
  userId: string,
  file: File,
): Promise<UploadedImage> {
  const webp = await compressToWebp(file);
  return uploadWebp(userId, webp);
}

/** アップロード済み画像を削除する */
export async function removeItemImage(path: string): Promise<void> {
  const supabase = createClient();
  await supabase.storage.from(ITEM_IMAGE_BUCKET).remove([path]);
}
