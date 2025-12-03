"use client";

import { useState } from "react";

type DiceRollerProps = {
  onResult?: (value: number) => void;
  sides?: number;
};

export function DiceRoller3D({ onResult, sides = 20 }: DiceRollerProps) {
  const [value, setValue] = useState<number | null>(null);
  const [manual, setManual] = useState("");

  const roll = () => {
    const v = Math.floor(Math.random() * sides) + 1;
    setValue(v);
    if (onResult) onResult(v);
  };

  const submitManual = () => {
    const n = parseInt(manual, 10);
    if (!Number.isNaN(n) && n >= 1 && n <= sides) {
      setValue(n);
      if (onResult) onResult(n);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-systemAccent">
          System Die (d{sides})
        </span>
        <button type="button" onClick={roll}>
          Roll
        </button>
      </div>
      <div className="text-slate-300">
        {value === null ? (
          <span className="text-slate-500">No roll yet.</span>
        ) : (
          <span>
            Result:{" "}
            <span className="font-bold text-systemAccentSoft">{value}</span>
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          placeholder="Manual value"
          className="flex-1 rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs text-slate-100 outline-none"
        />
        <button type="button" onClick={submitManual}>
          Set
        </button>
      </div>
      <p className="text-[10px] text-slate-500">
        Visual 3D dice will live here later: an obsidian System die with glowing glyphs.
        For now, this widget provides functional random rolls and manual entry.
      </p>
    </div>
  );
}
