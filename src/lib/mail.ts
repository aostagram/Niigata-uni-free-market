import "server-only";
import { Resend } from "resend";

const FROM_ADDRESS = "ガタフィー <noreply@furima.gatabottle.com>";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
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
  const resend = getResend();
  if (!resend) {
    console.warn(
      `[mail] RESEND_API_KEY 未設定のため送信スキップ → to=${to} subject=${subject}`,
    );
    return { ok: false, skipped: true };
  }
  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    });
    if (error) {
      console.error("[mail] 送信失敗:", error.message);
      return { ok: false };
    }
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
