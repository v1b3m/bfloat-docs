# Code Style Conventions

Code style and formatting guidelines for the bfloat documentation site:

## TypeScript Configuration
- **Strict mode**: Uses `astro/tsconfigs/strict` base configuration
- **Include**: All files in the project (`**/*`)
- **Exclude**: Build output directory (`dist`)
- **Target**: Modern ES modules with full type safety

## File Naming Conventions

### Documentation Files
- **Lowercase with hyphens**: `quick-start.md`, `llm-integration.md`
- **Descriptive names**: File names should clearly indicate content
- **Consistent extensions**: `.md` for Markdown, `.mdx` for MDX with components

### Directory Structure
- **Logical grouping**: Group related documentation in folders
- **Consistent naming**: Use lowercase with hyphens for folder names
- **Clear hierarchy**: Reflect information architecture in folder structure

## Content Writing Style

### Frontmatter Format
```yaml
---
title: Page Title (Clear and Descriptive)
description: Brief description for SEO and navigation
---
```

### Markdown Conventions
- **Headers**: Use proper hierarchy (`#`, `##`, `###`)
- **Code blocks**: Always specify language for syntax highlighting
- **Links**: Use descriptive link text, avoid "click here"
- **Lists**: Use consistent formatting (bullet points or numbered)

### Code Examples
```typescript
// Always include language identifier
// Use TypeScript for type safety examples
// Include comments for complex concepts

interface ExampleInterface {
  // Document interface properties
  id: string;
  name: string;
}
```

## CSS Styling Guidelines

### Custom CSS Organization
Located in `src/styles/custom.css`:

#### CSS Custom Properties
- Use CSS variables for theming: `--sl-color-*`
- Follow existing variable naming conventions
- Group related properties together

#### Component Classes
- **Semantic naming**: `.api-endpoint`, `.method-get`, `.tech-badge`
- **BEM-inspired**: Descriptive class names over abbreviated ones
- **Consistent patterns**: Follow established naming patterns

#### Responsive Design
- Mobile-first approach
- Use relative units (rem, em) where appropriate
- Consider accessibility in color contrast and sizing

## Documentation Structure Standards

### Page Organization
1. **Title and description** (frontmatter)
2. **Introduction** (what this page covers)
3. **Main content** (organized with clear headers)
4. **Code examples** (where applicable)
5. **Next steps** or **Related links** (navigation aids)

### Navigation Consistency
- Sidebar structure defined in `astro.config.mjs`
- Logical progression from basic to advanced topics
- Clear section groupings with descriptive labels

### Content Guidelines
- **Developer-focused**: Write for technical audience
- **Concise but comprehensive**: Cover all necessary information efficiently
- **Example-driven**: Include practical code samples
- **Actionable**: Provide clear next steps

## Asset Management

### Image Guidelines
- **Optimization**: Use appropriate formats (WebP, SVG for icons)
- **Sizing**: Optimize for web delivery
- **Alt text**: Always provide descriptive alt text
- **Location**: Store in `src/assets/` for optimized images, `public/` for static assets

### File Organization
- Keep related assets near their content
- Use consistent naming for asset files
- Organize assets logically in folders

## Quality Standards

### Content Quality
- **Accuracy**: Ensure all code examples work
- **Completeness**: Cover all aspects of topics
- **Currency**: Keep information up to date
- **Clarity**: Use clear, unambiguous language

### Technical Quality
- **Type safety**: All TypeScript code should be properly typed
- **Performance**: Optimize images and assets
- **Accessibility**: Follow web accessibility guidelines
- **SEO**: Proper meta descriptions and headings

### Review Process
- Test all code examples before publishing
- Verify all links work correctly
- Check spelling and grammar
- Ensure consistent formatting across pages

## Astro/Starlight Specific

### Component Usage
- Use Starlight's built-in components where appropriate: `Card`, `CardGrid`
- Follow component prop patterns from Starlight documentation
- Maintain consistency with Starlight's design system

### Configuration Management
- Keep `astro.config.mjs` organized and commented
- Update sidebar navigation when adding new sections
- Maintain consistent site metadata and SEO settings