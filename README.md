# The Yardage Book

A golfer's practice journal: freeform entries, a swing-thought board with shelf lives, a living wedge-distance matrix, the Great Shots reservoir (with Arccos screenshots), and a thirty-second pre-round brief.

Static app, deployable straight from GitHub Pages. Data lives in your free Supabase project, private to your account. Local-first: every save lands on the device instantly and syncs in the background, so journaling on the course works even with one bar of signal.

## Setup (about 10 minutes)

### 1. Create the Supabase project
1. Sign up free at supabase.com and create a new project (any name, any region near you, e.g. London).
2. In the dashboard, open **SQL Editor → New query**, paste the contents of `supabase-setup.sql`, and press **Run**. This creates the two tables and locks them down so each signed-in user can only read their own data.
3. Email sign-in is enabled by default (Authentication → Sign In / Up → Email). The app uses one-time email codes, so nothing else to configure.

### 2. Point the app at your project
1. In the dashboard, open **Project Settings → API**.
2. Copy the **Project URL** and the **anon public** key.
3. Open `index.html` and paste both into the `window.JOURNAL_CONFIG` block at the top.

The anon key is designed to be published — row level security (set up by the SQL above) is what protects your data, not key secrecy.

### 3. Deploy from GitHub
1. Create a repository and push these files (everything except `node_modules/`).
2. Repository **Settings → Pages → Deploy from a branch**, pick `main` and `/ (root)`, save.
3. After a minute your journal is live at `https://<username>.github.io/<repo>/`.

### 4. Put it on your phone
Open the URL in Safari (iPhone) → Share → **Add to Home Screen**. It opens full-screen like a native app, and the service worker keeps the app shell cached so it launches even without signal. Sign in once with an emailed code; you stay signed in.

## How your data flows
- Every save writes to the device immediately (localStorage), then syncs to Supabase about a second later.
- The header shows the sync state: `✓ synced`, `syncing…`, or `offline — saved on this device` (it retries automatically when signal returns and every 30 seconds).
- First sign-in on a fresh account seeds the journal with the starter content (Pelz session, axe-throw session, wedge matrix, the two great shots and their screenshots).
- **Download backup** at the bottom of any tab exports everything — entries, thoughts, distances, shots, and images — as one JSON file. **Restore from backup** brings it back. Worth doing occasionally.

One honest caveat: sync is last-write-wins on the whole journal. If you edit on your phone while offline and separately edit on your laptop, whichever device syncs last wins. For a single-person journal this almost never bites, but don't edit on two devices simultaneously while one is offline.

## Optional: the "Organise with AI" button
The standalone app can't call the Anthropic API directly from the browser without exposing an API key, so the button is hidden unless you set `AI_ENDPOINT` in `index.html` to a small serverless function you control (Cloudflare Workers free tier works well). The function should accept `POST {"text": "..."}` and return `{"title": "...", "tags": ["swing", ...], "thoughts": [{"text": "...", "area": "full"}]}`. Leave it blank and everything else works exactly the same — you just pick tags yourself.

## Making changes later
`app.js` is a prebuilt bundle of `src/app.jsx` (React + the Supabase client, no build step needed to deploy). To rebuild after editing the source:

```
npm install react@18 react-dom@18 @supabase/supabase-js
npx esbuild src/app.jsx --bundle --minify --outfile=app.js --loader:.jsx=jsx --define:process.env.NODE_ENV='"production"'
```

Then bump `CACHE_VERSION` in `sw.js` (e.g. `yb-v2`) so phones fetch the new version, and push.

## Files
- `index.html` — entry page and your Supabase config
- `app.js` — the app (prebuilt bundle)
- `src/app.jsx` — the source, for future edits
- `sw.js` — offline cache for the app shell
- `manifest.webmanifest`, `icon-192.png`, `icon-512.png` — home-screen install
- `supabase-setup.sql` — database schema, run once
