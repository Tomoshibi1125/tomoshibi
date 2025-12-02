# SYSTEM: ARCHITECT (Solo System App)

Post-reset Solo Leveling inspired character manager and rules engine, built with Next.js (App Router) + TypeScript + Prisma + Tailwind.

## Stack

- Next.js 14 (App Router)
- TypeScript (strict)
- TailwindCSS
- Prisma + SQLite (dev)
- NextAuth (email+password, credentials)
- PWA-ready for install on desktop + mobile

## Getting Started

```bash
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev
```

Then open http://localhost:3000

## Notes

- This app currently focuses on player-side tools: character creation, sheet, leveling, loot, and dice.
- DM tools (encounter builder, campaign management) can be added later.

## License

MIT for code. D&D 5.1 SRD content, where used, is under the Creative Commons Attribution 4.0 International License with proper attribution.


## Deploying (Vercel one-link for your players)

1. Create a GitHub repository and push this project.
2. Go to https://vercel.com, create an account (free), and:
   - Click **New Project** → import your GitHub repo.
   - Set the `DATABASE_URL` env var (e.g. to a hosted Postgres or SQLite-compatible service).
   - Click **Deploy**.

3. Once deployed, Vercel gives you a URL like `https://your-system-app.vercel.app`.

4. Share that link with your players. On:
   - **Desktop / Android**: they can click the browser menu and choose **Install App / Add to Home Screen**.
   - **iOS (Safari)**: they tap **Share → Add to Home Screen**.

From then on, it behaves like a one-click native app launcher that opens the System for them.

