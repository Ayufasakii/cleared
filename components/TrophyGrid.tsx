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

export default function TrophyGrid({ trophies }: { trophies: Trophy[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#4a4a6a" }}>
        Trophies
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {trophies.map((trophy) => (
          <TrophyCard key={trophy.id} trophy={trophy} />
        ))}
      </div>
    </div>
  );
}

function TrophyCard({ trophy }: { trophy: Trophy }) {
  const [revealed, setRevealed] = useState(trophy.earned);
  const isBlurred = !trophy.earned && !revealed;
  const color = gradeColor[trophy.grade];

  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-2 cursor-pointer transition-all"
      style={{
        backgroundColor: "#0f0f1a",
        border: `1px solid ${trophy.earned ? color + "40" : "#1e1e35"}`,
        opacity: trophy.earned ? 1 : 0.6,
      }}
      onClick={() => !trophy.earned && setRevealed((r) => !r)}
    >
      {/* Image */}
      <div className="relative w-full aspect-square rounded-lg overflow-hidden" style={{ backgroundColor: "#1e1e35" }}>
        {trophy.imageUrl ? (
          <Image
            src={trophy.imageUrl}
            alt={trophy.name}
            fill
            className="object-cover"
            style={{ filter: isBlurred ? "blur(8px)" : "none" }}
            sizes="150px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ fontSize: "1.5rem" }}>
            {gradeIcon[trophy.grade]}
          </div>
        )}
        {isBlurred && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span style={{ fontSize: "1.2rem" }}>🔒</span>
          </div>
        )}
      </div>

      {/* Name */}
      <p
        className="text-xs font-medium leading-tight"
        style={{ color: isBlurred ? "#4a4a6a" : "#e8e8f0", filter: isBlurred ? "blur(4px)" : "none" }}
      >
        {isBlurred ? "???" : trophy.name}
      </p>

      {/* Grade + stats */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color }}>
          {gradeIcon[trophy.grade]}
        </span>
        {trophy.rarity !== null && (
          <span className="text-xs" style={{ color: "#4a4a6a" }}>
            {trophy.rarity.toFixed(1)}%
          </span>
        )}
      </div>

      {/* Difficulty + Fun */}
      {trophy.earned && (trophy.difficulty !== null || trophy.fun !== null) && (
        <div className="flex flex-col gap-0.5">
          {trophy.difficulty !== null && (
            <div className="flex items-center gap-1">
              <span className="text-xs" style={{ color: "#4a4a6a" }}>Hard</span>
              <span className="text-xs" style={{ color: "#7c6dff" }}>{"★".repeat(trophy.difficulty)}{"☆".repeat(5 - trophy.difficulty)}</span>
            </div>
          )}
          {trophy.fun !== null && (
            <div className="flex items-center gap-1">
              <span className="text-xs" style={{ color: "#4a4a6a" }}>Fun</span>
              <span className="text-xs" style={{ color: "#4fc3f7" }}>{"★".repeat(trophy.fun)}{"☆".repeat(5 - trophy.fun)}</span>
            </div>
          )}
        </div>
      )}

      {/* Note */}
      {trophy.earned && trophy.note && (
        <p className="text-xs italic leading-tight" style={{ color: "#4a4a6a" }}>
          "{trophy.note}"
        </p>
      )}
    </div>
  );
}
