"use client";

import Link from "next/link";

const actions = [
  { href: "/admin/games/new", label: "Add Game", icon: "➕", desc: "Add a new game manually or sync from PSN" },
  { href: "/admin/journal",   label: "Journal",  icon: "📓", desc: "Write a new journal entry" },
];

export default function AdminActionCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {actions.map((a) => (
        <Link key={a.href} href={a.href}>
          <div
            className="rounded-xl p-5 flex flex-col gap-2 cursor-pointer transition-all"
            style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "#7c6dff")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "#1e1e35")}
          >
            <span style={{ fontSize: "1.5rem" }}>{a.icon}</span>
            <p className="font-semibold" style={{ color: "#e8e8f0" }}>{a.label}</p>
            <p className="text-xs" style={{ color: "#4a4a6a" }}>{a.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
