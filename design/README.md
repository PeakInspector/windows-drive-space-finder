# Shed design source

Everything in `assets/brand`, `assets/mockups` and `assets/readme` renders from this folder.

```bash
npm install
npx playwright install chromium
node render.mjs all
```

`node render.mjs icon`, `stills` or `gifs` renders one group, and `node render.mjs gifs hero` renders one file. GIFs also need `ffmpeg` and `gifsicle` on your `PATH`, and the icon step needs Python with Pillow.

## Direction

- **The disk map is the product.** A squarified treemap of the drive, in dark group tints, so the one bright block stands out.
- **Violet is free space** and nothing else: the mark, the free block and freed totals. **Coral marks what grew** since the last scan.
- **Badges always carry a label:** Rebuilds itself (sky), Safe to remove (green), Your files (yellow).
- **Type:** SF Pro on Apple devices, Inter everywhere else. Sizes use tabular figures.

`scenes.mjs` lists what renders, and each scene is one HTML file in `src/`. Sample data and the treemap live in `src/kit.js`. Animated scenes expose `window.seek(t)`.
