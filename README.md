# DMV Crabrolls

This repository contains the DMV Crabrolls website and a ready-to-render five-second **Mumbo Sauce commercial**. You can make and download the video entirely from an iPhone—no editing software is needed.

## Make the final commercial on your iPhone

1. Open the [Render DMV Mumbo Commercial](https://github.com/salrazafilm-debug/DMVCrabrolls/actions/workflows/render-mumbo.yml) page in Safari. Sign in to GitHub if asked.
2. Tap **Run workflow** on the right. If you do not see it, tap the **Run workflow** dropdown near the top of the page.
3. Choose **final** for the finished **Final Commercial**. Leave the branch selection unchanged.
4. Tap the green **Run workflow** button. The render normally takes a few minutes.
5. Tap the new workflow run when it appears. Wait for its green checkmark.
6. Scroll to **Artifacts** and tap **dmv-mumbo-commercial.mp4**. GitHub downloads a small ZIP file; open it in the iPhone Files app and tap the MP4 inside.

Artifact downloads require being signed in to GitHub. Each rendered video stays available for 30 days.

### Other choices

- **preview** — a smaller 1280×720 branded video that renders faster.
- **clean** — the original footage at 2560×1440 with no added words.
- **final** — the finished 2560×1440 branded commercial.

## Ask Codex for a change

Tell Codex what you want in plain English, for example:

> Make “MUMBO SAUCE” slightly smaller and keep everything else the same. Test it and update GitHub.

The commercial source is in `src/MumboCommercial.tsx` and `src/style.css`. The rendering workflow is `.github/workflows/render-mumbo.yml`.

## What the commercial does

- Keeps the original Higgsfield footage unchanged in `public/mumbo-original.mp4`.
- Preserves its original audio automatically.
- Shows clean footage first, reveals “WORLD’S BEST / MUMBO SAUCE,” then settles on “ONLY HERE AT DMV CRABROLLS.”
- Uses the project’s self-hosted Anton and Barlow Condensed fonts—no licensed music or outside font service is used.
- Renders exactly five seconds at 24 fps in H.264 MP4 format, compatible with iPhone.

The downloaded source is 2560×1440, 24 fps, 5.167 seconds, with H.264 video and stereo AAC audio. The five-second compositions use the first 120 frames without stretching, cropping, regenerating, or otherwise modifying the source imagery.

## For developers

```sh
npm ci
npm test
npm run render:preview
npm run render:final
npm run render:clean
```

| Composition | Output | Purpose |
| --- | --- | --- |
| `MumboCommercial` | 2560×1440 | Final branded advertisement |
| `MumboClean` | 2560×1440 | Original footage with no typography |
| `MumboPreview` | 1280×720 | Quick branded test render |

Optional future music or sound effects can be added as local, properly licensed files in `public/` and layered in the Remotion composition. No extra audio is included now.

## Website

The existing DMV Crabrolls website remains in `index.html`, `styles.css`, `app.js`, and `assets/`. It is plain HTML, CSS, and JavaScript; the video rendering setup does not change how the website runs.
