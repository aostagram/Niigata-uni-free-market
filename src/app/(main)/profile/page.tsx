import Link from "next/link";
import {
  Sprout,
  CheckCircle2,
  Camera,
  LogOut,
  Home,
  MessageSquare,
  Plus,
  Bell,
} from "lucide-react";
import { requireProfile, getCurrentUser } from "@/lib/auth";
import { ProfileForm } from "@/components/ProfileForm";
import { StockCard } from "@/components/StockCard";
import { StarRating } from "@/components/StarRating";
import { signOut } from "@/app/actions/auth";
import { FORMS } from "@/lib/links";
import { fetchAllInventory, fetchSellerListingStats } from "@/lib/inventory";
import { fetchSellerReview } from "@/lib/reviews";
import { fetchFollowCounts } from "@/lib/follows";

export default async function ProfilePage() {
  const profile = await requireProfile();
  const user = await getCurrentUser();
  const email = (profile.email ?? user?.email ?? "").toLowerCase();

  // 出品（在庫スプレッドシートを出品者gmailで集計）・レビュー・フォローを並列取得。
  const [allInv, listing, review, follow] = await Promise.all([
    fetchAllInventory(),
    fetchSellerListingStats(email),
    fetchSellerReview(email),
    fetchFollowCounts(profile.id, email),
  ]);
  const myItems = allInv.filter((it) => it.sellerEmail === email && !it.sold);
  const quickMenu = [
    { icon: Home, label: "ホーム", href: "/", external: false },
    { icon: MessageSquare, label: "メッセージ", href: "/chat", external: false },
    {
      icon: Plus,
      label: "出品する",
      href: FORMS.sellerListing,
      external: true,
    },
    { icon: Bell, label: "通知", href: "/notifications", external: false },
  ];

  return (
    <div className="fade-up">
      {/* プロフィールカード */}
      <div className="ds-card p-6">
        <div className="heading-row mb-5">
          <Sprout size={18} className="text-brand" />
          <span className="font-round text-[15px] font-bold text-brand-deep">
            プロフィール
          </span>
        </div>
        <div className="flex items-center gap-5">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="h-[88px] w-[88px] flex-none rounded-full object-cover"
            />
          ) : (
            <span
              className="flex h-[88px] w-[88px] flex-none items-center justify-center rounded-full"
              style={{
                background: "radial-gradient(circle,#eef5dd,#d6e7b6)",
              }}
            >
              <Sprout size={42} className="text-brand-deep" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="font-round truncate text-2xl font-bold text-ink">
              {profile.nickname ?? profile.full_name}
            </h1>
            {(profile.faculty || profile.grade) && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {profile.faculty && <span className="tag">{profile.faculty}</span>}
                {profile.grade && <span className="tag">{profile.grade}</span>}
              </div>
            )}
            <p className="mt-1.5 truncate text-sm text-ink-soft">{user?.email}</p>
          </div>
          <form action={signOut} className="ml-auto self-start">
            <button type="submit" className="btn btn-ghost px-4 py-2.5 text-sm">
              <LogOut size={15} />
              ログアウト
            </button>
          </form>
        </div>

        <div className="ds-panel mt-5 flex flex-col gap-3.5 p-5 sm:flex-row sm:gap-8">
          {[
            ["学生認証済み", "新潟大学アカウントでログインしています"],
            ["大学メール認証済み", "新潟大学のメールアドレスで登録しています"],
          ].map(([title, desc]) => (
            <div key={title} className="flex gap-3">
              <CheckCircle2 size={24} className="shrink-0 text-brand" />
              <div>
                <p className="font-round text-sm font-bold text-brand-deep">
                  {title}
                </p>
                <p className="mt-0.5 text-xs leading-[1.5] text-ink-soft">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* プロフィール編集（ニックネーム・学年・学部） */}
      <details className="ds-card group mt-6 p-6">
        <summary className="font-round flex cursor-pointer list-none items-center gap-2.5 text-[15px] font-bold text-brand-deep [&::-webkit-details-marker]:hidden">
          <Sprout size={18} className="text-brand" />
          プロフィールを編集する
          <span className="ml-auto text-xs font-normal text-ink-faint transition group-open:rotate-180">
            ▼
          </span>
        </summary>
        <div className="mt-5">
          <ProfileForm
            defaultNickname={profile.nickname ?? ""}
            defaultGrade={profile.grade ?? ""}
            defaultFaculty={profile.faculty ?? ""}
            submitLabel="プロフィールを更新する"
          />
        </div>
      </details>

      {/* メルカリ風スタッツ（出品数・フォロワー・フォロー中・評価） */}
      <div className="ds-card mt-6 p-5">
        <div className="grid grid-cols-3 divide-x divide-line-soft text-center">
          <div className="px-2">
            <div className="font-round text-2xl font-bold text-ink">
              {listing.total}
            </div>
            <div className="text-[12px] text-ink-soft">出品</div>
          </div>
          <div className="px-2">
            <div className="font-round text-2xl font-bold text-ink">
              {follow.followers}
            </div>
            <div className="text-[12px] text-ink-soft">フォロワー</div>
          </div>
          <div className="px-2">
            <div className="font-round text-2xl font-bold text-ink">
              {follow.following}
            </div>
            <div className="text-[12px] text-ink-soft">フォロー中</div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-line-soft pt-4">
          <span className="text-[13px] text-ink-soft">評価</span>
          <StarRating average={review.average} count={review.count} />
          <span className="text-[12px] text-ink-faint">
            ・販売中 {listing.available}・取引完了 {listing.sold}
          </span>
        </div>
      </div>

      {/* クイックメニュー */}
      <div className="mt-4 grid grid-cols-4 gap-3">
        {quickMenu.map((m) => {
          const cls =
            "ds-card flex flex-col items-center gap-2 px-2 py-4 text-center transition hover:-translate-y-0.5";
          const inner = (
            <>
              <m.icon size={24} strokeWidth={1.8} className="text-brand" />
              <span className="font-round text-[12px] font-bold text-ink">
                {m.label}
              </span>
            </>
          );
          return m.external ? (
            <a
              key={m.label}
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cls}
            >
              {inner}
            </a>
          ) : (
            <Link key={m.label} href={m.href} className={cls}>
              {inner}
            </Link>
          );
        })}
      </div>

      {/* 出品中の商品（在庫スプレッドシートから、自分のgmailの出品） */}
      <div className="mt-6">
        <div className="heading-row mb-4">
          <Camera size={20} className="text-brand-deep" />
          <h2 className="font-round text-lg font-bold text-ink">
            出品中の商品
          </h2>
          <span className="tag ml-1">{myItems.length}件</span>
        </div>
        {myItems.length === 0 ? (
          <p className="ds-card border-dashed py-12 text-center text-sm text-ink-soft">
            まだ出品がありません。出品フォームから登録すると、ここと商品一覧に表示されます。
          </p>
        ) : (
          <div className="lp-home">
            <div className="product-grid">
              {myItems.map((it) => (
                <StockCard
                  key={it.stockId}
                  item={it}
                  buyerName={profile.nickname ?? undefined}
                  buyerEmail={email}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
