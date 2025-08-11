# Suggested Commands

Essential commands for working with this Astro + Starlight documentation site:

## Development Commands

### Start Development Server
```bash
npm run dev
# or
npm run start
```
- Starts local development server at `http://localhost:4321`
- Hot reloading for content changes
- Live preview of documentation changes

### Build for Production
```bash
npm run build
```
- Builds the static site to `./dist/` directory
- Optimizes assets and generates static HTML
- Run before deployment

### Preview Production Build
```bash
npm run preview
```
- Serves the built site locally for testing
- Useful for testing before deployment
- Simulates production environment

### Install Dependencies
```bash
npm install
```
- Installs all project dependencies
- Run after cloning or when package.json changes

## Astro CLI Commands

### General Astro Help
```bash
npm run astro -- --help
```
- Shows all available Astro CLI commands
- Useful for discovering additional functionality

### Run Astro Commands
```bash
npm run astro [command]
```
- Execute any Astro CLI command
- Examples: `npm run astro add`, `npm run astro check`

### Type Check
```bash
npm run astro check
```
- Runs TypeScript type checking
- Validates all TypeScript code in the project

## Content Development

### Adding New Documentation Pages
1. Create `.md` or `.mdx` files in `src/content/docs/`
2. Follow the existing folder structure
3. Add frontmatter with title and description
4. Update sidebar navigation in `astro.config.mjs` if needed

### Working with Assets
- Add images to `src/assets/` or `public/assets/`
- Reference from content using relative links
- Use `src/assets/` for optimized images
- Use `public/assets/` for static files

### Custom Styling
- Edit `src/styles/custom.css` for site-wide styles
- Add component-specific styles as needed
- Follow existing CSS patterns and variables

## Deployment Commands

### Deploy to Static Hosting
```bash
npm run build
# Then upload ./dist/ to your hosting provider
```

### Common Static Hosts
- **Netlify**: Connect GitHub repo for auto-deploy
- **Vercel**: `vercel --prod`  
- **GitHub Pages**: Configure in repository settings
- **AWS S3**: `aws s3 sync dist/ s3://your-bucket`

## Quality Assurance

### Link Checking
```bash
# Check for broken links (if link checker installed)
npm run astro check
```

### Content Validation
- Verify all documentation pages load correctly
- Test navigation between sections
- Ensure code examples are accurate
- Validate all external links

## macOS-Specific Commands

### File Operations
```bash
find src/content/docs -name "*.md" -type f    # Find all markdown files
grep -r "searchterm" src/content/docs/        # Search in documentation
ls -la src/content/docs/                      # List documentation files
```

### Development Workflow
```bash
cd /path/to/docs                              # Navigate to project
npm run dev                                   # Start development
open http://localhost:4321                    # Open in default browser
```

## Troubleshooting Commands

### Clear Cache
```bash
rm -rf node_modules/.astro
rm -rf dist/
npm install
npm run dev
```

### Check Dependencies
```bash
npm audit                    # Check for security vulnerabilities
npm outdated                 # Check for outdated packages
```

### Debug Build Issues
```bash
npm run build -- --verbose  # Verbose build output
npm run astro check          # Type checking
```