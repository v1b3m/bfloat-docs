# Technology Stack

This documentation site uses a modern documentation-focused tech stack:

## Core Framework
- **Astro 5.6.1**: Modern static site generator with excellent performance
- **Starlight 0.35.2**: Astro integration specifically designed for documentation sites
- **TypeScript**: Full type safety with strict configuration

## Content & Styling
- **Markdown/MDX**: Content written in Markdown with JSX component support
- **Custom CSS**: Enhanced syntax highlighting and component styling
- **Astro Components**: Reusable documentation components (Card, CardGrid)

## Build System
- **ESM Modules**: Modern module system (type: "module")
- **Vite**: Fast build tool and dev server (via Astro)
- **Sharp**: Image optimization for assets

## Project Structure
```
.
├── public/           # Static assets (favicon, images)
├── src/
│   ├── assets/       # Image assets
│   ├── content/      # Documentation content
│   │   └── docs/     # All documentation pages
│   └── styles/       # Custom CSS
├── astro.config.mjs  # Astro configuration
├── package.json      # Dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```

## Development Tools
- **TypeScript**: Strict configuration extending Astro's strict preset
- **Node.js**: Runtime environment
- **npm**: Package manager

## Hosting & Deployment
- Designed for static hosting (Netlify, Vercel, GitHub Pages, etc.)
- Built output goes to `./dist/` directory
- Preview support for testing builds locally