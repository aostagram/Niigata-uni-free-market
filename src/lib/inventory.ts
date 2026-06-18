import "server-only";
import { ADMIN_SHEET_ID, INVENTORY_SHEET_GID } from "@/lib/links";

/**
 * ガタフィー在庫マスター。管理スプレッドシートの「売り手回答」タブ
 * （gid=INVENTORY_SHEET_GID）を在庫一覧としてサイトに表示する。
 *
 * 読み取る列（見出しの一部一致で検出。個人情報列＝メール等は読み込まない）:
 *   在庫ID / 商品名(「商品名」を含む) / 希望価格(「価格」を含む) /
 *   商品の状態(「商品の状態」を含み「画像」を含まない) / 説明 /
 *   商品画像(「画像」を含む列のうち最初に値があるもの) / ステータス
 *
 * スプレッドシートは「リンクを知っている全員（閲覧者）」で共有しておくこと。
 * 別タブ/別URLにしたいときは環境変数 INVENTORY_CSV_URL で上書き可能。
 */
const INVENTORY_CSV_URL =
  process.env.INVENTORY_CSV_URL ??
  `https://docs.google.com/spreadsheets/d/${ADMIN_SHEET_ID}/gviz/tq?tqx=out:csv&gid=${INVENTORY_SHEET_GID}`;

export type InventoryItem = {
  stockId: string;
  title: string;
  price: string;
  condition: string;
  description: string;
  /** 1枚目の画像（カード表示用）。無ければ空文字。 */
  imageUrl: string;
  /** 全画像（詳細ページのギャラリー用、1〜3枚） */
  images: string[];
  reserved: boolean;
  /** 取引完了（売却済）。一覧では除外、詳細では「取引完了」表示に使う。 */
  sold: boolean;
};

/**
 * Google ドライブの共有リンクを、サイトの画像プロキシ経由URLへ変換する。
 * 例: https://drive.google.com/open?id=ABC → /api/drive-image?id=ABC
 * （プロキシがサーバー側で取得して表示。ファイルが「リンクを知っている全員:
 *   閲覧者」で公開されている必要がある。非公開だとプレースホルダーになる。）
 * Drive 以外の直リンク画像URLはそのまま使う。
 */
function normalizeImageUrl(url: string): string {
  const u = url.trim();
  if (!u) return "";
  const m =
    u.match(/drive\.google\.com\/file\/d\/([^/]+)/) ?? u.match(/[?&]id=([^&]+)/);
  if (m) return `/api/drive-image?id=${m[1]}`;
  return u;
}

/** 最小限の CSV パーサ（引用符・改行入りセル・""エスケープ対応）。 */
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

const SOLD = /(売却|売り切れ|売切|取引完了|完了|終了|sold)/i;

/** 全在庫を取得（売却済も sold=true で含む）。失敗時は空配列。 */
async function fetchAllItems(): Promise<InventoryItem[]> {
  try {
    const res = await fetch(INVENTORY_CSV_URL, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const rows = parseCsv(await res.text());
    if (rows.length < 2) return [];

    const header = rows[0].map((h) => h.trim());
    const find = (pred: (h: string) => boolean) => header.findIndex(pred);
    const ci = {
      stockId: find((h) => h === "在庫ID"),
      title: find((h) => h.includes("商品名")),
      price: find((h) => h.includes("価格")),
      condition: find((h) => h.includes("商品の状態") && !h.includes("画像")),
      description: find((h) => h === "説明"),
      status: find((h) => h.includes("ステータス")),
    };
    const imageCols = header
      .map((h, i) => (h.includes("画像") ? i : -1))
      .filter((i) => i >= 0);
    if (ci.stockId < 0 || ci.title < 0) return [];

    const get = (r: string[], i: number) => (i >= 0 ? (r[i] ?? "").trim() : "");

    return rows
      .slice(1)
      .map((r) => {
        const status = get(r, ci.status);
        const images = imageCols
          .map((i) => get(r, i))
          .filter((v) => v.length > 0)
          .map(normalizeImageUrl);
        return {
          stockId: get(r, ci.stockId),
          title: get(r, ci.title),
          price: get(r, ci.price),
          condition: get(r, ci.condition),
          description: get(r, ci.description),
          imageUrl: images[0] ?? "",
          images,
          reserved: /予約/.test(status),
          sold: SOLD.test(status),
        };
      })
      .filter((it) => it.stockId && it.title);
  } catch {
    return [];
  }
}

/** 在庫一覧（販売中のみ。売却済は除外、予約済は表示）。 */
export async function fetchInventory(): Promise<InventoryItem[]> {
  return (await fetchAllItems()).filter((it) => !it.sold);
}

/** 在庫番号から1件取得（詳細ページ用。売却済も返す→「取引完了」表示用）。 */
export async function fetchInventoryItem(
  stockId: string,
): Promise<InventoryItem | null> {
  return (await fetchAllItems()).find((it) => it.stockId === stockId) ?? null;
}

/** 価格表示（数値なら¥整形、0/無料はそのまま、その他は原文）。 */
export function formatStockPrice(price: string): string {
  const n = Number(price.replace(/[¥,\s]/g, ""));
  if (price.includes("無料") || n === 0) return "無料でゆずる";
  if (Number.isFinite(n) && n > 0) return `¥${n.toLocaleString("ja-JP")}`;
  return price || "—";
}
