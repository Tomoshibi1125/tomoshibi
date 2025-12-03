import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type CreateBody = {
  name: string;
  jobId: string;
  backgroundId?: string | null;
  stats: {
    STR: number | null;
    AGI: number | null;
    VIT: number | null;
    INT: number | null;
    SENSE: number | null;
  };
};

export async function POST(req: Request) {
  const body = (await req.json()) as CreateBody;

  if (!body.name || !body.jobId) {
    return NextResponse.json(
      { error: "Name and Job are required." },
      { status: 400 }
    );
  }

  const job = await prisma.job.findUnique({ where: { id: body.jobId } });
  if (!job) {
    return NextResponse.json({ error: "Invalid Job." }, { status: 400 });
  }

  const str = body.stats.STR ?? 10;
  const agi = body.stats.AGI ?? 10;
  const vit = body.stats.VIT ?? 10;
  const intStat = body.stats.INT ?? 10;
  const sense = body.stats.SENSE ?? 10;

  const vitMod = Math.floor((vit - 10) / 2);
  const baseHp = job.hitDie + max0(vitMod);
  const baseMp = 20 + Math.floor(intStat / 2);

  function max0(n: number) {
    return n < 0 ? 0 : n;
  }

  const created = await prisma.character.create({
    data: {
      name: body.name,
      jobId: body.jobId,
      backgroundId: body.backgroundId ?? null,
      level: 1,
      str,
      agi,
      vit,
      intStat,
      sense,
      hpMax: baseHp,
      hpCurrent: baseHp,
      mpMax: baseMp,
      mpCurrent: baseMp
    }
  });

  return NextResponse.json({ id: created.id });
}
