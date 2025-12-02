import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { level, mode, roll } = body as {
    level: number;
    mode: "NORMAL" | "BOOSTED";
    roll: number;
  };

  if (!roll || roll < 1 || roll > 100) {
    return NextResponse.json({ error: "Invalid roll." }, { status: 400 });
  }

  let tier: "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY" = "COMMON";

  const adjusted = mode === "BOOSTED" ? Math.min(100, roll + 10) : roll;

  if (adjusted >= 95) tier = "LEGENDARY";
  else if (adjusted >= 80) tier = "EPIC";
  else if (adjusted >= 60) tier = "RARE";
  else if (adjusted >= 35) tier = "UNCOMMON";
  else tier = "COMMON";

  const name = `${tier} Debug Artifact (Lv ${level})`;
  const description =
    "Placeholder loot item. In the full engine, this would be generated from the item, affix, and runestone tables based on tier, level, and dungeon tags.";

  return NextResponse.json({
    tier,
    item: {
      name,
      description,
      type: "WEAPON"
    }
  });
}
