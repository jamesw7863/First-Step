# FirstStep

**FirstStep** is an internship discovery platform built to help students find relevant internship opportunities faster. Students set their preferences once, including major, role interests, location, and email frequency, then receive curated internship digests with direct application links.

The platform was originally designed for UCF students across all majors, with the goal of reducing the time students spend manually searching across job boards, company pages, and scattered online postings.

## Overview

Many students, especially underclassmen and first-generation applicants, miss internship opportunities because they do not know where to search or how often new roles appear. FirstStep simplifies that process by collecting internship postings, matching them to student preferences, and delivering opportunities directly through email.

## Features

* Student preference form for major, role type, location, and email digest settings
* Internship ingestion pipeline for collecting postings from curated sources
* Matching workflow that connects students with relevant internship opportunities
* Daily or weekly email digests powered by Resend
* Direct application links to reduce time spent searching manually
* Unsubscribe flow for students who no longer want to receive emails
* Deduplication logic to prevent repeated internship postings
* Vercel cron jobs for scheduled ingestion, matching, and digest delivery

## Tech Stack

* **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
* **Backend:** Next.js API Routes
* **Database:** Supabase PostgreSQL
* **Email:** Resend
* **Automation:** Vercel Cron Jobs
* **Deployment:** Vercel
* **Data Processing:** Curated JSON sources, internship matching logic, SHA-256 deduplication

## Architecture

FirstStep follows a simple automated pipeline:

1. **Students submit preferences**

   * Students enter their academic and career interests through the preference form.

2. **Internship sources are ingested**

   * The ingestion endpoint collects internship postings from curated sources.

3. **Postings are deduplicated**

   * Internship listings are hashed using SHA-256 across fields such as source, title, company, location, and URL.

4. **Matches are generated**

   * Student profiles are matched with relevant internship postings based on saved preferences.

5. **Email digests are sent**

   * Students receive internship opportunities through daily or weekly Resend email digests.

## API Endpoints

### `POST /api/preferences`

Saves a student's internship preferences.

### `POST /api/ingest/run`

Runs the internship ingestion workflow.

Requires:

```bash
Authorization: Bearer $CRON_SECRET
```

### `POST /api/match/run`

Builds internship matches for saved student profiles.

Requires:

```bash
Authorization: Bearer $CRON_SECRET
```

### `POST /api/digest/send`

Sends internship digest emails and logs delivery.

Requires:

```bash
Authorization: Bearer $CRON_SECRET
```

### `GET /api/unsubscribe?userId=...`

Unsubscribes a student from future email digests.

## Getting Started

### Prerequisites

Make sure you have the following installed:

```bash
Node.js
npm
```

You will also need accounts for:

* Supabase
* Resend
* Vercel

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
```

Navigate into the project directory:

```bash
cd YOUR_REPOSITORY_NAME
```

Install dependencies:

```bash
npm install
```

Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill in your Supabase, Resend, and cron secret environment variables.

Apply the database migration in the Supabase SQL editor:

```bash
db/migrations/001_init.sql
```

Seed the `sources` table using the values from:

```bash
data/sources.json
```

Run the development server:

```bash
npm run dev
```

Open the app locally:

```bash
http://localhost:3000
```

## Local Checks

Run the following commands before pushing changes:

```bash
npm run typecheck
npm run test
npm run lint
```

## MVP Notes

* The MVP uses curated JSON sources first.
* Placeholder source URLs can be swapped in `data/sources.json`.
* Internship postings are deduplicated using a SHA-256 hash.
* The default freshness window for new postings is 24 hours.
* The platform is designed to support future expansion beyond UCF.

## Future Improvements

* Add user authentication through Supabase Auth
* Build an admin dashboard for managing internship sources
* Add more advanced matching by major, skills, graduation year, and location
* Support multiple universities and student organizations
* Add analytics for email opens, clicks, and application activity
* Improve internship scraping coverage across more company career pages
* Add saved internships and student application tracking

## Impact

FirstStep is designed to reduce the time students spend searching for internships by centralizing opportunities into personalized email digests. The platform helps students discover relevant roles sooner and creates a more accessible internship search process for students who may not know where to start.

## Author

Built by Hector Cordero and James Williams.
