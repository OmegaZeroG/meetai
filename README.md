# Meet.AI

Meet.AI is a full-stack SaaS platform for video meetings with custom AI agents. Users create agents with their own personality and instructions, talk to them in real-time video calls, and get an automatic post-call summary, searchable transcript, and video replay.

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Auth:** Better Auth (email/password + Google & GitHub OAuth)
- **Database:** Neon Postgres + Drizzle ORM
- **UI:** Tailwind CSS, shadcn/ui, Radix primitives, Lucide icons
- **API layer:** tRPC (added in progress, see roadmap below)
- **Video/AI:** Stream Video & Chat, OpenAI (planned)
- **Payments:** Polar (planned)
- **Deployment:** Vercel (planned)

## Getting Started

```bash
npm install
cp .env.example .env   # fill in your own DB, auth, and OAuth credentials
npm run db:push        # push the Drizzle schema to your database
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string |
| `BETTER_AUTH_SECRET` | Better Auth session secret |
| `BETTER_AUTH_URL` | Base URL used by Better Auth |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth app credentials |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth app credentials |
| `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` | Discord OAuth app credentials |
| `NEXT_PUBLIC_STREAM_VIDEO_API_KEY` | Stream Video app API key |
| `STREAM_VIDEO_SECRET_KEY` | Stream Video app secret key |

## Build Progress

- [x] 01 — Project setup
- [x] 02 — Database (Neon + Drizzle)
- [x] 03 — Auth setup (Better Auth)
- [x] 04 — Auth UI
- [x] 05 — Auth socials (Google & GitHub)
- [x] 06 — Dashboard sidebar
- [x] 07 — Dashboard navbar
- [x] 08 — tRPC setup
- [x] 09 — Agents setup
- [x] 10 — Responsive dialog
- [x] 11 — Agents form
- [x] 12 — Agents data table
- [x] 13 — Agents filters
- [x] 14 — Agent page
- [x] 15 — Agent update / delete
- [x] 16 — Meetings setup
- [x] 17 — Meetings form
- [x] 18 — Meetings data table
- [x] 19 — Meetings filters
- [x] 20 — Meeting page
- [x] 21 — Meeting variants
- [x] 22 — Video call
- [ ] 23 — Connecting agents
- [ ] 24 — Background jobs
- [ ] 25 — Completed state
- [ ] 26 — Transcript & chat
- [ ] 27 — Payments
- [ ] 28 — Bug fixes
- [ ] 29 — Deployment

## Author

Built by **Om Pathrabe**.
