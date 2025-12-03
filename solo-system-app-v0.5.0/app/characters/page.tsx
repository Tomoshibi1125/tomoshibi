import { prisma } from "@/lib/prisma";

export default async function CharactersPage() {
  const characters = await prisma.character.findMany({
    orderBy: { createdAt: "desc" },
    include: { job: true, background: true }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Hunter Roster</h1>
          <p className="text-xs text-slate-400">
            All Hunters registered with the System.
          </p>
        </div>
        <a href="/characters/new">
          <button type="button">New Hunter</button>
        </a>
      </div>

      {characters.length === 0 ? (
        <p className="text-sm text-slate-400">
          No Hunters yet. Run the Awakening Protocol to create your first character.
        </p>
      ) : (
        <ul className="space-y-2">
          {characters.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs"
            >
              <div>
                <div className="font-semibold text-slate-100">{c.name}</div>
                <div className="text-[11px] text-slate-400">
                  Lv {c.level} · {c.job.name}{" "}
                  {c.background ? <>· {c.background.name}</> : null}
                </div>
              </div>
              <a
                href={`/characters/${c.id}`}
                className="text-[11px] text-systemAccent hover:underline"
              >
                Open
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
