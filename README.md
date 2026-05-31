

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
