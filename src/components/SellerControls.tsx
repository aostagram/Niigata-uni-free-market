"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateItemStatus, deleteItem } from "@/app/actions/items";
import { ITEM_STATUS, type ItemStatus } from "@/lib/constants";
import { FORMS } from "@/lib/links";

export function SellerControls({
  itemId,
  status,
}: {
  itemId: string;
  status: ItemStatus;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState<ItemStatus>(status);
  const [pending, startTransition] = useTransition();

  function changeStatus(next: ItemStatus) {
    setCurrent(next);
    startTransition(async () => {
      await updateItemStatus(itemId, next);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm("この出品を削除しますか?この操作は取り消せません。")) return;
    startTransition(async () => {
      await deleteItem(itemId);
    });
  }

  return (
    <div className="ds-card p-5">
      <p className="font-round mb-3 text-sm font-bold text-brand-deep">
        出品者メニュー
      </p>
      <div className="mb-3 flex flex-wrap gap-2.5">
        {(Object.keys(ITEM_STATUS) as ItemStatus[]).map((s) => (
          <button
            key={s}
            type="button"
            disabled={pending}
            onClick={() => changeStatus(s)}
            className={`font-round rounded-full border px-4 py-2 text-sm transition ${
              current === s
                ? "border-brand bg-panel font-bold text-brand-deep"
                : "border-line bg-white text-ink-soft hover:border-brand"
            }`}
          >
            {ITEM_STATUS[s]}
          </button>
        ))}
      </div>
      <a
        href={FORMS.completeSeller}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-ghost mb-3 w-full py-3 text-sm"
      >
        取引完了を報告する（売り手）
      </a>
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="text-sm text-coral hover:underline"
      >
        出品を削除する
      </button>
    </div>
  );
}
