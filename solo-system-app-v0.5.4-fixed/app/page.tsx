export default function HomePage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold tracking-tight">Awakening Protocol</h1>
        <p className="mt-2 text-sm text-slate-300">
          This interface syncs with the Architect&apos;s System to track your Hunters, Monarch
          Aspects, and Sovereign evolutions. Create a character, roll stats, and let the
          System handle the rest.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <a
          href="/characters/new"
          className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-4 hover:border-systemAccent hover:bg-slate-900/70"
        >
          <span className="text-sm font-semibold text-systemAccent">New Hunter</span>
          <span className="mt-1 text-xs text-slate-300">
            Run the Awakening Protocol: roll stats, select Job & Background, and bind your
            first System gifts.
          </span>
        </a>

        <a
          href="/characters"
          className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-4 hover:border-systemAccent hover:bg-slate-900/70"
        >
          <span className="text-sm font-semibold text-systemAccent">Hunter Roster</span>
          <span className="mt-1 text-xs text-slate-300">
            Open existing Hunters, manage level-ups, loot, runestones, and Sovereign
            progressions.
          </span>
        </a>
      </section>
    </div>
  );
}
