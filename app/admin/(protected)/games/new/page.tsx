"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Platform = "PS4" | "PS5" | "PC" | "SWITCH" | "OTHER";
type GameStatus = "PLAYING" | "PLATINUM" | "DROPPED";

interface GameSuggestion {
  name: string;
  cover: string | null;
  genre: string | null;
}

const PLATFORMS: Platform[] = ["PS5", "PS4", "PC", "SWITCH", "OTHER"];

export default function AddGamePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState<Platform>("PS5");
  const [status, setStatus] = useState<GameStatus>("PLAYING");

  const [titleInput, setTitleInput] = useState("");
  const [genre, setGenre] = useState("");
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<GameSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleTitleChange(val: string) {
    setTitleInput(val);
    setCoverUrl(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.length < 2) { setSuggestions([]); setShowDropdown(false); return; }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const key = process.env.NEXT_PUBLIC_RAWG_API_KEY;
        const res = await fetch(
          `https://api.rawg.io/api/games?key=${key}&search=${encodeURIComponent(val)}&page_size=6`,
        );
        const data = await res.json();
        const list: GameSuggestion[] = (data.results ?? []).map((g: {
          name: string;
          background_image: string | null;
          genres: { name: string }[];
        }) => ({
          name: g.name,
          cover: g.background_image ?? null,
          genre: g.genres.map((x: { name: string }) => x.name).slice(0, 2).join(", ") || null,
        }));
        setSuggestions(list);
        setShowDropdown(list.length > 0);
      } catch (e) {
        console.error(e);
      } finally {
        setSearching(false);
      }
    }, 350);
  }

  function selectSuggestion(s: GameSuggestion) {
    setTitleInput(s.name);
    setGenre(s.genre ?? "");
    setCoverUrl(s.cover);
    setSuggestions([]);
    setShowDropdown(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const data = {
      title: titleInput,
      platform,
      genre: genre || null,
      status,
      startDate: form.get("startDate") || null,
      coverUrl,
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
      <h2 className="text-lg font-bold" style={{ color: "#e8e8f0" }}>Add Game</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Platform */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-wide uppercase" style={{ color: "#4a4a6a" }}>
            Platform
          </label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button key={p} type="button" onClick={() => setPlatform(p)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: platform === p ? "#7c6dff" : "#0f0f1a",
                  color: platform === p ? "#e8e8f0" : "#4a4a6a",
                  border: `1px solid ${platform === p ? "#7c6dff" : "#1e1e35"}`,
                }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Title autocomplete */}
        <div className="flex flex-col gap-2" ref={wrapperRef}>
          <label className="text-xs font-semibold tracking-wide uppercase" style={{ color: "#4a4a6a" }}>
            Game Title
          </label>

          {/* Cover preview + input row */}
          <div className="flex items-center gap-3">
            {coverUrl ? (
              <div className="relative shrink-0 w-12 h-16 rounded-lg overflow-hidden"
                style={{ border: "1px solid #1e1e35" }}>
                <Image src={coverUrl} alt="cover" fill style={{ objectFit: "cover" }} unoptimized />
              </div>
            ) : (
              <div className="shrink-0 w-12 h-16 rounded-lg flex items-center justify-center text-xl"
                style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35" }}>
                🎮
              </div>
            )}
            <div className="relative flex-1">
              <input
                value={titleInput}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Type to search…"
                required
                className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35", color: "#e8e8f0" }}
                onFocus={(e) => { e.target.style.borderColor = "#7c6dff"; if (suggestions.length > 0) setShowDropdown(true); }}
                onBlur={(e) => (e.target.style.borderColor = "#1e1e35")}
                autoComplete="off"
              />
              {searching && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "#4a4a6a" }}>
                  ...
                </span>
              )}
            </div>
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div className="rounded-xl overflow-hidden flex flex-col"
              style={{ backgroundColor: "#0f0f1a", border: "1px solid #7c6dff40", marginTop: "-4px" }}>
              {suggestions.map((s, i) => (
                <button key={i} type="button" onClick={() => selectSuggestion(s)}
                  className="flex items-center gap-3 px-3 py-2.5 text-left transition-all"
                  style={{ borderBottom: i < suggestions.length - 1 ? "1px solid #1e1e35" : "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e1e35")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                  {s.cover ? (
                    <div className="relative shrink-0 w-8 h-11 rounded overflow-hidden">
                      <Image src={s.cover} alt={s.name} fill style={{ objectFit: "cover" }} unoptimized />
                    </div>
                  ) : (
                    <div className="shrink-0 w-8 h-11 rounded flex items-center justify-center text-sm"
                      style={{ backgroundColor: "#1e1e35" }}>🎮</div>
                  )}
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-medium truncate" style={{ color: "#e8e8f0" }}>{s.name}</span>
                    {s.genre && <span className="text-xs truncate" style={{ color: "#4a4a6a" }}>{s.genre}</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Genre */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-wide uppercase" style={{ color: "#4a4a6a" }}>
            Genre
          </label>
          <input
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="e.g. Action RPG"
            className="rounded-lg px-4 py-3 text-sm outline-none"
            style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35", color: "#e8e8f0" }}
            onFocus={(e) => (e.target.style.borderColor = "#7c6dff")}
            onBlur={(e) => (e.target.style.borderColor = "#1e1e35")}
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-wide uppercase" style={{ color: "#4a4a6a" }}>
            Status
          </label>
          <div className="flex gap-2">
            {(["PLAYING", "PLATINUM", "DROPPED"] as GameStatus[]).map((s) => (
              <button key={s} type="button" onClick={() => setStatus(s)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: status === s ? "#7c6dff" : "#0f0f1a",
                  color: status === s ? "#e8e8f0" : "#4a4a6a",
                  border: `1px solid ${status === s ? "#7c6dff" : "#1e1e35"}`,
                }}>
                {s === "PLAYING" ? "🎮" : s === "PLATINUM" ? "🏆" : "💀"} {s}
              </button>
            ))}
          </div>
        </div>

        {/* Start Date */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-wide uppercase" style={{ color: "#4a4a6a" }}>
            Start Date
          </label>
          <input name="startDate" type="date"
            className="rounded-lg px-4 py-3 text-sm outline-none"
            style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35", color: "#e8e8f0", colorScheme: "dark" }}
            onFocus={(e) => (e.target.style.borderColor = "#7c6dff")}
            onBlur={(e) => (e.target.style.borderColor = "#1e1e35")} />
        </div>

        <button type="submit" disabled={loading || !titleInput}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity mt-2"
          style={{ backgroundColor: "#7c6dff", color: "#e8e8f0", opacity: loading || !titleInput ? 0.5 : 1 }}>
          {loading ? "Adding..." : "Add Game"}
        </button>
      </form>
    </div>
  );
}
