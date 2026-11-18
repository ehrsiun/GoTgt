# GoTgt

Post what you're already doing. Friends can tap in.

An interactive prototype of the GoTgt app, built from the hi-fi Figma designs: every screen across onboarding, posting a plan, receiving a plan, the swipe deck, friends, circles and settings, with the lil guy transitions and micro-interactions.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. On a laptop the app shows inside a phone frame with shortcuts to each flow; on a phone it runs full screen. Add `#home`, `#lock`, `#active` etc. to the URL to jump straight to a screen (see `components/Prototype.jsx` for the list).

## Deploy

Import this repo on [vercel.com](https://vercel.com) → Add New → Project. Vercel detects Next.js; no settings needed. Every push to `main` redeploys.

**Fonts:** Nexa loads from Adobe Fonts (kit `pas1cwi`). Add your Vercel domain (and `localhost`) to that web project in Adobe Fonts, or the display type falls back to Outfit.

## Where things live

| | |
|---|---|
| `app/globals.css` | Design tokens (colors, type, timing) and all animation keyframes |
| `components/ui.jsx` | Lil guy face, walking lil guys, buttons, chips, toggle, tab bar pieces |
| `components/proto.jsx` | Navigation, transitions (push, sheet, fade, tab), lil guy fill and walk wipe |
| `components/screens/*` | Screens, grouped by flow |
| `lib/art.js` | Lil guy and wordmark artwork taken from the Figma file |

## Motion

- **Push** 0.32s ease-out for moving through a flow; **sheets** slide up over a 30% scrim.
- **Tab switch** crossfades; the post button's eyes glide to the active tab.
- **Lil guy fill** when you send a plan (your color) or join one (the host's color): a face grows from the button, blinks, and shrinks into what it lands on.
- **Walk wipe** when you finish setup or head home after joining: a lil guy walks across pulling a curtain of his color.
- **Hand-holding walk** on "you're in" for 2 or 3 people; only the outer arms swing.

## Motion, matched to Figma

- `components/walk.jsx` + `lib/frames.js` — the lil guys are a frame-by-frame flipbook of the 32-frame Figma walk cycle (2 s loop). Chains hold hands with the same held-arm parts as the Figma duo/trio loops.
- `lib/splash.js` + `lib/timeline.js` — the splash plays the exported Figma keyframes (times, values and easing curves), then dissolves to Home at 10 s.
- `components/proto.jsx` — screen transitions use the Figma prototype timings: push 0.3 s, move in 0.3 s / out 0.25 s, dissolve 0.2 s, tabs 0.3 s; fill and walk transitions follow the "T ·" frames.
