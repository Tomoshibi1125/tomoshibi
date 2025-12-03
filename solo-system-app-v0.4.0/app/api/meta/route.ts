import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const jobs = await prisma.job.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true }
  });

  const backgrounds = await prisma.background.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true }
  });

  return NextResponse.json({ jobs, backgrounds });
}
