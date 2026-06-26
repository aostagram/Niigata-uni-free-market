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
  /** 商品カテゴリー（フォームの「商品のカテゴリー」列。無ければ空文字）。 */
  category: string;
  /** 出品者の学内gmail（出品数・レビュー紐付け用。UIには表示しない）。 */
  sellerEmail: string;
  /** 受け渡し場所（管理シート「受け渡し場所（仮）」列。無ければ空文字）。 */
  pickup: string;
  /** 1枚目の画像（カード表示用）。無ければ空文字。 */
  imageUrl: string;
  /** 全画像（詳細ページのギャラリー用、1〜3枚） */
  images: string[];
  reserved: boolean;
  /** 取引完了（売却済）。一覧では除外、詳細では「取引完了」表示に使う。 */
  sold: boolean;
  /** テスト・購入禁止などの非公開商品（一覧/詳細から除外）。 */
  hidden: boolean;
};

/** ホーム/一覧で使うカテゴリー定義（フォームの選択肢に対応）。 */
export const CATEGORIES = [
  { key: "textbook", label: "教科書・参考書", icon: "本" },
  { key: "appliance", label: "家具・家電", icon: "椅" },
  { key: "daily", label: "生活用品", icon: "器" },
  { key: "sports", label: "自転車・スポーツ", icon: "輪" },
  { key: "fashion", label: "服・雑貨", icon: "衣" },
  { key: "other", label: "その他", icon: "他" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

/** フォーム回答のカテゴリ文字列を内部キーに正規化（部分一致）。 */
export function categoryKeyFromText(text: string): CategoryKey {
  const t = (text ?? "").trim();
  if (/教科書|参考書|本/.test(t)) return "textbook";
  if (/家具|家電/.test(t)) return "appliance";
  if (/生活/.test(t)) return "daily";
  if (/自転車|スポーツ/.test(t)) return "sports";
  if (/服|雑貨|ファッション/.test(t)) return "fashion";
  return "other";
}

/** 内部キー→表示ラベル。 */
export function categoryLabel(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.label ?? "その他";
}

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

/**
 * テスト・ダミー・購入禁止などの「本番に出したくない出品」を判定する印。
 * 商品名・説明に含まれていれば一覧/詳細から除外する。価格「非売品」も除外。
 */
const HIDE = /削除予定|購入禁止|購入しないで|本物では|※本物|ダミー|テスト用|テストです|実機テスト|仮商品|仮テスト|仮の商品|仮のテスト|仮_/;

/** ステータス列にこの語があれば非表示（シート側で出品を取り下げる手段）。 */
const HIDE_STATUS = /非表示|取り下げ|取下げ|下書き|保留|削除/;

/**
 * キーワードに引っかからない単発の非公開商品を商品名で明示除外する。
 * 例: 運営テスト用の「歯はよく磨こう」。新しく隠したい商品名はここに追加。
 */
const HIDE_TITLES = new Set(["歯はよく磨こう"]);

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
      category: find((h) => h.includes("カテゴリ")),
      sellerEmail: find((h) => h.includes("出品者") && h.includes("gmail")),
      pickup: find((h) => h.includes("受け渡し") || h.includes("受渡")),
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
        const title = get(r, ci.title);
        const description = get(r, ci.description);
        const price = get(r, ci.price);
        const images = imageCols
          .map((i) => get(r, i))
          .filter((v) => v.length > 0)
          .map(normalizeImageUrl);
        return {
          stockId: get(r, ci.stockId),
          title,
          price,
          condition: get(r, ci.condition),
          description,
          category: categoryKeyFromText(get(r, ci.category)),
          sellerEmail: get(r, ci.sellerEmail).toLowerCase(),
          pickup: get(r, ci.pickup),
          imageUrl: images[0] ?? "",
          images,
          reserved: /予約/.test(status),
          sold: SOLD.test(status),
          hidden:
            HIDE.test(title) ||
            HIDE.test(description) ||
            /非売品/.test(price) ||
            HIDE_STATUS.test(status) ||
            HIDE_TITLES.has(title.trim()),
        };
      })
      .filter((it) => it.stockId && it.title);
  } catch {
    return [];
  }
}

/** 在庫一覧（販売中のみ。売却済・非公開は除外、予約済は表示）。 */
export async function fetchInventory(): Promise<InventoryItem[]> {
  return (await fetchAllItems()).filter((it) => !it.sold && !it.hidden);
}

/** 在庫番号から1件取得（詳細ページ用。売却済も返す→「取引完了」表示用。
 *  非公開（テスト/購入禁止）は直リンクでも出さない）。 */
export async function fetchInventoryItem(
  stockId: string,
): Promise<InventoryItem | null> {
  const id = stockId.trim();
  const matches = (await fetchAllItems()).filter((x) => x.stockId === id);
  // 同一在庫IDが複数行ある場合に備え、表示できる行（非公開でない）を優先する。
  const it = matches.find((m) => !m.hidden) ?? matches[0];
  return it && !it.hidden ? it : null;
}

/** 全在庫を取得（売却済も含む。出品数の集計用）。 */
export async function fetchAllInventory(): Promise<InventoryItem[]> {
  return fetchAllItems();
}

/** 在庫ID→出品者gmail の対応表（レビュー紐付け用）。 */
export async function fetchStockSellerMap(): Promise<Map<string, string>> {
  const all = await fetchAllItems();
  const m = new Map<string, string>();
  for (const it of all) {
    if (it.stockId && it.sellerEmail) m.set(it.stockId, it.sellerEmail);
  }
  return m;
}

/** ある出品者(gmail)の出品集計（販売中・取引完了・合計）。 */
export async function fetchSellerListingStats(
  email: string,
): Promise<{ total: number; available: number; sold: number }> {
  const e = (email ?? "").trim().toLowerCase();
  if (!e) return { total: 0, available: 0, sold: 0 };
  const mine = (await fetchAllItems()).filter((it) => it.sellerEmail === e);
  const sold = mine.filter((it) => it.sold).length;
  return { total: mine.length, available: mine.length - sold, sold };
}

/** 価格表示（数値なら¥整形、0/無料はそのまま、その他は原文）。 */
export function formatStockPrice(price: string): string {
  const n = Number(price.replace(/[¥,\s]/g, ""));
  if (price.includes("無料") || n === 0) return "無料でゆずる";
  if (Number.isFinite(n) && n > 0) return `¥${n.toLocaleString("ja-JP")}`;
  return price || "—";
}
