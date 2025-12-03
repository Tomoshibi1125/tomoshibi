"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type StatKey = "STR" | "AGI" | "VIT" | "INT" | "SENSE";

type Props = {
  characterId: string;
  statPoints: number;
  stats: Record<StatKey, number>;
};

const STAT_KEYS: StatKey[] = ["STR", "AGI", "VIT", "INT", "SENSE"];

export function StatPointAllocator({ characterId, statPoints, stats }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const spendPoint = async (stat: StatKey) => {
    if (statPoints <= 0 || pending) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/characters/${characterId}/adjust-stat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stat })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as any).error || "Failed to spend stat point.");
      }
      router.refresh();
    } catch (e: any) {
      setError(e.message || "Failed to spend stat point.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mt-3 rounded-md border border-slate-800 bg-slate-950/70 p-2 text-[11px]">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-systemAccent">Stat Growth</span>
        <span className="text-slate-300">
          Points:{" "}
          <span className="font-semibold text-systemAccentSoft">{statPoints}</span>
        </span>
      </div>
      <p className="mt-1 text-[10px] text-slate-500">
        Each level grants points you can invest into STR, AGI, VIT, INT, or SENSE, echoing
        Solo-style rapid growth.
      </p>
      <div className="mt-2 grid grid-cols-2 gap-1">
        {STAT_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => spendPoint(key)}
            disabled={statPoints <= 0 || pending}
            className="flex items-center justify-between rounded border border-slate-800 bg-slate-900/80 px-2 py-1 text-[11px] hover:border-systemAccent"
          >
            <span>{key}</span>
            <span className="text-slate-300">
              {stats[key]} <span className="ml-1 text-systemAccent">+1</span>
            </span>
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-[10px] text-systemDanger">
          {error}
        </p>
      )}
    </div>
  );
}
