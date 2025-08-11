// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://v1b3m.github.io",
  base: "/bfloat-docs", // Only if using project pages
  integrations: [
    starlight({
      title: "bfloat Developer Docs",
      description:
        "Comprehensive developer documentation for the bfloat LLM-powered React Native app generator platform.",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/bfloat/bfloat-app-engineer",
        },
      ],
      customCss: [
        // Custom CSS for code syntax highlighting and theme
        "./src/styles/custom.css",
      ],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Quick Start", slug: "getting-started/quick-start" },
            {
              label: "Development Setup",
              slug: "getting-started/development-setup",
            },
            {
              label: "Project Overview",
              slug: "getting-started/project-overview",
            },
            { label: "Architecture", slug: "getting-started/architecture" },
          ],
        },
        {
          label: "Core Concepts",
          items: [
            { label: "LLM Integration", slug: "core-concepts/llm-integration" },
            {
              label: "React Native Generation",
              slug: "core-concepts/react-native-generation",
            },
            {
              label: "State Management",
              slug: "core-concepts/state-management",
            },
            { label: "File System", slug: "core-concepts/file-system" },
            { label: "Authentication", slug: "core-concepts/authentication" },
          ],
        },
        {
          label: "API Reference",
          items: [
            { label: "Routes Overview", slug: "api/routes-overview" },
            { label: "LLM APIs", slug: "api/llm-apis" },
            { label: "Project APIs", slug: "api/project-apis" },
            // { label: 'Deployment APIs', slug: 'api/deployment-apis' },
            { label: "Database Schema", slug: "api/database-schema" },
          ],
        },
        {
          label: "Components",
          items: [
            // { label: 'UI Components', slug: 'components/ui-components' },
            // { label: 'Chat Components', slug: 'components/chat-components' },
            // { label: 'Editor Components', slug: 'components/editor-components' },
            // { label: 'Project Components', slug: 'components/project-components' },
          ],
        },
        {
          label: "Guides",
          items: [
            // { label: 'Adding LLM Providers', slug: 'guides/adding-llm-providers' },
            // { label: 'Creating New Components', slug: 'guides/creating-components' },
            // { label: 'Extending the API', slug: 'guides/extending-api' },
            // { label: 'Database Migrations', slug: 'guides/database-migrations' },
            // { label: 'Deployment Guide', slug: 'guides/deployment' },
          ],
        },
        {
          label: "Development",
          items: [
            // { label: 'Code Style Guide', slug: 'development/code-style' },
            // { label: 'Testing Strategy', slug: 'development/testing' },
            // { label: 'Debugging', slug: 'development/debugging' },
            // { label: 'Performance', slug: 'development/performance' },
            // { label: 'Contributing', slug: 'development/contributing' },
          ],
        },
        {
          label: "Reference",
          items: [
            // { label: 'Environment Variables', slug: 'reference/environment-variables' },
            // { label: 'Configuration', slug: 'reference/configuration' },
            // { label: 'CLI Commands', slug: 'reference/cli-commands' },
            // { label: 'Troubleshooting', slug: 'reference/troubleshooting' },
          ],
        },
      ],
    }),
  ],
});
