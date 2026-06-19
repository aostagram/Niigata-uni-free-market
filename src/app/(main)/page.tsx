import Link from "next/link";
import { CaseGallery } from "@/components/CaseGallery";
import { FORMS, buyerInquiryUrl } from "@/lib/links";
import { fetchInventory, formatStockPrice } from "@/lib/inventory";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

/** ガタフィー LP（vercel.app トップ）を src/ に完全再現したホーム。 */
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  await searchParams;

  // 管理スプレッドシートの在庫タブから商品一覧を取得（在庫番号付き）。
  const inventory = await fetchInventory();

  // ログイン中ならフォーム自動入力用の名前・メールを取得（未ログインでも動く）。
  const user = await getCurrentUser();
  let buyerName: string | undefined;
  let buyerEmail: string | undefined;
  if (user) {
    const supabase = await createClient();
    const { data: prof } = await supabase
      .from("profiles")
      .select("nickname, full_name, email")
      .eq("id", user.id)
      .single();
    buyerName = prof?.nickname ?? prof?.full_name ?? undefined;
    buyerEmail = prof?.email ?? user.email ?? undefined;
  }

  return (
    <div className="lp-home">
      {/* ===== ヒーロー ===== */}
      <section className="hero">
        <div className="hero-content">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hero-logo" src="/brand/logo.png" alt="ガタフィー" />
          <p className="eyebrow">新潟大学の学生限定マーケット</p>
          <h1>
            新大生だけの、
            <br />
            安心して、すぐ手に入るフリマ。
          </h1>
          <p className="hero-copy">
            教科書も、家具も、生活用品も。新潟大学の仲間どうしで、学内の明るい場所を選んで手渡しできます。
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="#listings">
              商品を探す
            </Link>
            <a
              className="btn btn-outline"
              href={FORMS.sellerListing}
              target="_blank"
              rel="noopener noreferrer"
            >
              出品を始める
            </a>
          </div>
          <div className="hero-badges" aria-label="サービスの特徴">
            <span className="badge">学生限定</span>
            <span className="badge">大学メール認証</span>
            <span className="badge">学内手渡し</span>
            <span className="badge">アプリ内決済なし</span>
          </div>
        </div>
      </section>

      {/* ===== 新着商品（実データ） ===== */}
      <section className="section" id="listings">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">新着商品</p>
              <h2>新生活にちょうどいいものを、学内で。</h2>
              <p className="lead">
                購入・取引完了フォームには、各商品の
                <b>「在庫番号」</b>を入力してください。
              </p>
            </div>
            <a
              className="btn btn-outline"
              href={FORMS.sellerListing}
              target="_blank"
              rel="noopener noreferrer"
            >
              出品する
            </a>
          </div>
          <div className="products-layout">
            <div className="paint-card visual-fill">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/market-items.webp" alt="フリマ商品イメージ" />
            </div>
            <div className="product-grid">
              {inventory.length > 0
                ? inventory.map((it) => {
                    const detail = `/stock/${encodeURIComponent(it.stockId)}`;
                    return (
                      <article key={it.stockId} className="product-card">
                        <Link href={detail} aria-label={`${it.title} の詳細`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            className="product-thumb"
                            src={it.imageUrl || "/brand/no-image.svg"}
                            alt={it.title}
                          />
                        </Link>
                        <div className="card-body">
                          <div className="mb-1 flex flex-wrap items-center gap-1.5">
                            <span className="tag" style={{ background: "#eef6dd" }}>
                              在庫番号 {it.stockId}
                            </span>
                            {it.condition && (
                              <span className="tag">{it.condition}</span>
                            )}
                            {it.reserved && (
                              <span
                                className="tag"
                                style={{ background: "#fbeae6", color: "#c0563f" }}
                              >
                                予約済
                              </span>
                            )}
                          </div>
                          <Link href={detail}>
                            <h3>{it.title}</h3>
                          </Link>
                          <p className="product-price">
                            {formatStockPrice(it.price)}
                          </p>
                          {it.description && (
                            <p className="product-meta clamp-2">
                              {it.description}
                            </p>
                          )}
                          <Link
                            className="btn btn-ghost mt-3 w-full"
                            href={detail}
                          >
                            くわしく見る
                          </Link>
                          <a
                            className="btn btn-primary mt-2 w-full"
                            href={buyerInquiryUrl({
                              stockId: it.stockId,
                              name: buyerName,
                              email: buyerEmail,
                            })}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            購入する
                          </a>
                        </div>
                      </article>
                    );
                  })
                : SAMPLE_PRODUCTS.map((p) => (
                    <article key={p.title} className="product-card">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="product-thumb" src={p.img} alt={p.title} />
                      <div className="card-body">
                        <span className="tag">{p.tag}</span>
                        <h3>{p.title}</h3>
                        <p className="product-price">{p.price}</p>
                        <p className="product-meta">{p.meta}</p>
                        <a
                          className="btn btn-primary mt-3 w-full"
                          href={FORMS.buyerInquiry}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          購入する
                        </a>
                      </div>
                    </article>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 検索：キャンパス × カテゴリ ===== */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">新大生に便利な検索</p>
              <h2>キャンパスとカテゴリから、すぐ探せる。</h2>
              <p className="lead">
                実際の待ち合わせスポットを見ながら、安心して取引を始められます。
              </p>
            </div>
            <Link className="btn btn-outline" href="#listings">
              新着を見る
            </Link>
          </div>
          <div className="grid-2">
            <article className="paint-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="paint-img"
                src="/brand/library.webp"
                alt="新潟大学附属図書館前"
              />
              <div className="card-body">
                <span className="tag">五十嵐キャンパス</span>
                <h3>附属図書館前</h3>
                <p className="lead">
                  人目があり、落ち着いて待ち合わせしやすい入口まわり。
                </p>
              </div>
            </article>
            <article className="paint-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="paint-img"
                src="/brand/cafeteria.webp"
                alt="新潟大学第一食堂前"
              />
              <div className="card-body">
                <span className="tag">五十嵐キャンパス</span>
                <h3>第一食堂前</h3>
                <p className="lead">
                  広場があり、手渡し場所として相談しやすいスポット。
                </p>
              </div>
            </article>
          </div>
          <div className="category-grid" aria-label="カテゴリ一覧">
            {CATEGORY_TILES.map((c) => (
              <Link key={c.label} className="category-tile" href={c.href}>
                <span className="category-icon">{c.icon}</span>
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 新大生だから安心 ===== */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">新大生だから安心</p>
              <h2>決済は挟まず、学内の安全な場所で。</h2>
              <p className="lead">
                アプリはマッチングと連絡に徹し、お金と商品の受け渡しは当事者同士で行います。
              </p>
            </div>
          </div>
          <div className="trust-layout">
            <div className="trust-list">
              {TRUST.map((t) => (
                <article key={t.icon} className="paint-card trust-item">
                  <div className="trust-icon">{t.icon}</div>
                  <div>
                    <h3>{t.title}</h3>
                    <p className="lead">{t.desc}</p>
                  </div>
                </article>
              ))}
              <p className="guide-strip">
                安全な取引ガイド：明るく人目のある場所で取引する /
                夜遅い時間を避ける /
                金銭トラブルは当事者責任であることを明記する
              </p>
            </div>
            <div className="paint-card visual-fill">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/safety-trust.webp" alt="大学メール認証と安全な取引" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== 取引の流れ ===== */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">取引の流れ</p>
              <h2>探す、チャットする、学内で手渡し。</h2>
            </div>
          </div>
          <div
            className="flow-layout panel"
            style={{ padding: 28 }}
          >
            <div className="paint-card visual-fill">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/transaction-flow.webp" alt="取引の流れ" />
            </div>
            <div className="steps">
              {STEPS.map((s, i) => (
                <div key={s.title} className="step">
                  <div className="step-num">{i + 1}</div>
                  <div>
                    <h3>{s.title}</h3>
                    <p className="lead">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== お客様の声 ===== */}
      <section className="section" id="voices">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">お客様の声</p>
              <h2>新大生の声を、少しずつ集めています。</h2>
            </div>
          </div>
          <div className="grid-3">
            {VOICES.map((v) => (
              <article key={v.who} className="voice-card">
                <p>{v.body}</p>
                <div className="voice-meta">
                  <span>{v.who}</span>
                  <span>{v.what}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 取引事例ギャラリー ===== */}
      <section className="section" id="cases">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">取引事例ギャラリー</p>
              <h2>エリア・予算・テイストで絞り込めます。</h2>
            </div>
          </div>
          <CaseGallery />
        </div>
      </section>

      {/* ===== CTAバンド ===== */}
      <section className="section">
        <div className="container">
          <div className="cta-band">
            <div>
              <h2>新大生だけのフリマを、まずは無料で。</h2>
              <p>出品・検索・チャット・学内手渡しまで、シンプルに。</p>
            </div>
            <a
              className="btn"
              href={FORMS.sellerListing}
              target="_blank"
              rel="noopener noreferrer"
            >
              出品してみる
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- データ ---------- */
const CATEGORY_TILES = [
  { label: "教科書・参考書", icon: "本", href: "/?category=textbook" },
  { label: "家具・家電", icon: "椅", href: "#listings" },
  { label: "生活用品", icon: "器", href: "#listings" },
  { label: "自転車・スポーツ", icon: "輪", href: "#listings" },
  { label: "服・雑貨", icon: "衣", href: "#listings" },
  { label: "その他", icon: "他", href: "#listings" },
] as const;

const SAMPLE_PRODUCTS = [
  {
    img: "/brand/market-items.webp",
    tag: "本・教科書",
    title: "教科書（微分積分）",
    price: "¥1,200",
    meta: "附属図書館前で手渡し",
  },
  {
    img: "/brand/item-detail.webp",
    tag: "家具",
    title: "オフィスチェア",
    price: "¥2,000",
    meta: "第一食堂前で相談",
  },
  {
    img: "/brand/market-items.webp",
    tag: "生活用品",
    title: "生活雑貨セット",
    price: "¥600",
    meta: "当日手渡しOK",
  },
] as const;

const TRUST = [
  {
    icon: "認",
    title: "大学メールで本人確認",
    desc: "@mail.cc.niigata-u.ac.jp の学生だけが登録できます。",
  },
  {
    icon: "所",
    title: "学内の明るい場所で手渡し",
    desc: "附属図書館前や第一食堂前など、人目のある場所を選べます。",
  },
  {
    icon: "守",
    title: "ブロック・通報でトラブルを抑える",
    desc: "不安な相手や禁止商品に対応できる導線を用意します。",
  },
] as const;

const STEPS = [
  {
    title: "商品を探す",
    desc: "カテゴリやキーワードから欲しい商品を見つけます。",
  },
  {
    title: "チャットで相談",
    desc: "状態、価格、受け渡し場所をメッセージで確認します。",
  },
  {
    title: "学内で手渡し",
    desc: "人目のあるスポットで対面取引。アプリ内決済はありません。",
  },
] as const;

const VOICES = [
  {
    body: "教科書を学内で受け取れたので、送料も待ち時間もなく助かりました。",
    who: "教育学部 2年",
    what: "教科書購入",
  },
  {
    body: "引っ越し前に椅子を譲れました。チャットで場所を決められるのが安心でした。",
    who: "工学部 4年",
    what: "家具出品",
  },
  {
    body: "同じキャンパス内の人だけなので、初めてでも使いやすい雰囲気でした。",
    who: "人文学部 1年",
    what: "生活用品購入",
  },
] as const;
