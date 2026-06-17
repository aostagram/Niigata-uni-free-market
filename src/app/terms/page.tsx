import type { Metadata } from "next";
import { LegalDocumentView } from "@/components/LegalDocumentView";
import { TERMS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "利用規約 | 新大フリマ",
};

export default function TermsPage() {
  return <LegalDocumentView doc={TERMS} />;
}
