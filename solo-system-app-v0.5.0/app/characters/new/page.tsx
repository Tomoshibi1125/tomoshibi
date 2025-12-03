"use client";

import { useEffect, useState } from "react";

type Step = 1 | 2 | 3 | 4;

type RolledStat = {
  roll: number[];
  total: number;
};

const roll4d6DropLowest = (): RolledStat => {
  const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
  const sorted = [...rolls].sort((a, b) => a - b);
  const total = sorted.slice(1).reduce((a, b) => a + b, 0);
  return { roll: rolls, total };
};

const STAT_KEYS = ["STR", "AGI", "VIT", "INT", "SENSE"] as const;
type StatKey = (typeof STAT_KEYS)[number];

type JobMeta = { id: string; name: string };
type BackgroundMeta = { id: string; name: string };

export default function NewCharacterPage() {
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [jobId, setJobId] = useState<string>("");
  const [backgroundId, setBackgroundId] = useState<string>("");
  const [rolled, setRolled] = useState<RolledStat[]>([]);
  const [assigned, setAssigned] = useState<Record<StatKey, number | null>>({
    STR: null,
    AGI: null,
    VIT: null,
    INT: null,
    SENSE: null
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobMeta[] | null>(null);
  const [backgrounds, setBackgrounds] = useState<BackgroundMeta[] | null>(null);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const res = await fetch("/api/meta");
        if (!res.ok) return;
        const data = (await res.json()) as { jobs: JobMeta[]; backgrounds: BackgroundMeta[] };
        setJobs(data.jobs);
        setBackgrounds(data.backgrounds);
      } catch (e) {
        console.error(e);
      }
    };
    loadMeta();
  }, []);

  const handleRollStats = () => {
    const results: RolledStat[] = [];
    for (let i = 0; i < 5; i++) {
      results.push(roll4d6DropLowest());
    }
    setRolled(results);
    setAssigned({
      STR: null,
      AGI: null,
      VIT: null,
      INT: null,
      SENSE: null
    });
  };

  const handleAssign = (stat: StatKey, rollIndex: number) => {
    if (rollIndex < 0 || rollIndex >= rolled.length) return;
    const total = rolled[rollIndex].total;
    setAssigned((prev) => ({ ...prev, [stat]: total }));
  };

  const canProceedIdentity = name.trim().length > 0;
  const canProceedJB = !!jobId;
  const allAssigned = STAT_KEYS.every((k) => assigned[k] !== null);

  const handleCreate = async () => {
    if (!name || !jobId || !allAssigned) return;
    setError(null);
    setCreating(true);
    try {
      const res = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          jobId,
          backgroundId: backgroundId || null,
          stats: {
            STR: assigned.STR,
            AGI: assigned.AGI,
            VIT: assigned.VIT,
            INT: assigned.INT,
            SENSE: assigned.SENSE
          }
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as any).error || "Failed to create character");
      }
      const data = (await res.json()) as { id: string };
      window.location.href = `/characters/${data.id}`;
    } catch (e: any) {
      setError(e.message || "Failed to create character");
    } finally {
      setCreating(false);
    }
  };

  const goNext = () => {
    if (step === 1 && !canProceedIdentity) return;
    if (step === 2 && !canProceedJB) return;
    if (step === 3 && !allAssigned) return;
    const nextStep = (step + 1) as Step;
    setStep(nextStep > 4 ? 4 : nextStep);
  };

  const goBack = () => {
    const prevStep = (step - 1) as Step;
    setStep(prevStep < 1 ? 1 : prevStep);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Awakening Protocol</h1>
      <p className="text-xs text-slate-400">
        Guided character creation. Stats are rolled, then Jobs, Backgrounds, and initial
        System gifts are selected.
      </p>

      <div className="flex gap-2 text-xs">
        {["Identity", "Job & Background", "Stats", "Confirm"].map((label, idx) => {
          const current = (idx + 1) as Step;
          const active = current === step;
          return (
            <div
              key={label}
              className={`flex-1 rounded-full border px-2 py-1 text-center ${
                active
                  ? "border-systemAccent bg-slate-900 text-systemAccentSoft"
                  : "border-slate-800 text-slate-400"
              }`}
            >
              {label}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm">
        {step === 1 && (
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs text-slate-300">Name</span>
              <input
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs text-slate-100 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your Hunter's name"
              />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <div className="mb-1 text-xs text-slate-300">Job</div>
                {jobs ? (
                  <select
                    className="w-full rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs"
                    value={jobId}
                    onChange={(e) => setJobId(e.target.value)}
                  >
                    <option value="">Select Job</option>
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-slate-500">Loading Jobs...</p>
                )}
              </div>
              <div>
                <div className="mb-1 text-xs text-slate-300">Background</div>
                {backgrounds ? (
                  <select
                    className="w-full rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs"
                    value={backgroundId}
                    onChange={(e) => setBackgroundId(e.target.value)}
                  >
                    <option value="">None / Decide later</option>
                    {backgrounds.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-slate-500">Loading Backgrounds...</p>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <button type="button" onClick={handleRollStats}>
              Roll 4d6 drop lowest (5 times)
            </button>
            {rolled.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-systemAccent">
                    Rolled Values
                  </div>
                  {rolled.map((r, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/80 px-2 py-1"
                    >
                      <span className="text-[11px] text-slate-400">
                        Roll {idx + 1}: [{r.roll.join(", ")}]
                      </span>
                      <span className="text-xs font-semibold text-systemAccentSoft">
                        {r.total}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-systemAccent">
                    Assign to Stats
                  </div>
                  {STAT_KEYS.map((k) => (
                    <div key={k} className="flex items-center justify-between gap-2">
                      <span className="w-16 text-xs text-slate-300">{k}</span>
                      <select
                        className="flex-1 rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs"
                        value={assigned[k] ?? ""}
                        onChange={(e) =>
                          handleAssign(
                            k,
                            e.target.selectedIndex > 0 ? e.target.selectedIndex - 1 : -1
                          )
                        }
                      >
                        <option value="">Select roll</option>
                        {rolled.map((r, idx) => (
                          <option key={idx} value={r.total}>
                            {r.total} (#{idx + 1})
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Click the roll button to generate 5 stat values using 4d6 drop lowest.
              </p>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3 text-xs">
            <div className="rounded-md border border-slate-800 bg-slate-900/80 p-3">
              <div className="font-semibold text-systemAccent">Summary</div>
              <div className="mt-2 space-y-1">
                <div>
                  <span className="text-slate-400">Name: </span>
                  <span className="font-medium">{name || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-400">Job: </span>
                  <span className="font-medium">{jobId || "—"}</span>
                </div>
                <div>
                  <span className="text-slate-400">Background: </span>
                  <span className="font-medium">
                    {backgroundId || "None / Later"}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-slate-400">Stats: </span>
                  <div className="mt-1 grid grid-cols-2 gap-1">
                    {STAT_KEYS.map((k) => (
                      <div key={k} className="flex justify-between">
                        <span>{k}</span>
                        <span className="font-semibold">
                          {assigned[k] ?? "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              When you confirm, the System will create your Hunter with level 1 HP/MP and
              Solo-style stat points starting at the next level.
            </p>
          </div>
        )}

        {error && (
          <p className="mt-3 text-xs text-systemDanger">
            {error}
          </p>
        )}

        <div className="mt-4 flex justify-between">
          <button disabled={step === 1} onClick={goBack} type="button">
            Back
          </button>
          {step < 4 && (
            <button type="button" onClick={goNext}>
              Next
            </button>
          )}
          {step === 4 && (
            <button
              type="button"
              onClick={handleCreate}
              disabled={creating || !name || !jobId || !allAssigned}
            >
              {creating ? "Creating..." : "Confirm & Create"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
