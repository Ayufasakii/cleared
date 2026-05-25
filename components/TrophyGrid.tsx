"use client";

import Image from "next/image";
import { useState } from "react";
import type { Trophy, TrophyGrade } from "@prisma/client";

const gradeColor: Record<TrophyGrade, string> = {
  PLATINUM: "#7c6dff",
  GOLD:     "#f5c842",
  SILVER:   "#a0a0b8",
  BRONZE:   "#c87941",
};

const gradeIcon: Record<TrophyGrade, string> = {
  PLATINUM: "🏆",
  GOLD:     "🥇",
  SILVER:   "🥈",
  BRONZE:   "🥉",
};

const GRADE_ORDER: TrophyGrade[] = ["PLATINUM", "GOLD", "SILVER", "BRONZE"];

export default function TrophyGrid({ trophies }: { trophies: Trophy[] }) {
  const earned = trophies.filter((t) => t.earned).length;
  const total = trophies.length;

  const grouped = GRADE_ORDER.map((grade) => ({
    grade,
    items: trophies.filter((t) => t.grade === grade),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#4a4a6a" }}>
          Trophies
        </h2>
        <span className="text-xs font-semibold" style={{ color: "#7c6dff" }}>
          {earned} / {total}
        </span>
      </div>

      {/* Groups */}
      {grouped.map(({ grade, items }) => (
        <div key={grade} className="flex flex-col gap-1">
          {/* Grade header */}
          <div className="flex items-center gap-2 px-1 mb-1">
            <span className="text-sm">{gradeIcon[grade]}</span>
            <span className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: gradeColor[grade] }}>
              {grade}
            </span>
            <span className="text-xs" style={{ color: "#4a4a6a" }}>
              {items.filter((t) => t.earned).length}/{items.length}
            </span>
          </div>

          {/* Trophy rows */}
          <div className="flex flex-col rounded-xl overflow-hidden"
            style={{ border: "1px solid #1e1e35" }}>
            {items.map((trophy, i) => (
              <TrophyRow
                key={trophy.id}
                trophy={trophy}
                isLast={i === items.length - 1}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TrophyRow({ trophy, isLast }: { trophy: Trophy; isLast: boolean }) {
  const [revealed, setRevealed] = useState(trophy.earned);
  const isBlurred = !trophy.earned && !revealed;
  const color = gradeColor[trophy.grade];

  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 transition-all cursor-pointer"
      style={{
        backgroundColor: trophy.earned ? `${color}08` : "#0f0f1a",
        borderBottom: isLast ? "none" : "1px solid #1e1e35",
      }}
      onClick={() => !trophy.earned && setRevealed((r) => !r)}
      onMouseEnter={(e) => {
        if (!trophy.earned) (e.currentTarget as HTMLDivElement).style.backgroundColor = "#1e1e35";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor = trophy.earned ? `${color}08` : "#0f0f1a";
      }}
    >
      {/* Thumbnail */}
      <div className="relative shrink-0 w-10 h-10 rounded-lg overflow-hidden"
        style={{ backgroundColor: "#1e1e35" }}>
        {trophy.imageUrl ? (
          <Image
            src={trophy.imageUrl}
            alt={trophy.name}
            fill
            unoptimized
            className="object-cover"
            style={{ filter: isBlurred ? "blur(6px)" : "none" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-base">
            {gradeIcon[trophy.grade]}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight truncate"
          style={{
            color: isBlurred ? "#4a4a6a" : "#e8e8f0",
            filter: isBlurred ? "blur(5px)" : "none",
          }}>
          {isBlurred ? "???????????????????" : trophy.name}
        </p>
        {trophy.earned && trophy.note && (
          <p className="text-xs truncate mt-0.5 italic" style={{ color: "#4a4a6a" }}>
            {trophy.note}
          </p>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 shrink-0">
        {trophy.earned && trophy.difficulty !== null && (
          <span className="text-xs" style={{ color: "#7c6dff" }}>
            {"★".repeat(trophy.difficulty)}{"☆".repeat(5 - trophy.difficulty)}
          </span>
        )}
        {trophy.rarity !== null && (
          <span className="text-xs" style={{ color: "#4a4a6a" }}>
            {trophy.rarity.toFixed(1)}%
          </span>
        )}
        {/* Earned dot */}
        <div className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: trophy.earned ? color : "#1e1e35" }} />
      </div>
    </div>
  );
}
