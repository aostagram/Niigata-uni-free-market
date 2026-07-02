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
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
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
      ...(replyTo ? { replyTo } : {}),
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
      このメールはガタフィー（新潟大学生限定のフリマ掲示板）の自動通知です。<br/>
      心当たりがない場合は破棄してください。
    </p>
  </div>`;
}

/** 初回ログイン完了時に送るウェルカムメール。 */
export async function sendWelcomeEmail(to: string, nickname: string) {
  const html = mailLayout(
    "ご登録ありがとうございます！",
    `
    <p>${nickname} さん、ガタフィーへようこそ。</p>
    <p>これで新潟大学生限定のフリマ掲示板を利用できるようになりました。<br/>
    取引相手とのやり取りや通知は、今後このメールアドレス宛にお送りします。</p>
    <p style="margin-top:16px;padding:12px 16px;background:#f3f6ec;border-radius:8px">
      ⚠️ 大学のメールアドレスは迷惑メールフィルタが厳しく、
      通知が届かないことがあります。<br/>
      お手数ですが <strong>gatafeefurima@gmail.com</strong> を
      連絡先（アドレス帳）に追加、または迷惑メールフォルダに入っていた場合は
      「迷惑メールではない」に設定していただけると安心です。
    </p>
    `,
  );
  return sendMail({
    to,
    subject: "【ガタフィー】ご登録ありがとうございます",
    html,
    replyTo: "gatafeefurima@gmail.com",
  });
}
