import { NextResponse } from "next/server";

type LootBody = {
  level: number;
  mode: "NORMAL" | "BOOSTED";
  roll: number;
};

export async function POST(req: Request) {
  const body = (await req.json()) as LootBody;
  const { level, mode, roll } = body;

  if (!roll || roll < 1 || roll > 100) {
    return NextResponse.json({ error: "Roll must be between 1 and 100." }, { status: 400 });
  }

  const effectiveRoll = mode === "BOOSTED" ? Math.min(100, roll + 10) : roll;

  let tier: "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY" = "COMMON";
  if (effectiveRoll >= 90) tier = "LEGENDARY";
  else if (effectiveRoll >= 75) tier = "EPIC";
  else if (effectiveRoll >= 55) tier = "RARE";
  else if (effectiveRoll >= 35) tier = "UNCOMMON";

  const baseName = {
    COMMON: "Dim Gate Shard",
    UNCOMMON: "Attuned Gate Fragment",
    RARE: "Awakened Core",
    EPIC: "Sovereign Relic",
    LEGENDARY: "Architect's Keystone"
  }[tier];

  const item = {
    name: `${baseName} (Lv ${level})`,
    description:
      "A System-forged artifact whose properties scale with the Hunter's level. Use your table's loot rules to translate this into a concrete weapon, armor, or runestone.",
    type: tier === "COMMON" || tier === "UNCOMMON" ? "MATERIAL" : "ACCESSORY"
  };

  return NextResponse.json({
    tier,
    item
  });
}
