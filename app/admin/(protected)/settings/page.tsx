"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [npsso, setNpsso] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ hasToken: boolean; updatedAt: string | null } | null>(null);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/psn/settings")
      .then((r) => r.json())
      .then(setStatus);
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/psn/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ npsso }),
    });
    const data = await res.json();
    if (data.ok) {
      setMsg({ type: "ok", text: "NPSSO token saved!" });
      setNpsso("");
      setStatus({ hasToken: true, updatedAt: new Date().toISOString() });
    } else {
      setMsg({ type: "err", text: data.error ?? "Failed" });
    }
    setSaving(false);
  }

  return (
    <div className="max-w-xl flex flex-col gap-8">
      <h2 className="text-lg font-bold" style={{ color: "#e8e8f0" }}>PSN Settings</h2>

      {/* Status */}
      <div className="rounded-xl p-5 flex flex-col gap-3"
        style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35" }}>
        <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a4a6a" }}>
          NPSSO Token Status
        </p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status?.hasToken ? "#4fc3f7" : "#ff6b6b" }} />
          <p className="text-sm" style={{ color: "#e8e8f0" }}>
            {status?.hasToken ? "Token saved" : "Not configured"}
          </p>
          {status?.updatedAt && (
            <span className="text-xs" style={{ color: "#4a4a6a" }}>
              · {new Date(status.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "#4a4a6a" }}>
          NPSSO token หมดอายุประมาณ 2 เดือน ต้อง update ใหม่เมื่อ sync ไม่ได้
        </p>
      </div>

      {/* How to get NPSSO */}
      <div className="rounded-xl p-5 flex flex-col gap-3"
        style={{ backgroundColor: "#0f0f1a", border: "1px solid #7c6dff30" }}>
        <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#7c6dff" }}>
          วิธีได้ NPSSO Token
        </p>
        <ol className="flex flex-col gap-2 text-sm" style={{ color: "#4a4a6a" }}>
          <li>1. เปิด <a href="https://ca.account.sony.com/api/v1/ssocookie" target="_blank"
            className="underline" style={{ color: "#4fc3f7" }}>ca.account.sony.com/api/v1/ssocookie</a></li>
          <li>2. Login ด้วย PSN account</li>
          <li>3. Copy ค่า <code className="px-1 rounded" style={{ backgroundColor: "#1e1e35", color: "#e8e8f0" }}>npsso</code> จาก JSON</li>
          <li>4. วางใน field ด้านล่าง แล้วกด Save</li>
        </ol>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a4a6a" }}>
            NPSSO Token
          </label>
          <input
            value={npsso}
            onChange={(e) => setNpsso(e.target.value)}
            placeholder="วาง NPSSO token ที่นี่..."
            required
            className="rounded-lg px-4 py-3 text-sm outline-none font-mono"
            style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35", color: "#e8e8f0" }}
            onFocus={(e) => (e.target.style.borderColor = "#7c6dff")}
            onBlur={(e) => (e.target.style.borderColor = "#1e1e35")}
          />
        </div>

        {msg && (
          <p className="text-sm" style={{ color: msg.type === "ok" ? "#4fc3f7" : "#ff6b6b" }}>
            {msg.text}
          </p>
        )}

        <button type="submit" disabled={saving || !npsso}
          className="py-3 rounded-xl font-semibold text-sm"
          style={{ backgroundColor: "#7c6dff", color: "#e8e8f0", opacity: saving || !npsso ? 0.5 : 1 }}>
          {saving ? "Saving..." : "Save Token"}
        </button>
      </form>
    </div>
  );
}
