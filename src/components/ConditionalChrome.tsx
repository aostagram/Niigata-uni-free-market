"use client";

import { usePathname } from "next/navigation";

/**
 * チャットの「会話画面」(/chat/<roomId>) では、入力欄を画面最下部に
 * ぴったり固定したいので、フッターとボトムタブバーを隠す。
 * メッセージ一覧(/chat)や他のページでは通常どおり表示する。
 */
export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const inChatRoom = /^\/chat\/[^/]+$/.test(pathname);
  if (inChatRoom) return null;
  return <>{children}</>;
}
