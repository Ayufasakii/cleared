import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditGameForm from "./EditGameForm";
import ManageTrophies from "./ManageTrophies";
import PsnSync from "./PsnSync";

export default async function AdminGameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const game = await prisma.game.findUnique({
    where: { id },
    include: { trophies: { orderBy: [{ grade: "asc" }, { earned: "desc" }] } },
  });
  if (!game) notFound();

  return (
    <div className="flex flex-col gap-10 max-w-2xl">
      <EditGameForm game={game} />
      {(game.platform === "PS5" || game.platform === "PS4") && (
        <PsnSync
          gameId={id}
          platform={game.platform}
          currentPsnId={game.psnGameId}
        />
      )}
      <ManageTrophies gameId={id} trophies={game.trophies} />
    </div>
  );
}
