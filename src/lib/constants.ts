/**
 * 新潟大学生限定にするための、許可するメールドメイン。
 * Google OAuth でログイン後、このドメインで終わるメールアドレスのみを許可する。
 */
export const ALLOWED_EMAIL_DOMAIN = "mail.cc.niigata-u.ac.jp";

/** メールアドレスが新潟大学生のものかどうかを判定する */
export function isAllowedEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return email.toLowerCase().endsWith(`@${ALLOWED_EMAIL_DOMAIN}`);
}

/** 出品カテゴリ(教科書 / ゲーム) */
export const CATEGORIES = [
  { value: "textbook", label: "教科書" },
  { value: "game", label: "ゲーム" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

export const CATEGORY_LABEL: Record<CategoryValue, string> = {
  textbook: "教科書",
  game: "ゲーム",
};

/** 出品ステータス */
export const ITEM_STATUS = {
  available: "販売中",
  sold: "取引完了",
} as const;

export type ItemStatus = keyof typeof ITEM_STATUS;

/** 画像アップロード先のストレージバケット名 */
export const ITEM_IMAGE_BUCKET = "item-images";

/** チャット内に常時表示する安全な取引ガイドライン */
export const SAFETY_GUIDELINE =
  "【安全な取引のためのガイドライン】トラブル防止のため、取引は必ず第一学生食堂前や図書館ラウンジなど、日中の学内の開かれた場所で行ってください。密室での取引は禁止です。";

/** フッターに表示する非公式サービスの免責事項 */
export const SERVICE_DISCLAIMER =
  "本サービスは新潟大学非公式の、学生有志による個人運営サービスです。新潟大学教務課および大学当局とは一切関係ありません。";
