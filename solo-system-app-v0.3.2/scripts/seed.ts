import { prisma } from "../lib/prisma";

async function main() {
  // Basic Jobs
  const jobs = [
    {
      name: "Destroyer",
      primaryType: "MARTIAL",
      hitDie: 12,
      strBonus: 2,
      agiBonus: 0,
      vitBonus: 1,
      intBonus: 0,
      senseBonus: 0
    },
    {
      name: "Mage",
      primaryType: "CASTER",
      hitDie: 8,
      strBonus: 0,
      agiBonus: 0,
      vitBonus: 0,
      intBonus: 2,
      senseBonus: 1
    },
    {
      name: "Holy Knight",
      primaryType: "HYBRID",
      hitDie: 10,
      strBonus: 1,
      agiBonus: 0,
      vitBonus: 1,
      intBonus: 0,
      senseBonus: 1
    }
  ];

  for (const job of jobs) {
    await prisma.job.upsert({
      where: { name: job.name },
      update: {},
      create: job
    });
  }

  // Basic Backgrounds
  const backgrounds = [
    {
      name: "Gate Refugee",
      description:
        "You grew up in the shadow of Gates, surviving on scraps and instinct. The System is both a terror and a promise."
    },
    {
      name: "Netdiver",
      description:
        "You lived in the networks between worlds, digging for System exploits and buried data."
    },
    {
      name: "Guild Trainee",
      description:
        "You trained in a formal Guild before your Awakening, learning discipline and basic combat protocol."
    }
  ];

  for (const bg of backgrounds) {
    await prisma.background.upsert({
      where: { name: bg.name },
      update: {},
      create: bg
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


  // Monarch Aspects
  const aspects = [
    {
      name: "Shadow",
      description: "Dominion over darkness, stealth, and unseen strikes."
    },
    {
      name: "White Flame",
      description: "Purifying fire that burns both body and soul."
    },
    {
      name: "Frost",
      description: "Cold that slows time and stills motion."
    },
    {
      name: "Beast",
      description: "Primal ferocity and predatory instinct."
    },
    {
      name: "Void",
      description: "Space between moments, consuming all things."
    }
  ];

  for (const aspect of aspects) {
    await prisma.monarchAspect.upsert({
      where: { name: aspect.name },
      update: {},
      create: aspect
    });
  }
