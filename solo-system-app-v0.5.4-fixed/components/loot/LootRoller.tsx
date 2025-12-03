"use client";

import { useState } from "react";
import { DiceRoller3D } from "@/components/dice/DiceRoller3D";

type LootResult = {
  tier: string;
  item: {
    name: string;
    description: string;
    type: string;
  };
};

export function LootRoller({ level }: { level: number }) {
  const [mode, setMode] = useState<"NORMAL" | "BOOSTED">("NORMAL");
  const [rollValue, setRollValue] = useState<number | null>(null);
  const [result, setResult] = useState<LootResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateLoot = async () => {
    if (!rollValue) {
      setError("Roll a d100 or enter a value first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/loot/roll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, mode, roll: rollValue })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as any).error || "Loot generation failed.");
      }
      const data = (await res.json()) as LootResult;
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Loot generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-systemAccent">Loot Roll</span>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as "NORMAL" | "BOOSTED")}
          className="rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-[11px]"
        >
          <option value="NORMAL">Normal</option>
          <option value="BOOSTED">Boosted</option>
        </select>
      </div>
      <p className="text-[11px] text-slate-400">
        Your DM says "roll for loot". Roll a d100 here or use physical dice and type it in;
        the System will generate an item scaled to your level.
      </p>

      <DiceRoller3D
        sides={100}
        onResult={(v) => {
          setRollValue(v);
        }}
      />
      <p className="text-[11px] text-slate-400">
        Current roll:{" "}
        {rollValue ? (
          <span className="font-semibold text-systemAccentSoft">{rollValue}</span>
        ) : (
          <span className="text-slate-500">none</span>
        )}
      </p>
      <button type="button" onClick={generateLoot} disabled={loading}>
        {loading ? "Generating..." : "Generate Loot"}
      </button>
      {error && <p className="text-[11px] text-systemDanger">{error}</p>}
      {result && (
        <div className="mt-2 rounded-md border border-slate-800 bg-slate-900/80 p-2 text-[11px]">
          <div className="flex justify-between">
            <span className="font-semibold">{result.item.name}</span>
            <span className="text-slate-400">{result.tier}</span>
          </div>
          <p className="mt-1 text-slate-300">{result.item.description}</p>
          <p className="mt-1 text-slate-500">Type: {result.item.type}</p>
        </div>
      )}
    </div>
  );
}
