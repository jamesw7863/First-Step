# InternList MVP

InternList is an internship discovery platform for UCF students across all majors. Students set preferences once, and receive a daily digest of newly discovered internships.

## Stack

- Next.js 14 (App Router)
- Supabase (Postgres + Auth-ready architecture)
- Resend (daily email digests)
- Vercel cron jobs (ingest, match, digest)

## Setup

1. Copy environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in Supabase and Resend keys.
3. Apply database migration in Supabase SQL editor:
   - `db/migrations/001_init.sql`
4. Seed your `sources` table using values from `data/sources.json`.
5. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```

## API Endpoints

- `POST /api/preferences`
  - Save user preferences.
- `POST /api/ingest/run`
  - Ingest internship sources from the last run window.
  - Requires `Authorization: Bearer $CRON_SECRET`.
- `POST /api/match/run`
  - Build internship matches for profiles.
  - Requires `Authorization: Bearer $CRON_SECRET`.
- `POST /api/digest/send`
  - Send daily digest emails and log delivery.
  - Requires `Authorization: Bearer $CRON_SECRET`.
- `GET /api/unsubscribe?userId=...`
  - Unsubscribe a student from future emails.

## Local Checks

```bash
npm run typecheck
npm run test
npm run lint
```

## MVP Notes

- Uses curated JSON sources first; swap placeholder source URLs in `data/sources.json`.
- Dedupes internships via SHA-256 hash across source/title/company/location/url.
- Daily freshness window is 24 hours.
