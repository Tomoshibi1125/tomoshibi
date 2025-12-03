import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const character = await prisma.character.findUnique({
    where: { id },
    include: { job: true }
  });

  if (!character) {
    return NextResponse.json({ error: "Character not found." }, { status: 404 });
  }

  if (character.level >= 20) {
    return NextResponse.json(
      { error: "Maximum level reached." },
      { status: 400 }
    );
  }

  const newLevel = character.level + 1;
  const vitMod = Math.floor((character.vit - 10) / 2);
  const avgDie = Math.floor(character.job.hitDie / 2) + 1;
  const hpIncrease = Math.max(1, avgDie + vitMod);
  const mpIncrease = 10;

  const updated = await prisma.character.update({
    where: { id },
    data: {
      level: newLevel,
      hpMax: character.hpMax + hpIncrease,
      hpCurrent: character.hpCurrent + hpIncrease,
      mpMax: character.mpMax + mpIncrease,
      mpCurrent: character.mpCurrent + mpIncrease,
      statPoints: character.statPoints + 3
    }
  });

  return NextResponse.json({
    id: updated.id,
    level: updated.level,
    hpMax: updated.hpMax,
    mpMax: updated.mpMax,
    statPoints: updated.statPoints
  });
}
