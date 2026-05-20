"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Platform = "PS4" | "PS5" | "PC" | "SWITCH" | "OTHER";
type GameStatus = "PLAYING" | "PLATINUM" | "DROPPED";

const PLATFORMS: Platform[] = ["PS5", "PS4", "PC", "SWITCH", "OTHER"];
const PS_PLATFORMS: Platform[] = ["PS5", "PS4"];

export default function AddGamePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState<Platform>("PS5");
  const [status, setStatus] = useState<GameStatus>("PLAYING");

  const isPS = PS_PLATFORMS.includes(platform);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const data = {
      title: form.get("title"),
      platform,
      genre: form.get("genre"),
      status,
      startDate: form.get("startDate") || null,
    };

    const res = await fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const game = await res.json();
      router.push(`/admin/games/${game.id}`);
    } else {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl flex flex-col gap-6">
      <h2 className="text-lg font-bold" style={{ color: "#e8e8f0" }}>
        Add Game
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Platform */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-wide uppercase" style={{ color: "#4a4a6a" }}>
            Platform
          </label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: platform === p ? "#7c6dff" : "#0f0f1a",
                  color: platform === p ? "#e8e8f0" : "#4a4a6a",
                  border: `1px solid ${platform === p ? "#7c6dff" : "#1e1e35"}`,
                }}
              >
                {p}
              </button>
            ))}
          </div>
          {isPS && (
            <p className="text-xs" style={{ color: "#7c6dff" }}>
              🎮 PSN trophy sync available after adding the game
            </p>
          )}
        </div>

        {/* Title */}
        <Field label="Game Title" name="title" placeholder="e.g. Elden Ring" required />

        {/* Genre */}
        <Field label="Genre" name="genre" placeholder="e.g. Action RPG" />

        {/* Status */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-wide uppercase" style={{ color: "#4a4a6a" }}>
            Status
          </label>
          <div className="flex gap-2">
            {(["PLAYING", "PLATINUM", "DROPPED"] as GameStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: status === s ? "#7c6dff" : "#0f0f1a",
                  color: status === s ? "#e8e8f0" : "#4a4a6a",
                  border: `1px solid ${status === s ? "#7c6dff" : "#1e1e35"}`,
                }}
              >
                {s === "PLAYING" ? "🎮" : s === "PLATINUM" ? "🏆" : "💀"} {s}
              </button>
            ))}
          </div>
        </div>

        {/* Start Date */}
        <Field label="Start Date" name="startDate" type="date" />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity mt-2"
          style={{ backgroundColor: "#7c6dff", color: "#e8e8f0", opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Adding..." : "Add Game"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label, name, placeholder, type = "text", required,
}: {
  label: string; name: string; placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold tracking-wide uppercase" style={{ color: "#4a4a6a" }}>
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="rounded-lg px-4 py-3 text-sm outline-none"
        style={{
          backgroundColor: "#0f0f1a",
          border: "1px solid #1e1e35",
          color: "#e8e8f0",
          colorScheme: "dark",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#7c6dff")}
        onBlur={(e) => (e.target.style.borderColor = "#1e1e35")}
      />
    </div>
  );
}
