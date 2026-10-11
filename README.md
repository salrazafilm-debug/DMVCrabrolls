# DMV Crabrolls

Website for **DMV Crabrolls**: home of the world famous crabrolls at Section 141, Northwest Stadium.

Instagram [@thedmvcrabrolls](https://www.instagram.com/thedmvcrabrolls/) · TikTok [@dmvcrabrolls](https://www.tiktok.com/@dmvcrabrolls)

Plain HTML, CSS and JavaScript. No build step and no dependencies. Fonts are system fonts.

## Run it locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## What's where

| What | Where |
| --- | --- |
| Page content: menu, owner, crew, location, catering, gallery | `index.html` |
| Colors, type, layout | `styles.css` (brand colors are the variables at the top) |
| The floating game-day ticket | `ticket.css`, `ticket.js` |
| Menu dialogs, catering form, photo viewer, nav | `app.js` |
| Photos, logo lockup, flags | `assets/` |

## Good to know

- **Catering form:** it doesn't send anything. It builds the inquiry text for the visitor to copy or download and share with the team.
- **Gallery:** add a photo by copying one of the `.moment` buttons in `index.html` and pointing `data-photo` and the `<img>` at a new file in `assets/`.
- **Images** are compressed WebP and JPEG (about 4 MB in total). Keep new ones small, since many visitors are on cell data at the stadium.
- **The ticket** is fan artwork and says so on the page.

## Deploying

Any static host works (GitHub Pages, Netlify, Vercel, Cloudflare Pages). For GitHub Pages: repo **Settings, Pages, Deploy from a branch**, pick the branch and the `/ (root)` folder.
