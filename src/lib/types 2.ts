import type { CategoryValue, ItemStatus } from "./constants";

export type Profile = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  /** プロフィールで入力するニックネーム（表示名） */
  nickname: string | null;
  /** 学年（例: 学部1年） */
  grade: string | null;
  /** 学部（例: 工学部） */
  faculty: string | null;
  /** 通知メールの宛先（auth のメールを複製。RLSは本人/全体閲覧可） */
  email: string | null;
  created_at: string;
};

export type Item = {
  id: string;
  user_id: string;
  title: string;
  category: CategoryValue;
  description: string;
  price: number; // 0 = 無料で譲渡
  image_url: string | null;
  status: ItemStatus;
  created_at: string;
};

/** 出品 + 出品者プロフィール(一覧・詳細表示用) */
export type ItemWithSeller = Item & {
  seller: Pick<Profile, "id" | "full_name" | "avatar_url">;
};

export type ChatRoom = {
  id: string;
  item_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
};

export type Message = {
  id: string;
  room_id: string;
  sender_id: string;
  message_text: string;
  created_at: string;
};
