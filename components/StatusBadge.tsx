import type { GameStatus } from "@/lib/types";

const config: Record<GameStatus, { label: string; color: string }> = {
  PLAYING:  { label: "Playing",  color: "#4fc3f7" },
  PLATINUM: { label: "Platinum", color: "#7c6dff" },
  DROPPED:  { label: "Dropped",  color: "#4a4a6a" },
};

export default function StatusBadge({ status }: { status: GameStatus }) {
  const { label, color } = config[status];
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{
        color,
        backgroundColor: `${color}18`,
        border: `1px solid ${color}40`,
      }}
    >
      {status === "PLATINUM" && "🏆 "}{label}
    </span>
  );
}
