"use client";

import { useState, useTransition } from "react";
import { saveProfile } from "@/app/actions/profile";

const GRADES = [
  "学部1年",
  "学部2年",
  "学部3年",
  "学部4年",
  "修士1年",
  "修士2年",
  "博士課程",
  "その他",
];

const FACULTIES = [
  "人文学部",
  "教育学部",
  "法学部",
  "経済科学部",
  "理学部",
  "医学部",
  "歯学部",
  "工学部",
  "農学部",
  "創生学部",
  "大学院・その他",
];

export function ProfileForm({
  defaultNickname = "",
  defaultGrade = "",
  defaultFaculty = "",
  submitLabel = "保存する",
}: {
  defaultNickname?: string;
  defaultGrade?: string;
  defaultFaculty?: string;
  submitLabel?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveProfile(fd);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div>
        <label
          htmlFor="nickname"
          className="font-round mb-1.5 block text-sm font-bold text-brand-deep"
        >
          ニックネーム <span className="text-coral">*</span>
        </label>
        <input
          id="nickname"
          name="nickname"
          type="text"
          required
          maxLength={20}
          defaultValue={defaultNickname}
          placeholder="例：がたお"
          className="input"
        />
        <p className="mt-1 text-xs text-ink-faint">
          チャットや出品で表示される名前です（20文字以内）。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="faculty"
            className="font-round mb-1.5 block text-sm font-bold text-brand-deep"
          >
            学部
          </label>
          <select
            id="faculty"
            name="faculty"
            defaultValue={defaultFaculty}
            className="input"
          >
            <option value="">選択しない</option>
            {FACULTIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="grade"
            className="font-round mb-1.5 block text-sm font-bold text-brand-deep"
          >
            学年
          </label>
          <select
            id="grade"
            name="grade"
            defaultValue={defaultGrade}
            className="input"
          >
            <option value="">選択しない</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-coral-line bg-coral-bg px-4 py-2.5 text-sm text-coral">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary w-full py-3.5 text-base"
      >
        {pending ? "保存中…" : submitLabel}
      </button>
    </form>
  );
}
