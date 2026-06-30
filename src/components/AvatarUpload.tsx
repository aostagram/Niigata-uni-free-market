"use client";

import { useRef, useState, useTransition } from "react";
import { Camera, Sprout } from "lucide-react";
import { useRouter } from "next/navigation";
import { uploadAvatar } from "@/app/actions/profile";

export function AvatarUpload({ currentUrl }: { currentUrl: string | null }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setPreview(URL.createObjectURL(file));
    const fd = new FormData();
    fd.append("avatar", file);
    startTransition(async () => {
      const res = await uploadAvatar(fd);
      if (res?.error) {
        setError(res.error);
        setPreview(currentUrl);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="relative flex-none">
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="アバター"
          className="h-[88px] w-[88px] rounded-full object-cover"
        />
      ) : (
        <span
          className="flex h-[88px] w-[88px] items-center justify-center rounded-full"
          style={{ background: "radial-gradient(circle,#eef5dd,#d6e7b6)" }}
        >
          <Sprout size={42} className="text-brand-deep" />
        </span>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={pending}
        className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-brand shadow-md transition hover:bg-brand-deep disabled:opacity-60"
        aria-label="写真を変更"
      >
        {pending ? (
          <span className="block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <Camera size={13} className="text-white" />
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {error && (
        <p className="absolute left-0 top-full mt-1 w-48 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
