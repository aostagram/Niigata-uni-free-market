import Link from "next/link";
import {
  Sprout,
  Search,
  Plus,
  MapPin,
  ShieldCheck,
  Truck,
  MessageSquare,
  Handshake,
  LayoutGrid,
  BookOpen,
  Gamepad2,
  Laptop,
  Armchair,
  Shirt,
  Volleyball,
  HelpCircle,
  ChevronDown,
  LogIn,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ItemCard } from "@/components/ItemCard";
import { CATEGORIES } from "@/lib/constants";
import type { ItemWithSeller } from "@/lib/types";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("items")
    .select("*, seller:profiles!items_user_id_fkey(id, full_name, avatar_url)")
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(60);

  if (category === "textbook" || category === "game")
    query = query.eq("category", category);
  if (q) query = query.ilike("title", `%${q}%`);

  const { data, error } = await query;
  const items = (data ?? []) as unknown as ItemWithSeller[];

  const heading = q
    ? `「${q}」の検索結果`
    : category === "textbook"
      ? "教科書の出品"
      : category === "game"
        ? "ゲームの出品"
        : "新着の商品";

  return (
    <div>
      {/* ===== ヒーロー ===== */}
      <section className="fade-up -mx-4 mb-2 grid items-center gap-8 px-4 py-6 sm:grid-cols-2 sm:py-10">
        <div>
          <span className="tag mb-4">
            <Sprout size={14} />
            新潟大学の学生限定マーケット
          </span>
          <h1 className="font-round text-3xl font-bold leading-[1.35] text-ink sm:text-4xl">
            新大生の「欲しい」が
            <br />
            <span className="text-brand-deep">きっと見つかる。</span>
          </h1>
          <p className="mt-4 text-[15px] leading-[1.9] text-ink-soft">
            教科書も、家具も、家電も。学内の仲間どうしで、安心してゆずり合い。キャンパスで手渡しできるから、送料もかかりません。
          </p>

          {/* 検索(実機能) */}
          <form action="/" className="mt-6">
            <div
              className="flex items-center gap-2.5 rounded-full border border-line bg-white px-5 py-3.5"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <Search size={20} className="shrink-0 text-brand" />
              <input
                type="search"
                name="q"
                defaultValue={q ?? ""}
                placeholder="何をお探しですか？（例：教科書、椅子、パソコン）"
                className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint"
              />
            </div>
            {category && (
              <input type="hidden" name="category" value={category} />
            )}
          </form>

          <div className="mt-5 flex gap-3">
            <Link href="#listings" className="btn btn-primary px-7 py-3.5 text-[15px]">
              <Search size={18} />
              商品を探す
            </Link>
            <Link href="/items/new" className="btn btn-ghost px-6 py-3.5 text-[15px]">
              <Plus size={18} />
              出品する
            </Link>
          </div>
        </div>

        {/* ヒーロービジュアル */}
        <div className="relative hidden sm:block">
          <div className="ds-card p-3.5" style={{ transform: "rotate(-1.5deg)" }}>
            <div className="overflow-hidden rounded-[14px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/campus.png"
                alt="新潟大学キャンパス"
                className="block w-full"
              />
            </div>
            <div className="flex items-center gap-2 px-1.5 pb-1 pt-3">
              <MapPin size={16} className="text-brand" />
              <span className="text-[13.5px] text-ink-soft">
                五十嵐キャンパス・旭町キャンパスで受け渡し
              </span>
            </div>
          </div>
          {/* 浮遊チップ */}
          <div className="ds-card absolute -bottom-4 -left-5 flex items-center gap-2.5 bg-white px-4 py-3">
            <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-panel">
              <ShieldCheck size={20} className="text-brand-deep" />
            </span>
            <span className="leading-tight">
              <span className="block text-xs text-ink-faint">学生認証</span>
              <span className="font-round block text-sm font-bold text-brand-deep">
                安心の本人確認
              </span>
            </span>
          </div>
          <div className="ds-card absolute -right-3 -top-3 flex items-center gap-2 whitespace-nowrap bg-white px-3.5 py-2.5">
            <Truck size={18} className="text-brand" />
            <span className="font-round text-[13px] font-bold text-ink">
              送料0円
            </span>
          </div>
        </div>
      </section>

      {/* ===== カテゴリから探す ===== */}
      <section className="mb-9 mt-4">
        <SectionTitle>カテゴリから探す</SectionTitle>
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-7">
          {CATEGORY_TILES.map((t) => (
            <CategoryTile key={t.label} tile={t} active={t.value === category} />
          ))}
        </div>
      </section>

      {/* ===== 取引の流れ（3ステップ） ===== */}
      <section className="mb-9">
        <SectionTitle>取引の流れ（3ステップ）</SectionTitle>
        <div className="ds-panel mt-4 grid gap-3 p-6 sm:grid-cols-3 sm:gap-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="flex items-start gap-3">
              <span className="font-round flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gradient-to-br from-brand-grad-from to-brand-grad-to text-sm font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-round flex items-center gap-1.5 text-[15px] font-bold text-brand-deep">
                  <s.icon size={17} className="text-brand" />
                  {s.title}
                </p>
                <p className="mt-1 text-[13px] leading-[1.7] text-ink-soft">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 機能フィルタ ===== */}
      <div className="mb-7 flex flex-wrap gap-2">
        <CategoryChip label="すべて" href="/" active={!category} />
        {CATEGORIES.map((c) => (
          <CategoryChip
            key={c.value}
            label={c.label}
            href={`/?category=${c.value}`}
            active={category === c.value}
          />
        ))}
      </div>

      {/* ===== 一覧 ===== */}
      <section id="listings" className="scroll-mt-20">
        <div className="mb-4 flex items-end justify-between">
          <SectionTitle>{heading}</SectionTitle>
        </div>

        {error && (
          <div className="ds-panel px-4 py-3 text-sm text-ink-soft">
            出品の読み込みに失敗しました。Supabase
            の設定（環境変数・スキーマ）をご確認ください。
          </div>
        )}

        {!error && items.length === 0 && (
          <div className="ds-card border-dashed py-16 text-center">
            <p className="text-ink-soft">まだ出品がありません。</p>
            <Link
              href="/items/new"
              className="btn btn-primary mt-4 inline-flex px-5 py-2.5 text-sm"
            >
              <Plus size={16} />
              最初の出品をする
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* ===== キャンパスで探す ===== */}
      <section className="mt-10">
        <div className="ds-panel grid items-center gap-5 p-6 sm:grid-cols-2 sm:p-7">
          <div>
            <SectionTitle deep>キャンパスで探す</SectionTitle>
            <p className="mt-2.5 text-sm leading-[1.8] text-ink-soft">
              受け渡ししやすいキャンパスから商品を絞り込めます。
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {["五十嵐キャンパス", "旭町キャンパス"].map((c) => (
                <Link
                  key={c}
                  href="/"
                  className="btn btn-ghost px-4 py-2.5 text-sm"
                >
                  <MapPin size={15} />
                  {c}
                </Link>
              ))}
            </div>
          </div>
          <div
            className="overflow-hidden rounded-[14px]"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/campus.png" alt="キャンパス" className="block w-full" />
          </div>
        </div>
      </section>

      {/* ===== 安心・安全バナー ===== */}
      <section className="mt-7">
        <div className="ds-panel relative flex items-center gap-5 overflow-hidden p-6 sm:p-7">
          <div className="flex-1">
            <SectionTitle deep>安心・安全にご利用いただくために</SectionTitle>
            <p className="mt-2 text-[13.5px] leading-[1.8] text-ink-soft">
              新大フリマは、新潟大学の学生のみが利用できる学内限定のフリマアプリです。安全で気持ちのよい取引のために、ルールを守ってご利用ください。
            </p>
          </div>
          <ShieldCheck
            size={96}
            strokeWidth={1}
            className="hidden shrink-0 text-[#cdddb0] sm:block"
          />
        </div>
      </section>

      {/* ===== はじめての方へ ===== */}
      <section id="getting-started" className="mt-12 scroll-mt-20">
        <SectionTitle deep>はじめての方へ</SectionTitle>
        <p className="mt-2.5 text-sm leading-[1.8] text-ink-soft">
          新大フリマは、新潟大学の学生だけが使える学内限定のフリマアプリです。大学のGoogleアカウントでログインするだけで、すぐに使いはじめられます。
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {GETTING_STARTED.map((g, i) => (
            <div key={g.title} className="ds-card p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-panel">
                <g.icon size={20} className="text-brand-deep" />
              </span>
              <p className="font-round mt-3 flex items-center gap-2 text-[15px] font-bold text-ink">
                <span className="text-brand">{i + 1}.</span>
                {g.title}
              </p>
              <p className="mt-1.5 text-[13px] leading-[1.7] text-ink-soft">
                {g.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ガイド(安全に使うために) ===== */}
      <section id="guide" className="mt-10 scroll-mt-20">
        <SectionTitle deep>ガイド（安全に使うために）</SectionTitle>
        <div className="ds-panel mt-4 grid gap-x-6 gap-y-3.5 p-6 sm:grid-cols-2">
          {GUIDE.map((g) => (
            <div key={g} className="flex items-start gap-2.5">
              <Sparkles size={16} className="mt-0.5 flex-none text-brand" />
              <p className="text-[13.5px] leading-[1.7] text-ink-soft">{g}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== よくある質問 ===== */}
      <section id="faq" className="mt-10 scroll-mt-20">
        <SectionTitle deep>よくある質問</SectionTitle>
        <div className="mt-4 space-y-2.5">
          {FAQ.map((f) => (
            <details key={f.q} className="ds-card group px-5 py-4">
              <summary className="font-round flex cursor-pointer list-none items-center gap-2.5 text-[14.5px] font-bold text-ink [&::-webkit-details-marker]:hidden">
                <HelpCircle size={18} className="flex-none text-brand" />
                <span className="flex-1">{f.q}</span>
                <ChevronDown
                  size={18}
                  className="flex-none text-ink-faint transition group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 pl-7 text-[13.5px] leading-[1.85] text-ink-soft">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------- 見出し ---------- */
function SectionTitle({
  children,
  deep,
}: {
  children: React.ReactNode;
  deep?: boolean;
}) {
  return (
    <h2
      className={`heading-row font-round text-lg font-bold ${
        deep ? "text-brand-deep" : "text-ink"
      }`}
    >
      <Sprout size={18} className="text-brand" />
      {children}
    </h2>
  );
}

/* ---------- 機能フィルタ用チップ ---------- */
function CategoryChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`font-round whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition ${
        active
          ? "border-transparent bg-gradient-to-br from-brand-grad-from to-brand-grad-to text-white shadow-sm"
          : "border-line bg-white text-ink-soft hover:border-brand"
      }`}
    >
      {label}
    </Link>
  );
}

/* ---------- 取引の流れ ---------- */
const STEPS = [
  {
    icon: Search,
    title: "さがす",
    desc: "カテゴリやキーワードから、欲しい商品を見つけます。",
  },
  {
    icon: MessageSquare,
    title: "チャットでやりとり",
    desc: "出品者にアプリ内チャットで連絡。受け渡し場所と日時を相談。",
  },
  {
    icon: Handshake,
    title: "キャンパスで受け渡し",
    desc: "学内の安全な場所で手渡し。送料はかかりません。",
  },
] as const;

/* ---------- はじめての方へ ---------- */
const GETTING_STARTED = [
  {
    icon: LogIn,
    title: "大学アカウントでログイン",
    desc: "新潟大学のGoogleアカウント（@mail.cc.niigata-u.ac.jp）でログイン。学生だけが使えます。",
  },
  {
    icon: Search,
    title: "ほしいものを探す",
    desc: "カテゴリやキーワードで検索。気になる商品が見つかったら詳細を確認しましょう。",
  },
  {
    icon: Handshake,
    title: "チャットして受け渡し",
    desc: "出品者とアプリ内チャットで連絡し、学内の安全な場所で手渡し。送料はかかりません。",
  },
] as const;

/* ---------- ガイド ---------- */
const GUIDE = [
  "受け渡しは、第一学生食堂前や図書館ラウンジなど、日中の人目のある学内の場所で行いましょう。",
  "中古品は、状態・使用感・付属品の有無を写真と説明でよく確認してから取引しましょう。",
  "個人情報の入った機器（PC・スマホ等）は、受け渡し前にデータを必ず消去してください。",
  "転売目的・営利目的での反復出品や、禁止商品の出品はできません。",
  "不審な出品やトラブルを見つけたら、無理せず取引を中止し、運営に連絡してください。",
  "教職員・学外者は利用できません。アカウントの貸与もしないでください。",
] as const;

/* ---------- よくある質問 ---------- */
const FAQ = [
  {
    q: "誰でも使えますか？",
    a: "新潟大学に在籍する学生限定です。大学発行のGoogleアカウント（@mail.cc.niigata-u.ac.jp）でログインできる方のみご利用いただけます。教職員・学外者・卒業生はご利用いただけません。",
  },
  {
    q: "送料はかかりますか？",
    a: "かかりません。本サービスは学内での対面手渡しを前提としています。五十嵐キャンパス・旭町キャンパスなど、受け渡ししやすい場所で直接やりとりします。",
  },
  {
    q: "支払いはどうやって行いますか？",
    a: "代金の支払い方法は利用者どうしで相談して決めます。運営は代金を預かったり決済を仲介したりしません。受け渡しと支払いは、対面で同時に行うことをおすすめします。",
  },
  {
    q: "出品できないものはありますか？",
    a: "盗品・偽造品、酒類・たばこ、医薬品、危険物、チケットや金券、個人情報を含むものなどは出品できません。詳しくは利用規約の「禁止商品」をご確認ください。",
  },
  {
    q: "トラブルがあったときは？",
    a: "まずは無理に取引を進めず中止してください。そのうえで運営にご連絡ください。受け渡しは必ず日中の人目のある学内の場所で行い、密室での取引は避けてください。",
  },
] as const;

/* ---------- カテゴリ丸タイル ---------- */
type Tile = { label: string; value?: "textbook" | "game"; icon: LucideIcon };

const CATEGORY_TILES: Tile[] = [
  { label: "すべて", icon: LayoutGrid },
  { label: "本・教科書", value: "textbook", icon: BookOpen },
  { label: "ゲーム", value: "game", icon: Gamepad2 },
  { label: "パソコン・家電", icon: Laptop },
  { label: "家具・インテリア", icon: Armchair },
  { label: "ファッション", icon: Shirt },
  { label: "スポーツ・趣味", icon: Volleyball },
];

function CategoryTile({ tile, active }: { tile: Tile; active?: boolean }) {
  const Icon = tile.icon;
  const isAll = tile.label === "すべて";
  const href = isAll ? "/" : tile.value ? `/?category=${tile.value}` : undefined;
  const enabled = isAll || !!tile.value;

  const circle = (
    <span
      className={`flex aspect-square w-full items-center justify-center rounded-2xl border transition ${
        active
          ? "border-brand bg-panel"
          : "border-line bg-white group-hover:border-brand"
      } ${enabled ? "" : "opacity-50"}`}
    >
      <Icon
        size={26}
        strokeWidth={1.7}
        className={active ? "text-brand-deep" : "text-brand-deep"}
      />
    </span>
  );

  const caption = (
    <span className="mt-2 text-center text-[11px] leading-tight text-ink-soft">
      {tile.label}
      {!enabled && <span className="block text-[9px] text-ink-faint">準備中</span>}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="group flex flex-col items-center">
        {circle}
        {caption}
      </Link>
    );
  }
  return (
    <div
      aria-disabled
      title="準備中"
      className="group flex cursor-default flex-col items-center"
    >
      {circle}
      {caption}
    </div>
  );
}
