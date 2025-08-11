# Codebase Structure

This documentation site follows a clean, organized structure optimized for developer documentation:

## Root Directory
```
.
├── public/           # Static assets and files served directly
├── src/              # Source code and content
├── astro.config.mjs  # Astro and Starlight configuration
├── package.json      # Dependencies and npm scripts
├── tsconfig.json     # TypeScript configuration
├── README.md         # Project setup instructions
└── .gitignore        # Git ignore rules
```

## Source Structure (`src/`)
```
src/
├── assets/           # Images and media files
├── content/          # Documentation content
│   └── docs/         # All documentation pages (.md/.mdx files)
│       ├── getting-started/     # Setup and onboarding docs
│       ├── core-concepts/       # Technical concepts
│       ├── api/                 # API documentation
│       ├── components/          # Component documentation
│       ├── guides/              # How-to guides
│       ├── development/         # Development workflows
│       └── reference/           # Reference materials
├── styles/           # Custom CSS files
└── content.config.ts # Content collection configuration
```

## Documentation Organization
The documentation is organized into logical sections:

### Getting Started (`getting-started/`)
- `quick-start.md` - Fast setup guide
- `development-setup.md` - Detailed development environment
- `project-overview.md` - High-level platform overview
- `architecture.md` - Technical architecture details

### Core Concepts (`core-concepts/`)
- `llm-integration.md` - AI provider integration
- `react-native-generation.md` - Code generation process
- `state-management.md` - State management patterns
- `file-system.md` - File handling
- `authentication.md` - Auth implementation

### API Reference (`api/`)
- `routes-overview.md` - All API endpoints
- `llm-apis.md` - LLM-specific endpoints
- `project-apis.md` - Project management endpoints
- `deployment-apis.md` - Deployment endpoints
- `database-schema.md` - Database documentation

### Components (`components/`)
- `ui-components.md` - UI component library
- `chat-components.md` - Chat interface components
- `editor-components.md` - Code editor components
- `project-components.md` - Project management components

### Guides (`guides/`)
- `adding-llm-providers.md` - Adding new AI providers
- `creating-components.md` - Component creation guide
- `extending-api.md` - API extension guide
- `database-migrations.md` - Database migration guide
- `deployment.md` - Deployment instructions

### Development (`development/`)
- `code-style.md` - Code style guidelines
- `testing.md` - Testing strategies
- `debugging.md` - Debugging techniques
- `performance.md` - Performance optimization
- `contributing.md` - Contribution guidelines

### Reference (`reference/`)
- `environment-variables.md` - Environment configuration
- `configuration.md` - System configuration
- `cli-commands.md` - Command line reference
- `troubleshooting.md` - Common issues and solutions

## Navigation Structure
The sidebar navigation is defined in `astro.config.mjs` and matches the file structure, providing intuitive navigation through the documentation hierarchy.