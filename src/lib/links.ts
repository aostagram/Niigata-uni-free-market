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
export const ADMIN_SHEET_ID = "1raQMxjZ3HGdq0f-CBxsNw1Q27bviHkpxU4SNoxa7bgY";
export const ADMIN_SHEET_URL = `https://docs.google.com/spreadsheets/d/${ADMIN_SHEET_ID}/edit`;
/** 在庫マスターとして読む売り手回答タブの gid */
export const INVENTORY_SHEET_GID = "989667529";

/**
 * 取引完了（レビュー）タブの gid。両タブとも
 *   A:タイムスタンプ / B:学内gmail / C:在庫ID / D:感想(1〜5の5段階評価)
 * の列構成。在庫ID→出品者gmail で出品者のレビュー平均を集計する。
 */
export const REVIEW_SHEET_GIDS = {
  buyer: "1779151945", // 完了_購入者（購入者が評価）
  seller: "1634127472", // 完了_出品者（出品者が評価）
} as const;

/** ガタフィー公式 Gmail（通知メールの送信元） */
export const OFFICIAL_EMAIL = "gatafeefurima@gmail.com";

/**
 * 各 Google フォームの質問 entry ID（プリフィル用）。
 * これでログイン済みユーザーは在庫ID・名前・メールを再入力せずに済む。
 */
const ENTRY = {
  buyerStockId: "993746720", // 買い手: 在庫ID
  buyerName: "1973014775", // 買い手: お名前
  completeBuyerStockId: "1703566125", // 完了(購入者): 在庫ID
  completeBuyerEmail: "1978590103", // 完了(購入者): 学内gmail
  completeSellerStockId: "96801657", // 完了(売り手): 在庫ID
  completeSellerEmail: "1242642281", // 完了(売り手): 学内gmail
} as const;

function withParams(base: string, params: Record<string, string | undefined>) {
  const usp = new URLSearchParams({ usp: "pp_url" });
  for (const [k, v] of Object.entries(params)) {
    if (v) usp.set(k, v);
  }
  return `${base}?${usp.toString()}`;
}

/** 購入・問い合わせフォーム（在庫ID・名前・メールを自動入力） */
export function buyerInquiryUrl(opts: {
  stockId?: string;
  name?: string;
  email?: string;
}): string {
  return withParams(FORMS.buyerInquiry, {
    [`entry.${ENTRY.buyerStockId}`]: opts.stockId,
    [`entry.${ENTRY.buyerName}`]: opts.name,
    emailAddress: opts.email, // 自動メール収集フォーム向け
  });
}

/** 取引完了（購入者）フォーム（在庫ID・メールを自動入力） */
export function completeBuyerUrl(opts: {
  stockId?: string;
  email?: string;
}): string {
  return withParams(FORMS.completeBuyer, {
    [`entry.${ENTRY.completeBuyerStockId}`]: opts.stockId,
    [`entry.${ENTRY.completeBuyerEmail}`]: opts.email,
  });
}

/** 取引完了（売り手）フォーム（在庫ID・メールを自動入力） */
export function completeSellerUrl(opts: {
  stockId?: string;
  email?: string;
}): string {
  return withParams(FORMS.completeSeller, {
    [`entry.${ENTRY.completeSellerStockId}`]: opts.stockId,
    [`entry.${ENTRY.completeSellerEmail}`]: opts.email,
  });
}
