# The Yardage Book — open edition

A golfer's practice journal: freeform entries, a swing-thought board with shelf lives, a living wedge-distance matrix, the Great Shots reservoir (with Arccos screenshots), and a thirty-second pre-round brief.

**No login, no backend, no setup.** The app is pure static files served from GitHub Pages. Everything you write is saved in your browser's own storage on the device you're using. It works offline once loaded, and installs to your phone's home screen like a native app.

## Deploy (5 minutes)

1. Create a repository on github.com (public).
2. Push or upload these files: `index.html`, `app.js`, `sw.js`, `manifest.webmanifest`, `icon-192.png`, `icon-512.png`, plus `src/` and this README. Skip `node_modules` and `package-lock.json`.
3. Repository **Settings → Pages → Build and deployment**: Source = **Deploy from a branch**, branch = **main**, folder = **/ (root)**, Save. (If the Save button is greyed out, the branch dropdown is still on *None*, or the repo has no files yet.)
4. After a minute the journal is live at `https://<username>.github.io/<repo>/`.

## On your phone

Open the URL in Safari → Share → **Add to Home Screen**. It opens full-screen, and the service worker keeps the whole app cached, so it launches at the range even with no signal.

## How your data works — read this once

- Everything is saved **in this browser, on this device**, instantly on every change. The header says "saved on this device" to remind you.
- Your phone and your laptop each have their **own separate copy**. To move or merge, use **Download backup** at the bottom of any tab (exports everything, images included, as one JSON file) and **Restore from backup** on the other device.
- Because there's no account, anyone can open your Pages URL — but they'll only ever see the starter content plus whatever *they* type into *their* browser. Nobody can see your entries; they never leave your device.
- Two things that would lose data: clearing the browser's site data / history for this site, and journaling in a private window. Back up now and then — it's one tap.

First visit on any device seeds the journal with the starter content: the Pelz and axe-throw sessions, the July swing additions, the full thoughts board, the wedge matrix, and both great shots with their screenshots.

## Optional: the "Organise with AI" button

A public page can't hold an Anthropic API key safely, so the button is hidden unless you set `AI_ENDPOINT` in `index.html` to a small serverless function you control (Cloudflare Workers free tier works). It should accept `POST {"text": "..."}` and return `{"title": "...", "tags": ["swing", ...], "thoughts": [{"text": "...", "area": "full"}]}`. Leave it blank and everything else works the same — you pick tags yourself.

## Making changes later

`app.js` is a prebuilt bundle of `src/app.jsx` (React baked in, so Pages needs no build step). To rebuild after editing the source:

```
npm install react@18 react-dom@18
npx esbuild src/app.jsx --bundle --minify --outfile=app.js --loader:.jsx=jsx --define:process.env.NODE_ENV='"production"'
```

Then bump `CACHE_VERSION` in `sw.js` (e.g. `yb-open-v2`) so phones fetch the new version, and push.

## Files

- `index.html` — entry page (optional AI endpoint config)
- `app.js` — the app (prebuilt bundle)
- `src/app.jsx` — the source, for future edits
- `sw.js` — offline cache for the app shell
- `manifest.webmanifest`, `icon-192.png`, `icon-512.png` — home-screen install
