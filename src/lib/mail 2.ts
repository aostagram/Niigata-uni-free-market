import "server-only";
import nodemailer from "nodemailer";
import { OFFICIAL_EMAIL } from "@/lib/links";

/**
 * ガタフィー公式 Gmail（gatafeefurima@gmail.com）からの通知メール送信。
 *
 * 必要な環境変数（.env.local と Vercel の両方に設定）:
 *   GMAIL_USER          送信元アドレス（= gatafeefurima@gmail.com）
 *   GMAIL_APP_PASSWORD  Google アカウントの「アプリ パスワード」(16桁)
 *
 * 未設定のときは送信せずログだけ出す（アプリは壊さない）。
 */
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }
  return transporter;
}

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; skipped?: boolean }> {
  const t = getTransporter();
  if (!t) {
    console.warn(
      `[mail] GMAIL_USER / GMAIL_APP_PASSWORD 未設定のため送信スキップ → to=${to} subject=${subject}`,
    );
    return { ok: false, skipped: true };
  }
  try {
    await t.sendMail({
      from: `"ガタフィー" <${process.env.GMAIL_USER ?? OFFICIAL_EMAIL}>`,
      to,
      subject,
      html,
    });
    return { ok: true };
  } catch (e) {
    console.error("[mail] 送信失敗:", e instanceof Error ? e.message : e);
    return { ok: false };
  }
}

/** 通知メールの共通レイアウト（水彩グリーン基調のシンプルHTML） */
export function mailLayout(title: string, bodyHtml: string): string {
  return `
  <div style="font-family:'Hiragino Mincho ProN',serif;max-width:520px;margin:0 auto;padding:24px;color:#3c4a2e">
    <div style="text-align:center;font-size:22px;font-weight:700;color:#5f8128;margin-bottom:8px">ガタフィー</div>
    <div style="height:3px;background:linear-gradient(135deg,#9cc659,#84ad3f);border-radius:2px;margin-bottom:20px"></div>
    <h1 style="font-size:18px;color:#3c4a2e">${title}</h1>
    <div style="font-size:14px;line-height:1.9">${bodyHtml}</div>
    <p style="margin-top:24px;font-size:12px;color:#9aa48d">
      このメールはガタフィー（新潟大学生限定フリマ）の自動通知です。<br/>
      心当たりがない場合は破棄してください。
    </p>
  </div>`;
}
