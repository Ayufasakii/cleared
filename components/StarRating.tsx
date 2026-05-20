export default function StarRating({ value, max = 5 }: { value: number | null; max?: number }) {
  if (value === null) return <span style={{ color: "#4a4a6a" }}>—</span>;
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          style={{ color: i < value ? "#7c6dff" : "#1e1e35", fontSize: "0.75rem" }}
        >
          ★
        </span>
      ))}
    </span>
  );
}
