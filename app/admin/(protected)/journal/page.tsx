import { prisma } from "@/lib/prisma";
import JournalForm from "./JournalForm";
import JournalList from "./JournalList";

export default async function AdminJournalPage() {
  const [entries, games] = await Promise.all([
    prisma.journalEntry.findMany({
      orderBy: { date: "desc" },
      include: { game: true, trophies: true },
    }),
    prisma.game.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true } }),
  ]);

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <JournalForm games={games} />
      <JournalList entries={entries} />
    </div>
  );
}
