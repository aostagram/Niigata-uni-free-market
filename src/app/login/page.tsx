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
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="新大フリマ"
            className="mx-auto mb-4 h-16 w-16"
          />
          <h1 className="text-2xl font-bold">新大フリマ</h1>
          <p className="mt-2 text-sm text-gray-600">
            新潟大学生限定のキャンパス内フリーマーケット
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <LoginButton />
          <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">
            ログインには新潟大学の Google アカウント
            <br />（@{ALLOWED_EMAIL_DOMAIN}）が必要です。
          </p>
        </div>

        <p className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-center text-xs leading-relaxed text-amber-900">
          {SERVICE_DISCLAIMER}
        </p>
      </div>
    </main>
  );
}
