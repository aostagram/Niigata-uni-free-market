/**
 * 新潟大学生限定にするための、許可するメールドメイン。
 * Google OAuth でログイン後、このドメインで終わるメールアドレスのみを許可する。
 */
export const ALLOWED_EMAIL_DOMAIN = "mail.cc.niigata-u.ac.jp";

/**
 * 利用規約・プライバシーポリシーの版。本文（src/lib/legal.ts）を実質的に
 * 変更したら更新する。ログイン時の同意記録(user_consents)に保存され、
 * 「いつ・どの版に同意したか」の証跡になる。
 */
export const CONSENT_VERSION = "2026-06-17";

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
  "【安全な取引のためのガイドライン】ガタフィーは個人間取引をサポートするための掲示板です。受け渡し場所は大学が指定・提供するものではなく、利用者ご自身で自由にお選びいただきます。トラブル防止のため、取引は日中の人目のある開かれた場所で行い、具体的な日時・場所は当事者どうしで相談して決めてください。密室での取引は禁止です。";

/**
 * 実験運用中の案内。教科書以外のカテゴリは公開前のため、タップ時に表示する。
 */
export const EXPERIMENT_CATEGORY_NOTICE =
  "ガタフィーは、実装して間もないため、現在は教科書のみの取引に限定しています。他のカテゴリは順次公開予定です。";

/** フッターに表示する非公式サービスの免責事項 */
export const SERVICE_DISCLAIMER =
  "本サービスは新潟大学非公式の、学生有志による個人運営サービスです。新潟大学教務課および大学当局とは一切関係ありません。ガタフィーは利用料・手数料・仲介料を一切いただかない無料の掲示板で、運営が取引の金銭を預かったり決済を仲介することはありません（アプリ内決済なし）。学生どうしの安全な個人間取引をサポートすることのみを目的としています。受け渡し場所は大学が指定・提供するものではなく、利用者ご自身が自由に選びます。";
