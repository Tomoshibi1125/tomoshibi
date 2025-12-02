import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, jobId, backgroundId, stats } = body as {
    name: string;
    jobId: string;
    backgroundId?: string | null;
    stats: { STR: number; AGI: number; VIT: number; INT: number; SENSE: number };
  };

  if (!name || !jobId || !stats) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    return NextResponse.json({ error: "Invalid job." }, { status: 400 });
  }

  const baseHp = job.hitDie + Math.floor((stats.VIT - 10) / 2);
  const baseMp = 10; // simple placeholder; can be refined by job

  const character = await prisma.character.create({
    data: {
      name,
      jobId,
      backgroundId: backgroundId || null,
      level: 1,
      xp: 0,
      str: stats.STR + job.strBonus,
      agi: stats.AGI + job.agiBonus,
      vit: stats.VIT + job.vitBonus,
      intStat: stats.INT + job.intBonus,
      sense: stats.SENSE + job.senseBonus,
      hpMax: baseHp,
      hpCurrent: baseHp,
      mpMax: baseMp,
      mpCurrent: baseMp
    }
  });

  return NextResponse.json({ id: character.id });
}
