"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface PsnTitle {
  id: string;
  name: string;
  icon: string | null;
  platform: string;
}

export default function PsnSync({
  gameId,
  platform,
  currentPsnId,
}: {
  gameId: string;
  platform: string;
  currentPsnId: string | null;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setPsnResults] = useState<PsnTitle[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedId, setSelectedId] = useState(currentPsnId ?? "");
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ synced?: number; error?: string } | null>(null);

  async function handleSearch() {
    if (!query.trim()) return;
    setSearching(true);
    setSyncResult(null);
    try {
      const res = await fetch(`/api/psn/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setPsnResults(data);
      } else {
        setSyncResult({ error: data.error ?? "Search failed" });
      }
    } finally {
      setSearching(false);
    }
  }

  async function handleSync() {
    if (!selectedId) return;
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/psn/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, psnTitleId: selectedId, platform }),
      });
      const data = await res.json();
      if (data.ok) {
        setSyncResult({ synced: data.synced });
        router.refresh();
      } else {
        setSyncResult({ error: data.error ?? "Sync failed" });
      }
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl p-5"
      style={{ backgroundColor: "#0f0f1a", border: "1px solid #7c6dff30" }}>
      <div className="flex items-center gap-2">
        <span style={{ fontSize: "1.1rem" }}>🎮</span>
        <p className="text-sm font-semibold" style={{ color: "#7c6dff" }}>PSN Trophy Sync</p>
      </div>

      {/* Current linked title */}
      {currentPsnId && (
        <p className="text-xs" style={{ color: "#4a4a6a" }}>
          Linked: <span style={{ color: "#e8e8f0" }}>{currentPsnId}</span>
        </p>
      )}

      {/* Search */}
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="ค้นหาจาก PSN library..."
          className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
          style={{ backgroundColor: "#08080f", border: "1px solid #1e1e35", color: "#e8e8f0" }}
          onFocus={(e) => (e.target.style.borderColor = "#7c6dff")}
          onBlur={(e) => (e.target.style.borderColor = "#1e1e35")}
        />
        <button onClick={handleSearch} disabled={searching || !query}
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: "#7c6dff22", color: "#7c6dff", border: "1px solid #7c6dff40",
            opacity: searching || !query ? 0.5 : 1 }}>
          {searching ? "..." : "Search"}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="flex flex-col gap-1 max-h-64 overflow-y-auto rounded-lg"
          style={{ border: "1px solid #1e1e35" }}>
          {results.map((t) => (
            <button key={t.id} type="button"
              onClick={() => { setSelectedId(t.id); setPsnResults([]); setQuery(t.name); }}
              className="flex items-center gap-3 px-3 py-2.5 text-left transition-all"
              style={{
                backgroundColor: selectedId === t.id ? "#7c6dff15" : "transparent",
                borderLeft: selectedId === t.id ? "2px solid #7c6dff" : "2px solid transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e1e35")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = selectedId === t.id ? "#7c6dff15" : "transparent")}>
              {t.icon ? (
                <div className="relative shrink-0 w-9 h-9 rounded overflow-hidden">
                  <Image src={t.icon} alt={t.name} fill style={{ objectFit: "cover" }} unoptimized />
                </div>
              ) : (
                <div className="shrink-0 w-9 h-9 rounded flex items-center justify-center text-sm"
                  style={{ backgroundColor: "#1e1e35" }}>🏆</div>
              )}
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs font-medium truncate" style={{ color: "#e8e8f0" }}>{t.name}</span>
                <span className="text-xs" style={{ color: "#4a4a6a" }}>{t.platform} · {t.id}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Manual ID input */}
      <div className="flex flex-col gap-1">
        <label className="text-xs" style={{ color: "#4a4a6a" }}>PSN Title ID (NPWR...)</label>
        <input
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          placeholder="NPWR12345_00"
          className="rounded-lg px-3 py-2 text-sm outline-none font-mono"
          style={{ backgroundColor: "#08080f", border: "1px solid #1e1e35", color: "#e8e8f0" }}
          onFocus={(e) => (e.target.style.borderColor = "#7c6dff")}
          onBlur={(e) => (e.target.style.borderColor = "#1e1e35")}
        />
      </div>

      {/* Sync button */}
      <button onClick={handleSync} disabled={syncing || !selectedId}
        className="py-2.5 rounded-lg text-sm font-semibold transition-opacity"
        style={{ backgroundColor: "#7c6dff", color: "#e8e8f0", opacity: syncing || !selectedId ? 0.5 : 1 }}>
        {syncing ? "Syncing trophies..." : "🔄 Sync Trophies from PSN"}
      </button>

      {/* Result */}
      {syncResult && (
        <div className="rounded-lg px-4 py-3 text-sm"
          style={{
            backgroundColor: syncResult.error ? "#ff6b6b10" : "#4fc3f710",
            border: `1px solid ${syncResult.error ? "#ff6b6b30" : "#4fc3f730"}`,
            color: syncResult.error ? "#ff6b6b" : "#4fc3f7",
          }}>
          {syncResult.error
            ? `❌ ${syncResult.error}`
            : `✅ Synced ${syncResult.synced} trophies from PSN`}
        </div>
      )}
    </div>
  );
}
