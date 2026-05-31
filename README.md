# 🔥 UI Roast

> Drop any UI screenshot. Get brutal, specific, AI-powered design feedback.

Built for Hack Club 7-Country Hackathon.

---

## Setup (2 minutes)

### 1. Get a Claude API key
Go to [console.anthropic.com](https://console.anthropic.com), sign up, and create an API key.

### 2. Add your key
Open `src/components/roast.js` and find the `fetch` call to `api.anthropic.com`. 

The API key is handled automatically when running via the Anthropic API — but if you're self-hosting or running locally, add a header:

```js
headers: {
  'Content-Type': 'application/json',
  'x-api-key': 'YOUR_KEY_HERE',          // add this
  'anthropic-version': '2023-06-01',     // add this
  'anthropic-dangerous-direct-browser-access': 'true'  // required for browser
},
```

### 3. Run it
Since it's pure HTML/CSS/JS with no build step, just open `index.html` in a browser — or use a local server:

```bash
npx serve .
# or
python3 -m http.server 3000
```

### 4. Deploy
```bash
# Vercel (recommended)
npx vercel

# or just drag the folder to vercel.com
```

---

## File Structure

```
ui-roast/
├── index.html                  # Main page, all markup
├── src/
│   ├── styles/
│   │   └── main.css            # All styles — dark editorial theme
│   └── components/
│       ├── upload.js           # File upload, drag-drop, paste, preview
│       ├── roast.js            # Claude API call + loading state
│       └── render.js           # Renders scored results to DOM
└── README.md
```

---

## How it works

1. User uploads a screenshot (file input, drag-drop, or paste from clipboard)
2. Image is encoded as base64 and sent to Claude's vision API
3. Claude returns structured JSON: overall score, 6 category scores, and 3–6 specific issues
4. Results render with animated score bars, a punchy summary, and severity-tagged issue cards

---

## Customization ideas

- Add a "share as link" feature (encode results in URL params)
- Add before/after comparison (upload a revised version)
- Add PDF export of the roast
- Add a leaderboard of "most roasted" public UIs
- Let users submit famous apps (Twitter, Airbnb) to a public gallery

---

## Stack

- Vanilla HTML, CSS, JavaScript — no framework, no build step
- Claude Sonnet 4 via Anthropic API (vision)
- Google Fonts (DM Serif Display, DM Mono, Geist)
- Deploys anywhere static files work (Vercel, Netlify, GitHub Pages)
