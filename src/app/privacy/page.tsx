import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/LegalDocumentView";
import { PRIVACY } from "@/lib/legal";

export const metadata: Metadata = {
  title: "プライバシーポリシー | 新大フリマ",
};

export default function PrivacyPage() {
  return <LegalDocumentView doc={PRIVACY} />;
}
