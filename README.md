# Jacob — Engineering Portfolio

Static HTML/CSS/JS portfolio. No build step, no framework, no backend.

## Files

```
portfolio/
├── index.html              ← Landing page with project grid
├── subspectra.html         ← SubSpectra case study
├── brewbot.html            ← BrewBot case study
├── shiftopt.html           ← ShiftOpt case study
├── aquacontrol.html        ← AquaControl case study
├── css/style.css
├── js/main.js
├── images/
│   ├── subspectra/
│   └── brewbot/
└── models/
    ├── subspectra/
    │   └── SubSpectra_v4.stl
    └── brewbot/
        ├── V1.stl
        └── internals.stl
```

## Testing locally

You can't just double-click the HTML — the STL viewer needs a real local server.

```bash
cd portfolio
python3 -m http.server 8000
```

Open `http://localhost:8000` in your browser.

## Adding more images

1. Drop your images into `/images/<project-name>/`
2. Open that project's HTML file (e.g. `subspectra.html`)
3. Find the `<div class="gallery">` block
4. Add a new line for each image:
   ```html
   <div class="gallery-item"><img src="images/subspectra/my-new-photo.jpg" alt="SubSpectra"></div>
   ```

Click any image to open it full-screen.

## Adding more 3D models

1. Drop `.stl` files into `/models/<project-name>/`
2. Open the project's HTML file
3. Find this line in the model-viewer div:
   ```html
   data-models="models/brewbot/V1.stl,models/brewbot/internals.stl"
   ```
4. Add to the comma-separated list. Each filename becomes a clickable tab below the viewer (only shown when there are 2+ models).

**Important:** STL filenames should not contain spaces or special characters. Use underscores or hyphens instead (e.g. `SubSpectra_v4.stl`, not `SubSpectra v4.stl`).

## Deploying

### GitHub Pages
1. Push the contents of this folder to a GitHub repo
2. Repo Settings → Pages → Source: `main` branch, root folder
3. Site goes live at `https://<your-username>.github.io/<repo-name>` after 1–2 minutes

### Netlify Drop
1. Go to https://app.netlify.com/drop
2. Drag the entire folder onto the page
3. Instant URL

## Design notes

- **Fonts**: Fraunces (serif headlines), Inter (body), JetBrains Mono (labels). Loaded from Google Fonts.
- **Color**: warm off-white background, deep navy ink, single rust accent.
- **Three.js**: r128 from CDN. STL viewer supports orbit controls, wireframe toggle, auto-rotate, and per-tab model switching.
- **Scaling**: each STL is auto-scaled to fit a bounding box of 80 units. Tweak that constant in `js/main.js` if a model looks weird.
