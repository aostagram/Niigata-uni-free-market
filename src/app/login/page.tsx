import Link from "next/link";
import { ShoppingBag, Sprout, GraduationCap } from "lucide-react";
import { LoginButton } from "@/components/LoginButton";
import { ALLOWED_EMAIL_DOMAIN, SERVICE_DISCLAIMER } from "@/lib/constants";

const ERROR_MESSAGES: Record<string, string> = {
  domain: `新潟大学のメールアドレス（@${ALLOWED_EMAIL_DOMAIN}）のアカウントでログインしてください。`,
  auth: "ログインに失敗しました。もう一度お試しください。",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? ERROR_MESSAGES[error] : null;

  return (
    <main className="wc-page flex min-h-dvh flex-col items-center px-5 py-10">
      <div className="fade-up flex w-full max-w-[560px] flex-col items-center">
        {/* ロゴ */}
        <div
          className="mt-4 flex h-[200px] w-[200px] items-center justify-center rounded-full sm:h-[230px] sm:w-[230px]"
          style={{
            background:
              "radial-gradient(circle at 50% 42%, #fff 18%, rgba(212,234,191,.55) 55%, rgba(170,205,110,.25) 78%, transparent 82%)",
          }}
        >
          <div className="text-center">
            <ShoppingBag
              size={70}
              strokeWidth={1.7}
              className="mx-auto text-brand-deep"
            />
            <div className="font-round mt-1.5 text-[34px] font-bold tracking-[0.04em] text-[color:var(--logo)]">
              新大フリマ
            </div>
            <div className="font-latin mt-1 text-[13px] tracking-[0.1em] text-brand">
              Niigata univ. Free Market
            </div>
          </div>
        </div>

        <h1 className="font-round mt-6 text-center text-[22px] font-medium text-ink sm:text-[26px]">
          新大生の「欲しい」がきっと見つかる。
        </h1>
        <div className="my-3.5 flex items-center gap-3 text-brand">
          <span className="h-px w-14 bg-line" />
          <Sprout size={20} />
          <span className="h-px w-14 bg-line" />
        </div>
        <p className="mb-6 text-center text-[15px] leading-[1.8] text-ink-soft">
          新潟大学の学生のための
          <br />
          フリマアプリです。
        </p>

        {errorMessage && (
          <div className="mb-4 w-full rounded-xl border border-coral-line bg-coral-bg px-4 py-3 text-sm text-coral">
            {errorMessage}
          </div>
        )}

        {/* 非公式団体の注意 */}
        <div className="ds-panel mb-4 flex w-full gap-3.5 p-5">
          <GraduationCap
            size={30}
            strokeWidth={1.7}
            className="mt-0.5 flex-none text-brand"
          />
          <div>
            <p className="font-round text-[15px] font-bold text-brand-deep">
              学生のみの非公式団体です
            </p>
            <p className="mt-1 text-[13.5px] leading-[1.7] text-ink-soft">
              新大フリマは、新潟大学の学生による学生のための非公式団体です。教職員の方はご利用いただけません。
            </p>
          </div>
        </div>

        {/* ログイン(同意 + Google) */}
        <div className="w-full">
          <LoginButton />
        </div>

        {/* リンク */}
        <div className="font-round mt-7 flex flex-wrap justify-center gap-x-6 gap-y-4 text-[13.5px] text-brand-deep">
          <Link href="/terms" className="hover:underline">
            利用規約
          </Link>
          <Link href="/privacy" className="hover:underline">
            プライバシーポリシー
          </Link>
        </div>

        <p className="ds-panel mt-6 w-full px-4 py-3 text-center text-xs leading-relaxed text-ink-soft">
          {SERVICE_DISCLAIMER}
        </p>
        <div className="mt-4 text-xs text-ink-faint">© 2024 新大フリマ</div>
      </div>
    </main>
  );
}
