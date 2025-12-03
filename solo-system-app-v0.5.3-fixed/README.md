# SYSTEM: ARCHITECT (Solo System App)

A Next.js 14 + TypeScript + Prisma + Tailwind character manager inspired by the post-reset
"Solo Leveling" timeline. Hunters (players) create characters, roll stats, select Jobs and
Backgrounds, track Monarch Aspects, and eventually become Sovereigns.

This build is player-facing only. DM tools (encounter builder, CR, etc.) can be added later.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- Postgres (recommended) or SQLite (dev)
- Deployed on Vercel

## Getting Started (Local)

```bash
cp .env.example .env
# For first boot you can use SQLite locally (development only):
# DATABASE_URL="file:./dev.db"

npm install
npx prisma migrate dev --name init
npx ts-node scripts/seed.ts
npm run dev
```

Then open http://localhost:3000.

## Production (Vercel + Supabase / Neon / Other Postgres)

1. Create a Postgres database (Supabase, Neon, Vercel Postgres, etc.).
2. Set `DATABASE_URL` in Vercel Project → Environment Variables.
3. Deploy the project.
4. On your machine, set the same `DATABASE_URL` in `.env` and run:

```bash
npx prisma migrate deploy
npx ts-node scripts/seed.ts
```

Now your live app uses the same database.

## Commands

- `npm run dev` – local dev server
- `npm run build` – production build
- `npm start` – start built app
- `npm run lint` – lint
- `npm run seed` – run the seed script

## License

MIT for code. Game content is original or derived from SRD 5.1 under CC BY 4.0; no paid or
proprietary text from D&D Beyond or other publishers is included.
