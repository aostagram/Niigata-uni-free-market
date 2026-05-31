"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateItemStatus, deleteItem } from "@/app/actions/items";
import { ITEM_STATUS, type ItemStatus } from "@/lib/constants";

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
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="mb-3 text-sm font-medium text-gray-700">出品者メニュー</p>
      <div className="mb-3 flex flex-wrap gap-2">
        {(Object.keys(ITEM_STATUS) as ItemStatus[]).map((s) => (
          <button
            key={s}
            type="button"
            disabled={pending}
            onClick={() => changeStatus(s)}
            className={`rounded-lg border px-3 py-1.5 text-sm transition ${
              current === s
                ? "border-brand bg-brand text-white"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            {ITEM_STATUS[s]}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="text-sm text-red-600 hover:underline"
      >
        出品を削除する
      </button>
    </div>
  );
}
