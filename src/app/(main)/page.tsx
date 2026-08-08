import Link from "next/link";

/**
 * ガタフィーは公開を終了したため、トップは「公開終了のお知らせ」だけを出す。
 * 商品一覧・出品導線・お客様の声などの LP セクションはすべて撤去済み。
 */
export default function HomePage() {
  return (
    <div className="lp-home">
      {/* ===== 公開終了のお知らせ ===== */}
      <section className="hero">
        <div className="hero-content">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hero-logo" src="/brand/logo.png" alt="ガタフィー" />
          <p className="eyebrow">お知らせ</p>
          <h1>アプリ公開は終了しました。</h1>
          <p className="hero-copy">
            <b>2026年8月8日</b>
            をもって、新潟大学の学生限定フリマ掲示板「ガタフィー」はサービスの公開を終了しました。
            商品の閲覧・出品の受付・購入希望の受付・チャットでのやり取りは、すべて停止しています。
          </p>
          <p className="hero-copy">
            これまでご利用いただいた皆さま、ご協力いただいた皆さま、本当にありがとうございました。
          </p>
        </div>
      </section>

      {/* ===== 補足 ===== */}
      <section className="section">
        <div className="container">
          <div className="panel notice-panel">
            <h2>終了にあたって</h2>
            <ul className="notice-list">
              <li>
                新規の出品・購入希望の受付は終了しました。Google
                フォームからの申し込みも受け付けていません。
              </li>
              <li>
                取引中のやり取りが残っている場合は、お相手と直接ご連絡のうえ、
                お早めに完了させてください。
              </li>
              <li>
                通知メールの配信は停止しました。今後ガタフィーからメールが届くことはありません。
              </li>
            </ul>
            <p className="lead">
              過去にご同意いただいた内容は、
              <Link href="/terms">利用規約</Link>と
              <Link href="/privacy">プライバシーポリシー</Link>
              でご確認いただけます。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
