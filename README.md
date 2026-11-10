# 🖐️ Leave a Mark

An end-of-semester feedback wall. Students choose their batch (CSE 64 / CSE 69), write what they thought of the class (with their name or anonymously), and their feedback shows up as a painted handprint on their batch's wall. Hover over a print to peek at it, click to open the full message.

Built with **Next.js (App Router) + TypeScript + MongoDB**, ready for **Vercel**.

## Setup

```bash
npm install
cp .env.example .env.local   # or just edit the existing .env.local
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Key | Required | What it is |
| --- | --- | --- |
| `MONGODB_URI` | ✅ | MongoDB connection string (Atlas → Connect → Drivers) |
| `MONGODB_DB` | – | Database name, defaults to `handprints` |
| `NEXT_PUBLIC_TEACHER_NAME` | – | Your name as shown on the site |
| `ADMIN_KEY` | – | Secret used to delete inappropriate handprints |

> On MongoDB Atlas, allow access from Vercel under **Network Access** (`0.0.0.0/0` is the simplest option).

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import it on vercel.com.
3. Add the env vars above under **Settings → Environment Variables**.
4. Deploy. 🎉

## Removing a handprint

Someone got a little too creative? Find the print's `id` (it's in the `GET /api/feedback` response) and run:

```bash
curl -X DELETE https://your-site.vercel.app/api/feedback/<id> -H "x-admin-key: <ADMIN_KEY>"
```

## Customising

Everything lives in `lib/config.ts`: batches, wall colours, paint colours, vibes, and the sarcastic ticker lines. To add a new batch, add an entry to `BATCHES` and add its id to `BatchId` in `lib/types.ts`.

