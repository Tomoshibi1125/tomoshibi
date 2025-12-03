import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_STATS = ["STR", "AGI", "VIT", "INT", "SENSE"] as const;
type StatKey = (typeof VALID_STATS)[number];

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = (await req.json()) as { stat: StatKey };

  const { stat } = body;

  if (!VALID_STATS.includes(stat)) {
    return NextResponse.json({ error: "Invalid stat." }, { status: 400 });
  }

  const character = await prisma.character.findUnique({ where: { id } });
  if (!character) {
    return NextResponse.json({ error: "Character not found." }, { status: 404 });
  }

  if (character.statPoints <= 0) {
    return NextResponse.json(
      { error: "No stat points available." },
      { status: 400 }
    );
  }

  const data: any = { statPoints: character.statPoints - 1 };
  if (stat === "STR") data.str = character.str + 1;
  if (stat === "AGI") data.agi = character.agi + 1;
  if (stat === "VIT") data.vit = character.vit + 1;
  if (stat === "INT") data.intStat = character.intStat + 1;
  if (stat === "SENSE") data.sense = character.sense + 1;

  const updated = await prisma.character.update({
    where: { id },
    data
  });

  return NextResponse.json({
    id: updated.id,
    statPoints: updated.statPoints,
    str: updated.str,
    agi: updated.agi,
    vit: updated.vit,
    intStat: updated.intStat,
    sense: updated.sense
  });
}
