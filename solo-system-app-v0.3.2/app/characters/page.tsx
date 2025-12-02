import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CharactersPage() {
  const characters = await prisma.character.findMany({
    include: { job: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Hunters</h1>
        <Link href="/characters/new">
          <button>Create New</button>
        </Link>
      </div>

      {characters.length === 0 ? (
        <p className="text-sm text-slate-400">
          No Hunters detected. Run the Awakening Protocol to create your first character.
        </p>
      ) : (
        <ul className="space-y-2">
          {characters.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm"
            >
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-slate-400">
                  Lv {c.level} · {c.job.name}
                </div>
              </div>
              <Link
                href={`/characters/${c.id}`}
                className="text-xs font-semibold text-systemAccent hover:underline"
              >
                OPEN
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
