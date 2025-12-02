import { prisma } from "@/lib/prisma";
import { DiceRoller3D } from "@/components/dice/DiceRoller3D";
import { LevelUpControls } from "@/components/character/LevelUpControls";
import { StatPointAllocator } from "@/components/character/StatPointAllocator";
import { LootRoller } from "@/components/loot/LootRoller";

type Props = {
  params: { id: string };
};

export default async function CharacterSheetPage({ params }: Props) {
  const id = params.id;

  const character = await prisma.character.findUnique({
    where: { id },
    include: {
      job: true,
      background: true,
      abilities: { include: { ability: true } },
      runestones: { include: { runestone: { include: { ability: true } } } },
      items: { include: { item: true } },
      monarchs: { include: { aspect: true } },
      sovereign: true
    }
  });

  if (!character) {
    return (
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Hunter Sheet</h1>
        <p className="text-sm text-slate-400">Character not found.</p>
      </div>
    );
  }

  const derived = {
    profBonus: 2 + Math.floor((character.level - 1) / 4),
    strMod: Math.floor((character.str - 10) / 2),
    agiMod: Math.floor((character.agi - 10) / 2),
    vitMod: Math.floor((character.vit - 10) / 2),
    intMod: Math.floor((character.intStat - 10) / 2),
    senseMod: Math.floor((character.sense - 10) / 2)
  };

  const ac = 10 + derived.agiMod;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{character.name}</h1>
          <p className="text-xs text-slate-400">
            Lv {character.level} · {character.job.name}{" "}
            {character.background ? <>· {character.background.name}</> : null}
          </p>
          {character.isSovereign && character.sovereign && (
            <p className="mt-1 text-xs text-systemAccent">
              Sovereign: {character.sovereign.name}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <div className="rounded-md border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs">
            <div className="text-[10px] uppercase text-slate-400">HP</div>
            <div className="text-sm font-semibold">
              {character.hpCurrent} / {character.hpMax}
            </div>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs">
            <div className="text-[10px] uppercase text-slate-400">MP</div>
            <div className="text-sm font-semibold">
              {character.mpCurrent} / {character.mpMax}
            </div>
          </div>
          <div className="rounded-md border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs">
            <div className="text-[10px] uppercase text-slate-400">AC</div>
            <div className="text-sm font-semibold">{ac}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <section className="space-y-3 md:col-span-1">
          <LevelUpControls characterId={character.id} level={character.level} />
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs">
            <div className="text-[11px] font-semibold text-systemAccent">Stats</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                ["STR", character.str, derived.strMod],
                ["AGI", character.agi, derived.agiMod],
                ["VIT", character.vit, derived.vitMod],
                ["INT", character.intStat, derived.intMod],
                ["SENSE", character.sense, derived.senseMod]
              ].map(([label, val, mod]) => (
                <div
                  key={label as string}
                  className="flex flex-col rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1.5"
                >
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{label}</span>
                    <span>
                      {Number(mod) >= 0 ? "+" : ""}
                      {mod}
                    </span>
                  </div>
                  <div className="text-sm font-semibold">{val}</div>
                </div>
              ))}
            </div>
            <StatPointAllocator
              characterId={character.id}
              statPoints={character.statPoints}
              stats={{
                STR: character.str,
                AGI: character.agi,
                VIT: character.vit,
                INT: character.intStat,
                SENSE: character.sense
              }}
            />
          </div>

          <DiceRoller3D />
        </section>

        <section className="space-y-3 md:col-span-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold text-systemAccent">
                Abilities
              </div>
            </div>
            {character.abilities.length === 0 ? (
              <p className="mt-2 text-[11px] text-slate-400">
                No abilities assigned yet. Level up or use grimoires/manuals to learn
                abilities.
              </p>
            ) : (
              <ul className="mt-2 space-y-1">
                {character.abilities.map((ca) => (
                  <li
                    key={ca.id}
                    className="rounded-md border border-slate-800 bg-slate-900/70 px-2 py-1.5"
                  >
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold text-slate-100">
                        {ca.ability.name}
                      </span>
                      <span className="text-slate-400">
                        Tier {ca.ability.tier} · {ca.ability.kind.toLowerCase()}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-300">
                      {ca.ability.description}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs">
            <div className="text-[11px] font-semibold text-systemAccent">
              Inventory & Runestones
            </div>
            <div className="mt-2 grid gap-3 md:grid-cols-2">
              <div>
                <div className="text-[11px] text-slate-400">Items</div>
                {character.items.length === 0 ? (
                  <p className="mt-1 text-[11px] text-slate-500">Empty.</p>
                ) : (
                  <ul className="mt-1 space-y-1">
                    {character.items.map((ci) => (
                      <li
                        key={ci.id}
                        className="rounded-md border border-slate-800 bg-slate-900/70 px-2 py-1.5"
                      >
                        <div className="flex justify-between">
                          <span className="text-[11px] font-semibold">
                            {ci.item.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            x{ci.quantity}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-300">
                          {ci.item.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Runestones</div>
                {character.runestones.length === 0 ? (
                  <p className="mt-1 text-[11px] text-slate-500">None equipped.</p>
                ) : (
                  <ul className="mt-1 space-y-1">
                    {character.runestones.map((cr) => (
                      <li
                        key={cr.id}
                        className="rounded-md border border-slate-800 bg-slate-900/70 px-2 py-1.5"
                      >
                        <div className="flex justify-between text-[11px]">
                          <span className="font-semibold">
                            {cr.runestone.name}
                          </span>
                          <span className="text-slate-400">
                            Tier {cr.runestone.tier.toLowerCase()}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-300">
                          {cr.runestone.description}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          Ability: {cr.runestone.ability.name}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs">
            <div className="text-[11px] font-semibold text-systemAccent">
              Monarch Aspects & Sovereign
            </div>
            {character.monarchs.length === 0 ? (
              <p className="mt-2 text-[11px] text-slate-400">
                No Monarch Aspects bound yet. When your DM flags a Monarch quest complete,
                the System will offer Aspects here.
              </p>
            ) : (
              <ul className="mt-2 space-y-1">
                {character.monarchs.map((cm) => (
                  <li
                    key={cm.id}
                    className="rounded-md border border-slate-800 bg-slate-900/70 px-2 py-1.5"
                  >
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold">
                        {cm.aspect.name}
                      </span>
                      <span className="text-slate-400">Rank {cm.rank}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-300">
                      {cm.aspect.description}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            {character.isSovereign && character.sovereign && (
              <p className="mt-2 text-[11px] text-systemAccentSoft">
                Sovereign fusion complete. Detailed Authority track will be added in a
                future update of the UI.
              </p>
            )}
          </div>

          <LootRoller level={character.level} />
        </section>
      </div>
    </div>
  );
}
