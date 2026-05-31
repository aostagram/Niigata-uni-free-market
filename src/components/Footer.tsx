import { SERVICE_DISCLAIMER } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
          {SERVICE_DISCLAIMER}
        </p>
        <p className="mt-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} 新大フリマ
        </p>
      </div>
    </footer>
  );
}
