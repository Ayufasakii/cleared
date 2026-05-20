"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Games" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        borderBottom: "1px solid #1e1e35",
        backgroundColor: "#08080f",
      }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-lg tracking-widest"
          style={{ color: "#7c6dff", letterSpacing: "0.2em" }}
        >
          CLEARED
        </Link>

        <div className="flex items-center gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors duration-150"
                style={{
                  color: isActive ? "#e8e8f0" : "#4a4a6a",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
