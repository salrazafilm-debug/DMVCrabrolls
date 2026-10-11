# DMV Crabrolls

Website for **DMV Crabrolls** — home of the world famous crab rolls at Section 141, Northwest Stadium.

Instagram: [@thedmvcrabrolls](https://www.instagram.com/thedmvcrabrolls/) · TikTok: [@dmvcrabrolls](https://www.tiktok.com/@dmvcrabrolls)

Plain HTML/CSS/JS. No build step, no dependencies, fonts are self-hosted.

## Run it locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Where things live

| What | Where |
| --- | --- |
| Page content (menu, locations, links) | `index.html` |
| Colors, fonts, layout | `css/styles.css` (brand colors are the variables at the top) |
| Mobile menu + scroll animations | `js/main.js` |
| Logo, favicon | `assets/` |

## Things to update

- **Menu**: the four cards in `#menu` are written from what's on Instagram. Edit names/descriptions, and add prices if you want them.
- **Where to find us**: `#find-us` has the Section 141 ticket plus Orioles Park and pop-up notes. Add dates/schedules here.
- **The feed**: the four cards in `#feed` link to specific Instagram reels. Swap the `href`s to feature newer ones.
- **Contact**: events/catering currently point people to Instagram/TikTok DMs. Add a phone number or email if you have one.
- **Photos**: the site is typography- and flag-pattern-driven. To add food photos, drop images into `assets/` and use them inside the `.menu-card` blocks.
- **Logo quality**: `assets/logo.png` was made from the Instagram profile picture (small). Replace it with a high-res original (transparent PNG) when you have one.
- **Share preview**: once the site has a domain, uncomment/add the `og:image` line in `<head>` with the full URL to `assets/logo.png`.

## Deploying

Any static host works (GitHub Pages, Netlify, Vercel, Cloudflare Pages). For GitHub Pages: repo **Settings → Pages → Deploy from a branch**, pick the branch and the `/ (root)` folder.
