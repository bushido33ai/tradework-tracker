# TradeWork Tracker — Remotion Videos

Promo and social video compositions built with [Remotion](https://remotion.dev).

## Compositions

| ID | Duration | Resolution | Description |
|----|----------|------------|-------------|
| `PromoVideo` | 30s | 1920×1080 | Main landscape promo |
| `FeatureShowcase` | 15s | 1080×1080 | Square social media reel |

## Getting started

```bash
cd remotion
npm install

# Open the Remotion Studio (live preview)
npm run dev
```

## Rendering

```bash
# Render the full promo as MP4
npm run render

# Render as GIF
npm run render:gif

# Export a single frame as PNG
npm run render:still
```

Output files go into the `out/` directory.

## Customising

Edit `src/Root.tsx` to change:
- `appName` — your app name
- `tagline` — hero tagline
- `accentColor` — brand colour (default: `#f97316` orange)
- `features` — the four feature cards shown in the video

Each scene is a separate component in `src/components/`:
- `HeroScene.tsx` — opening title + tagline
- `FeatureScene.tsx` — individual feature callouts
- `StatsScene.tsx` — social proof numbers
- `CtaScene.tsx` — closing call-to-action

## Adding music

Drop an audio file into `public/` and add an `<Audio>` tag to `PromoVideo.tsx`:

```tsx
import { Audio, staticFile } from "remotion";
<Audio src={staticFile("music.mp3")} volume={0.4} />
```
