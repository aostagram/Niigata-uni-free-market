import type { CategoryValue, ItemStatus } from "./constants";

export type Profile = {
  id: string;
  full_name: string;
  avatar_url: string | null;
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
