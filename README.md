# Gym Log

Minimal workout logger: **Resume last**, **Done set** with ±5 lb / ±1 rep, **History**, **Insights**. Built with [Next.js](https://nextjs.org/) and optional [Supabase](https://supabase.com/) sync.

## Local dev

```bash
npm install
cp .env.example .env.local
# add your Supabase URL + anon key
npm run dev
```

## Supabase (project `ethan80808` or your ref)

1. In the Supabase dashboard: **Authentication → Providers → Anonymous** — enable Anonymous sign-ins.
2. Open **SQL Editor**, paste and run `supabase/migrations/001_init.sql`.
3. Copy **Project URL** and **anon public** key into Vercel (or `.env.local`) as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

Finished workouts are inserted into `workout_sessions`, `workout_session_exercises`, and `workout_set_entries` under the anonymous (or signed-in) user.

## Deploy on Vercel

Connect this GitHub repo, set the same two env vars, deploy. CLI: `vercel --prod` from repo root.

## GitHub

Default remote: `https://github.com/3thanh/gym-log` (after `gh repo create`).

## Branding

CSS tokens live in `src/app/globals.css` (`--primary`, `--bg`, `--surface`, etc.) — utilitarian, high-contrast, gym-floor friendly.
