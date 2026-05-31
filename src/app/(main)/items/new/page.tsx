import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { AddItemForm } from "@/components/AddItemForm";

export default async function NewItemPage() {
  const profile = await requireProfile();

  return (
    <div>
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        ← もどる
      </Link>
      <h1 className="mb-6 text-xl font-bold">出品する</h1>
      <AddItemForm userId={profile.id} />
    </div>
  );
}
