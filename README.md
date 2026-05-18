# Jacob — Engineering Portfolio

A clean, minimal, engineering-focused portfolio site. Static HTML/CSS/JS — no build step, no framework, no backend.

## What's here

```
portfolio/
├── index.html              ← Landing page with project grid
├── subspectra.html         ← Project 1
├── brewbot.html            ← Project 2
├── shiftopt.html           ← Project 3
├── aquacontrol.html        ← Project 4
├── css/style.css
├── js/main.js
├── images/
│   ├── subspectra/         ← Drop SubSpectra photos here
│   ├── brewbot/
│   ├── shiftopt/
│   └── aquacontrol/
└── models/
    ├── subspectra/         ← Drop SubSpectra .stl files here
    ├── brewbot/
    ├── shiftopt/
    └── aquacontrol/
```

## How to test it locally

You can't just double-click the HTML — the STL viewer needs a real local server. Easiest options:

**Option A — Python (you almost certainly have this):**
```bash
cd portfolio
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Option B — VS Code "Live Server" extension:**
Install the extension, right-click `index.html`, choose "Open with Live Server".

## How to add your real images

Two ways. Pick whichever feels easier:

### Way 1 — Drag and drop (preview only)
Open any project page in your browser, drag images onto the gallery. They'll appear instantly. But they only live in *that* browser session — refresh and they're gone. Good for trying things out, not the final site.

### Way 2 — Add real files (permanent)
1. Drop your images into `/images/subspectra/` (or the appropriate project folder)
2. Open that project's HTML file (e.g. `subspectra.html`)
3. Find the `<!-- DROP YOUR IMAGES HERE -->` comment in the gallery section
4. Uncomment the `<div class="gallery-item">` lines and update the filenames to match yours

Example:
```html
<div class="gallery-item"><img src="images/subspectra/rov-build.jpg" alt="ROV build"></div>
<div class="gallery-item"><img src="images/subspectra/tank-test.jpg" alt="Tank test"></div>
```

You can add as many as you want — the grid wraps automatically. Click any image to open it full-screen.

## How to add 3D models (STL files)

1. Drop your `.stl` files into `/models/subspectra/` (or appropriate project folder)
2. Open the project's HTML file
3. Find this line in the `model-viewer` div:
   ```html
   data-models="models/subspectra/chassis.stl"
   ```
4. Update the filename(s). For multiple models on one project, separate with commas:
   ```html
   data-models="models/subspectra/chassis.stl,models/subspectra/thruster_mount.stl,models/subspectra/electronics_tray.stl"
   ```

Each filename becomes a clickable tab below the viewer. You can also drag-and-drop any `.stl` file directly onto the viewer to preview it on the fly.

## Customizing your info

Open `index.html` and search/replace:
- `your.email@example.com` → your real email
- `https://github.com/yourusername` → your GitHub URL
- `https://linkedin.com/in/yourusername` → your LinkedIn URL

Do the same in each project page (or update once and copy/paste the footer block to the others).

## Deploying to get a shareable link

The easiest free options, ranked:

### Netlify Drop (no signup needed for a test)
1. Go to https://app.netlify.com/drop
2. Drag the entire `portfolio` folder onto the page
3. You get a URL like `https://random-name-12345.netlify.app`
4. Sign up if you want to keep it / use a custom domain

### GitHub Pages
1. Create a public repo called `portfolio` (or anything)
2. Push the `portfolio` folder contents (not the folder itself — the files inside it)
3. Repo Settings → Pages → Source: `main` branch, root folder
4. Your site goes live at `https://<your-github-username>.github.io/portfolio`

### Vercel
1. Sign up at vercel.com with GitHub
2. Import the repo from step 2 above
3. Deploy — instant URL, custom domain support

## Design notes

- **Fonts**: Fraunces (serif headlines), Inter (body), JetBrains Mono (labels). All loaded from Google Fonts.
- **Color**: warm off-white paper background, deep navy ink, single rust accent. Very legible, very engineering-monograph.
- **Three.js**: r128 from CDN. STL viewer supports rotate, zoom, wireframe toggle, auto-rotate, and drag-and-drop file loading.

## Notes / known things to fix later

- The drag-and-drop preview is session-only by design (browsers can't write to disk from a static site).
- If you want a real CMS where you upload images from anywhere, you'll need a backend — happy to help wire that up later (Netlify CMS, Cloudinary, etc.).
- The STL viewer scales models to fit a bounding box of 80 units. If a model looks weird, that's the place to tweak.
