"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/admin",          label: "Dashboard" },
  { href: "/admin/games/new", label: "Add Game" },
  { href: "/admin/journal",  label: "Journal" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div
      className="rounded-xl p-4 flex items-center justify-between flex-wrap gap-3"
      style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35" }}
    >
      <div className="flex items-center gap-1 flex-wrap">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: isActive ? "#7c6dff22" : "transparent",
                color: isActive ? "#7c6dff" : "#4a4a6a",
                border: `1px solid ${isActive ? "#7c6dff40" : "transparent"}`,
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-xs"
          style={{ color: "#4a4a6a" }}
          target="_blank"
        >
          ↗ View Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="text-xs px-3 py-1.5 rounded-lg transition-all"
          style={{ color: "#ff6b6b", border: "1px solid #ff6b6b30", backgroundColor: "transparent" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
