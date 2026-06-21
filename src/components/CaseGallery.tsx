"use client";

import { useState } from "react";

type Case = {
  title: string;
  meta: string;
  img: string;
  alt: string;
  tags: string[];
  area: "ikarashi" | "asahimachi";
  budget: "under1000" | "under5000" | "over10000";
  taste: "study" | "interior" | "daily";
};

const CASES: Case[] = [
  {
    title: "教科書を図書館前で受け渡し",
    meta: "エリア：五十嵐 / 予算：〜1,000円",
    img: "/brand/cases/books.webp",
    alt: "教科書取引の事例",
    tags: ["学用品", "手渡し"],
    area: "ikarashi",
    budget: "under1000",
    taste: "study",
  },
  {
    title: "椅子を第一食堂前で相談",
    meta: "エリア：五十嵐 / 予算：〜5,000円",
    img: "/brand/cases/chair.webp",
    alt: "オフィスチェア取引の事例",
    tags: ["家具", "チャット相談"],
    area: "ikarashi",
    budget: "under5000",
    taste: "interior",
  },
  {
    title: "ノートPCをキャンパス内で確認",
    meta: "エリア：旭町 / 予算：10,000円〜",
    img: "/brand/cases/laptop.webp",
    alt: "ノートPC取引の事例",
    tags: ["学用品", "状態確認"],
    area: "asahimachi",
    budget: "over10000",
    taste: "study",
  },
  {
    title: "トートバッグを講義前に手渡し",
    meta: "エリア：五十嵐 / 予算：〜1,000円",
    img: "/brand/cases/tote.webp",
    alt: "トートバッグ取引の事例",
    tags: ["生活用品", "短時間"],
    area: "ikarashi",
    budget: "under1000",
    taste: "daily",
  },
  {
    title: "小型家電を明るい場所で確認",
    meta: "エリア：旭町 / 予算：〜5,000円",
    img: "/brand/cases/appliance.webp",
    alt: "小型家電取引の事例",
    tags: ["生活用品", "安全確認"],
    area: "asahimachi",
    budget: "under5000",
    taste: "daily",
  },
  {
    title: "附属図書館前で生活雑貨を手渡し",
    meta: "エリア：五十嵐 / 予算：〜1,000円",
    img: "/brand/library.webp",
    alt: "学内スポットでの受け渡し事例",
    tags: ["生活用品", "図書館前"],
    area: "ikarashi",
    budget: "under1000",
    taste: "daily",
  },
];

export function CaseGallery() {
  const [area, setArea] = useState("all");
  const [budget, setBudget] = useState("all");
  const [taste, setTaste] = useState("all");

  const visible = CASES.filter(
    (c) =>
      (area === "all" || c.area === area) &&
      (budget === "all" || c.budget === budget) &&
      (taste === "all" || c.taste === taste),
  );

  return (
    <>
      <div className="filter-bar" aria-label="取引事例の絞り込み">
        <div className="filter-field">
          <label htmlFor="filter-area">エリア</label>
          <select
            id="filter-area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          >
            <option value="all">すべて</option>
            <option value="ikarashi">五十嵐</option>
            <option value="asahimachi">旭町</option>
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="filter-budget">予算</label>
          <select
            id="filter-budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            <option value="all">すべて</option>
            <option value="under1000">〜1,000円</option>
            <option value="under5000">〜5,000円</option>
            <option value="over10000">10,000円〜</option>
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="filter-taste">テイスト</label>
          <select
            id="filter-taste"
            value={taste}
            onChange={(e) => setTaste(e.target.value)}
          >
            <option value="all">すべて</option>
            <option value="study">学用品</option>
            <option value="interior">家具</option>
            <option value="daily">生活用品</option>
          </select>
        </div>
      </div>
      <div className="grid-3">
        {visible.map((c) => (
          <article key={c.title} className="case-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.img} alt={c.alt} />
            <div className="card-body">
              <h3>{c.title}</h3>
              <p className="lead">{c.meta}</p>
              <div className="case-tags">
                {c.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      {visible.length === 0 && (
        <p className="no-results is-visible">条件に合う取引事例がありません。</p>
      )}
    </>
  );
}
