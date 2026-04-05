# Gym Log

Minimal workout logger: **Resume last**, **Done set** with ±5 lb / ±1 rep, **History**, **Insights**. Built with [Next.js](https://nextjs.org/) and optional [Supabase](https://supabase.com/) sync.

## Local dev

```bash
npm install
cp .env.example .env.local
# copy the anon key from Supabase → Project Settings → API into .env.local
npm run dev
```

## Supabase (project `nsgpcfancopiybsebeis`)

This app targets the Supabase project with ref **`nsgpcfancopiybsebeis`** (your current org/group in the dashboard).

| What | Link |
|------|------|
| Project home | [Dashboard — nsgpcfancopiybsebeis](https://supabase.com/dashboard/project/nsgpcfancopiybsebeis) |
| **SQL Editor** (run migration) | [SQL Editor](https://supabase.com/dashboard/project/nsgpcfancopiybsebeis/sql) |
| API URL & keys | [Project Settings → API](https://supabase.com/dashboard/project/nsgpcfancopiybsebeis/settings/api) |
| Anonymous auth | [Authentication → Providers](https://supabase.com/dashboard/project/nsgpcfancopiybsebeis/auth/providers) |

Setup:

1. **Authentication → Providers → Anonymous** — enable Anonymous sign-ins.
2. Open [**SQL Editor**](https://supabase.com/dashboard/project/nsgpcfancopiybsebeis/sql), paste and run [`supabase/migrations/001_init.sql`](./supabase/migrations/001_init.sql).
3. In [**API settings**](https://supabase.com/dashboard/project/nsgpcfancopiybsebeis/settings/api), copy the **anon public** key. Set in `.env.local` and on Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://nsgpcfancopiybsebeis.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (anon key)

Finished workouts are inserted into `workout_sessions`, `workout_session_exercises`, and `workout_set_entries` under the anonymous (or signed-in) user.

## Deploy on Vercel

Connect this GitHub repo, set the same two env vars for Production (and Preview if needed), then redeploy. CLI: `vercel --prod` from repo root.

## GitHub

Default remote: `https://github.com/3thanh/gym-log`.

## Branding

CSS tokens live in `src/app/globals.css` (`--primary`, `--bg`, `--surface`, etc.) — utilitarian, high-contrast, gym-floor friendly.
