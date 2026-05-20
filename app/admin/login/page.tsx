"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      username: form.get("username"),
      password: form.get("password"),
      redirect: false,
    });

    if (result?.ok) {
      router.push("/admin");
    } else {
      setError("Invalid username or password");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#08080f" }}>
      <div
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col gap-6"
        style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35" }}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-widest" style={{ color: "#7c6dff" }}>
            CLEARED
          </h1>
          <p className="text-sm mt-1" style={{ color: "#4a4a6a" }}>
            Admin access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors"
            style={{
              backgroundColor: "#08080f",
              border: "1px solid #1e1e35",
              color: "#e8e8f0",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#7c6dff")}
            onBlur={(e) => (e.target.style.borderColor = "#1e1e35")}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors"
            style={{
              backgroundColor: "#08080f",
              border: "1px solid #1e1e35",
              color: "#e8e8f0",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#7c6dff")}
            onBlur={(e) => (e.target.style.borderColor = "#1e1e35")}
          />

          {error && (
            <p className="text-xs text-center" style={{ color: "#ff6b6b" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-3 text-sm font-semibold transition-opacity"
            style={{
              backgroundColor: "#7c6dff",
              color: "#e8e8f0",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
