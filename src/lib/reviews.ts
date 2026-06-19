import "server-only";
import { ADMIN_SHEET_ID, REVIEW_SHEET_GIDS } from "@/lib/links";
import { fetchStockSellerMap } from "@/lib/inventory";

/**
 * 取引完了（レビュー）集計。管理スプレッドシートの「完了_購入者」「完了_出品者」
 * 両タブの D列「感想（5段階評価）」(1〜5) を読み、各レビューを在庫ID経由で
 * 出品者gmail に紐付けて、出品者ごとのレビュー平均・件数を出す。
 */
export type SellerReview = { average: number; count: number };

const csvUrl = (gid: string) =>
  `https://docs.google.com/spreadsheets/d/${ADMIN_SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`;

/** 最小 CSV パーサ（引用符・""エスケープ・改行入りセル対応）。 */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else q = false;
      } else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/** 1タブから [在庫ID, 評価(1〜5)] の組を取り出す。 */
async function fetchTabRatings(gid: string): Promise<Array<[string, number]>> {
  try {
    const res = await fetch(csvUrl(gid), { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const rows = parseCsv(await res.text());
    if (rows.length < 2) return [];
    const header = rows[0].map((h) => h.trim());
    let stockCol = header.findIndex((h) => h.includes("在庫ID"));
    let ratingCol = header.findIndex(
      (h) => h.includes("段階評価") || h.includes("感想"),
    );
    // 見出しで取れない場合は既定の列位置（C=在庫ID, D=評価）にフォールバック。
    if (stockCol < 0) stockCol = 2;
    if (ratingCol < 0) ratingCol = 3;
    const out: Array<[string, number]> = [];
    for (const r of rows.slice(1)) {
      const stockId = (r[stockCol] ?? "").trim();
      const n = Number((r[ratingCol] ?? "").replace(/[^0-9.]/g, ""));
      if (stockId && Number.isFinite(n) && n >= 1 && n <= 5) {
        out.push([stockId, n]);
      }
    }
    return out;
  } catch {
    return [];
  }
}

/** 出品者gmail → {合計点, 件数} の集計表を作る。 */
async function aggregate(): Promise<Map<string, { sum: number; count: number }>> {
  const [sellerMap, buyerR, sellerR] = await Promise.all([
    fetchStockSellerMap(),
    fetchTabRatings(REVIEW_SHEET_GIDS.buyer),
    fetchTabRatings(REVIEW_SHEET_GIDS.seller),
  ]);
  const acc = new Map<string, { sum: number; count: number }>();
  for (const [stockId, rating] of [...buyerR, ...sellerR]) {
    const email = sellerMap.get(stockId);
    if (!email) continue;
    const cur = acc.get(email) ?? { sum: 0, count: 0 };
    cur.sum += rating;
    cur.count += 1;
    acc.set(email, cur);
  }
  return acc;
}

/** ある出品者(gmail)のレビュー平均・件数。レビュー無しは average=0, count=0。 */
export async function fetchSellerReview(email: string): Promise<SellerReview> {
  const e = (email ?? "").trim().toLowerCase();
  if (!e) return { average: 0, count: 0 };
  const acc = await aggregate();
  const r = acc.get(e);
  if (!r || r.count === 0) return { average: 0, count: 0 };
  return { average: r.sum / r.count, count: r.count };
}
