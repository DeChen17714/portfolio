# Wong De Chen — Portfolio

Personal software engineering portfolio showcasing full-stack SaaS systems, web interfaces, and visual work.

## Tech Stack

- **Framework**: Vite, Vanilla JavaScript, CSS
- **Fonts**: Self-hosted Bricolage Grotesque, Newsreader, DM Mono
- **Deployment**: GitHub Pages (GitHub Actions)

## Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Run deterministic site verification
npm run check

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Structure

```
├── index.html          # Semantic HTML structure & accessible landmarks
├── src/
│   ├── main.js         # Theme toggle, reveals, spotlight, copy actions
│   └── styles.css      # Editorial layout, typography, responsive rules
├── public/assets/      # Local images, traces, and downloadable PDF resume
├── scripts/
│   └── check-site.mjs  # Deterministic verification suite
└── vite.config.js      # Production build & portable relative base
```
