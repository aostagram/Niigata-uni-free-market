"use client";

import { useState, useTransition } from "react";
import { UserPlus, UserCheck } from "lucide-react";
import { toggleFollow } from "@/app/actions/follow";

/**
 * 出品者フォローボタン（メルカリ風）。商品詳細で使用。
 * 未ログインはログインへ誘導。サーバーアクションで follows をトグル。
 */
export function FollowButton({
  stockId,
  initialFollowing,
  loggedIn,
}: {
  stockId: string;
  initialFollowing: boolean;
  loggedIn: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  if (!loggedIn) {
    return (
      <a href="/login" className="btn btn-ghost px-4 py-2 text-sm">
        <UserPlus size={16} />
        フォローする（要ログイン）
      </a>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setMessage(null);
            const r = await toggleFollow(stockId);
            if (r.ok) setFollowing(r.following);
            else setMessage(r.message ?? "うまくいきませんでした");
          })
        }
        className={`btn ${following ? "btn-ghost" : "btn-primary"} px-4 py-2 text-sm`}
        aria-pressed={following}
      >
        {following ? (
          <>
            <UserCheck size={16} />
            フォロー中
          </>
        ) : (
          <>
            <UserPlus size={16} />
            フォローする
          </>
        )}
      </button>
      {message && <span className="text-[12px] text-coral">{message}</span>}
    </div>
  );
}
