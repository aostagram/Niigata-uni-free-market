/**
 * ガタフィー「裏側」運用リンク集。
 * 出品・購入・取引完了は Google フォームで受け付け、回答は管理用
 * スプレッドシートに集約してオーナーが直接管理する。
 * URL を変えるときはここだけ直せばサイト全体に反映される。
 */
export const FORMS = {
  /** 売り手専用回答（出品の申込） */
  sellerListing:
    "https://docs.google.com/forms/d/e/1FAIpQLScYDNmMtkbsa7-_AXUM2YYeCEsv2PKWHvp3uxKYjuyFcARYag/viewform",
  /** 買い手専用回答（購入・お問い合わせ） */
  buyerInquiry:
    "https://docs.google.com/forms/d/e/1FAIpQLSfMFlXD-B9aXB3QDq7HK_pfkFrwRBGdqVLn0MROKpnKm2AtTA/viewform",
  /** 取引完了（売り手から報告） */
  completeSeller: "https://forms.gle/sy2DU1ZaCvJWQQJb6",
  /** 取引完了（購入者から報告） */
  completeBuyer:
    "https://docs.google.com/forms/d/e/1FAIpQLSc9PQKQ67HaV1B4d4nLliJy7JpH7B6ib19VoZ_J_LvymQoWhw/viewform",
} as const;

/** 管理用スプレッドシート（UI 非公開・運営の裏側） */
export const ADMIN_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1raQMxjZ3HGdq0f-CBxsNw1Q27bviHkpxU4SNoxa7bgY/edit";

/** ガタフィー公式 Gmail（通知メールの送信元） */
export const OFFICIAL_EMAIL = "gatafeefurima@gmail.com";
