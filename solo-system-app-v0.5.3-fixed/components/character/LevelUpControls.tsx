"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  characterId: string;
  level: number;
};

export function LevelUpControls({ characterId, level }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLevelUp = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/characters/${characterId}/level-up`, {
          method: "POST"
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error((data as any).error || "Level up failed.");
        }
        router.refresh();
      } catch (e: any) {
        setError(e.message || "Level up failed.");
      }
    });
  };

  return (
    <div className="rounded-md border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-[10px] uppercase text-slate-400">Level</div>
          <div className="text-sm font-semibold">Lv {level}</div>
        </div>
        <button
          type="button"
          onClick={handleLevelUp}
          disabled={isPending}
          className="text-xs"
        >
          {isPending ? "Processing..." : "Level Up"}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-[10px] text-systemDanger">
          {error}
        </p>
      )}
      <p className="mt-1 text-[10px] text-slate-500">
        Each level grants Solo-style stat points, HP/MP growth, and prepares you for Monarch
        and Sovereign evolutions. Your DM decides when you can level up (milestone-style).
      </p>
    </div>
  );
}
