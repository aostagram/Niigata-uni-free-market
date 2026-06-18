import Link from "next/link";
import {
  Sprout,
  CheckCircle2,
  Camera,
  LogOut,
  Package,
  Tag,
  CircleCheck,
  Home,
  MessageSquare,
  Plus,
  Bell,
} from "lucide-react";
import { requireProfile, getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ItemCard } from "@/components/ItemCard";
import { ProfileForm } from "@/components/ProfileForm";
import { signOut } from "@/app/actions/auth";
import { FORMS } from "@/lib/links";
import type { ItemWithSeller } from "@/lib/types";

export default async function ProfilePage() {
  const profile = await requireProfile();
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data } = await supabase
    .from("items")
    .select("*, seller:profiles!items_user_id_fkey(id, full_name, avatar_url)")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  const items = (data ?? []) as unknown as ItemWithSeller[];

  // 実データから集計（ダミー値は使わない）
  const available = items.filter((i) => i.status === "available").length;
  const sold = items.filter((i) => i.status === "sold").length;
  const stats = [
    { icon: Package, label: "出品した商品", value: `${items.length}` },
    { icon: Tag, label: "販売中", value: `${available}` },
    { icon: CircleCheck, label: "取引完了", value: `${sold}` },
  ];
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

      {/* 集計（実データ） */}
      <div className="ds-card mt-6 grid grid-cols-3 divide-x divide-line-soft">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3 p-4 sm:p-5">
            <s.icon size={24} strokeWidth={1.8} className="text-brand" />
            <div>
              <div className="text-[12px] text-ink-soft">{s.label}</div>
              <div className="font-round text-xl font-bold text-ink">
                {s.value}
                <span className="text-[12px] font-normal text-ink-soft">件</span>
              </div>
            </div>
          </div>
        ))}
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

      {/* 出品した商品 */}
      <div className="mt-6">
        <div className="heading-row mb-4">
          <Camera size={20} className="text-brand-deep" />
          <h2 className="font-round text-lg font-bold text-ink">
            出品した商品
          </h2>
          <span className="tag ml-1">{items.length}件</span>
        </div>
        {items.length === 0 ? (
          <p className="ds-card border-dashed py-12 text-center text-sm text-ink-soft">
            まだ出品がありません。
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
