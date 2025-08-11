---
title: Development Setup
description: Complete development environment configuration for contributing to bfloat
---

# Development Setup

This guide covers the complete development environment setup for contributing to bfloat, including debugging tools, testing frameworks, and development workflows.

## Prerequisites

Before setting up the development environment, ensure you have:

- **Node.js** 18.17+ or 20+ (recommended: use [fnm](https://github.com/Schniz/fnm) for version management)
- **npm** 9+ or **pnpm** 8+ (pnpm recommended for faster installs)
- **Git** with SSH keys configured
- **Docker** (optional, for local database)
- **PostgreSQL** 14+ (local or Docker)

## Complete Environment Setup

### 1. Repository Setup

```bash
# Clone the repository
git clone git@github.com:bfloat/bfloat-app-engineer.git
cd bfloat-app-engineer

# Install dependencies
npm install
# or
pnpm install
```

### 2. Environment Configuration

Create your environment file:

```bash
cp .env.example .env
```

Configure all required environment variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/bfloat_dev"
DIRECT_URL="postgresql://postgres:password@localhost:5432/bfloat_dev"

# Authentication (Clerk)
CLERK_PUBLISHABLE_KEY="pk_test_xxxxx"
CLERK_SECRET_KEY="sk_test_xxxxx"
CLERK_WEBHOOK_SECRET="whsec_xxxxx"

# AI Providers (configure at least one)
OPENAI_API_KEY="sk-xxxxx"
ANTHROPIC_API_KEY="sk-ant-xxxxx"
GOOGLE_API_KEY="xxxxx"
DEEPSEEK_API_KEY="sk-xxxxx"
XAI_API_KEY="xxxxx"

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID="xxxxx"
AWS_SECRET_ACCESS_KEY="xxxxx"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="bfloat-dev-projects"

# Background Jobs (Redis)
REDIS_URL="redis://localhost:6379"

# Payments (Stripe)
STRIPE_SECRET_KEY="sk_test_xxxxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"

# External Integrations
EXPO_ACCESS_TOKEN="xxxxx"
SUPABASE_SERVICE_ROLE_KEY="xxxxx"
```

### 3. Database Setup

#### Option A: Local PostgreSQL

```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb bfloat_dev

# Run migrations
npx prisma generate
npx prisma db push
npx prisma db seed
```

#### Option B: Docker PostgreSQL

```bash
# Start PostgreSQL with Docker
docker run --name bfloat-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=bfloat_dev \
  -p 5432:5432 \
  -d postgres:14

# Run migrations
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Redis Setup (for background jobs)

```bash
# Install and start Redis (macOS)
brew install redis
brew services start redis

# Or with Docker
docker run --name bfloat-redis -p 6379:6379 -d redis:7
```

### 5. AWS S3 Setup (for file storage)

Create an S3 bucket for development:

```bash
# Using AWS CLI
aws s3 mb s3://bfloat-dev-projects
aws s3api put-bucket-cors --bucket bfloat-dev-projects --cors-configuration file://cors.json
```

CORS configuration (`cors.json`):
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["http://localhost:3000", "http://localhost:5173"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

## Development Workflow

### Starting the Development Server

```bash
# Start the main development server
npm run dev

# The app will be available at:
# http://localhost:3000
```

### Background Services

Start additional services in separate terminals:

```bash
# Background job processor
npm run worker

# Database GUI (optional)
npx prisma studio  # Available at http://localhost:5555
```

### Development Scripts

```bash
# Core development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database operations
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset database (dev only)

# Code quality
npm run lint         # ESLint
npm run lint:fix     # Fix ESLint issues
npm run typecheck    # TypeScript type checking
npm run format       # Prettier formatting

# Testing
npm run test         # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
npm run test:e2e     # End-to-end tests
```

## IDE Configuration

### VS Code Setup

Install recommended extensions:

```json
// .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next",
    "dbaeumer.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

Workspace settings:

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### Environment Variables Validation

Create `.env.local` for development overrides:

```bash
# Development-specific overrides
NODE_ENV=development
LOG_LEVEL=debug
ENABLE_MOCK_DATA=true
```

## Debugging Setup

### Server-Side Debugging

Add debug configuration for Node.js:

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Dev Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/remix",
      "args": ["dev", "--debug"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### Client-Side Debugging

Browser debugging setup:

```typescript
// app/utils/debug.ts
export const debug = {
  log: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data);
    }
  },
  
  time: (label: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.time(label);
    }
  },
  
  timeEnd: (label: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.timeEnd(label);
    }
  }
};
```

### LLM Request Debugging

Debug AI interactions:

```typescript
// app/lib/llm/debug.ts
export const debugLLM = {
  logRequest: (provider: string, messages: Message[]) => {
    console.log(`[LLM] ${provider} Request:`, {
      messageCount: messages.length,
      tokens: countTokens(messages),
      timestamp: new Date().toISOString()
    });
  },
  
  logResponse: (provider: string, response: any, duration: number) => {
    console.log(`[LLM] ${provider} Response:`, {
      duration: `${duration}ms`,
      tokens: response.usage?.total_tokens,
      finishReason: response.finishReason
    });
  }
};
```

## Testing Setup

### Unit Tests with Vitest

```bash
# Install test dependencies (if not already installed)
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Run tests
npm run test
```

Test configuration:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
  },
});
```

### E2E Tests with Playwright

```bash
# Install Playwright
npx playwright install

# Run E2E tests
npm run test:e2e
```

Example E2E test:

```typescript
// tests/e2e/chat.spec.ts
import { test, expect } from '@playwright/test';

test('AI chat generates React Native code', async ({ page }) => {
  await page.goto('/');
  
  // Create new project
  await page.click('text=New Project');
  await page.fill('[placeholder="Describe your app..."]', 'Create a todo list');
  await page.click('text=Start Building');
  
  // Wait for AI response
  await expect(page.locator('.message')).toBeVisible({ timeout: 30000 });
  
  // Check code generation
  await expect(page.locator('code')).toContainText('TodoList');
});
```

## Performance Monitoring

### Development Metrics

Monitor performance during development:

```typescript
// app/lib/monitoring/dev.ts
export const devMetrics = {
  trackLLMLatency: (provider: string, duration: number) => {
    console.log(`[PERF] ${provider} took ${duration}ms`);
    
    if (duration > 5000) {
      console.warn(`[PERF] Slow LLM response from ${provider}`);
    }
  },
  
  trackDatabaseQuery: (query: string, duration: number) => {
    if (duration > 1000) {
      console.warn(`[PERF] Slow database query (${duration}ms):`, query);
    }
  }
};
```

### Bundle Analysis

Analyze bundle size:

```bash
# Analyze bundle
npm run build
npm run analyze

# Or with webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js
```

## Troubleshooting Common Issues

### Database Connection Issues

```bash
# Reset database
npm run db:reset

# Check connection
npx prisma db pull
```

### Environment Variable Issues

```bash
# Validate environment
node -e "console.log(process.env.DATABASE_URL ? '✓ DB configured' : '✗ DB missing')"
```

### Port Conflicts

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Use different port
PORT=3001 npm run dev
```

### LLM Provider Issues

```bash
# Test API keys
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models
```

## Contributing Guidelines

### Code Style

- Use **TypeScript** for all new files
- Follow **Prettier** formatting
- Use **ESLint** rules
- Write **tests** for new features
- Add **JSDoc** comments for complex functions

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-llm-provider

# Commit with conventional commits
git commit -m "feat: add support for Grok LLM provider"

# Push and create PR
git push origin feature/new-llm-provider
```

### Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch
3. **Write** tests for new functionality
4. **Update** documentation
5. **Submit** pull request with clear description

The development environment is now ready for contributing to bfloat! Start with the [Quick Start](/getting-started/quick-start/) guide if you haven't already, then explore the [Architecture](/getting-started/architecture/) to understand the system design.

## Next Steps

- **[Architecture Overview](/getting-started/architecture/)** - Understand the complete system design
- **[LLM Integration](/core-concepts/llm-integration/)** - Learn about AI provider integration
- **[API Reference](/api/routes-overview/)** - Explore the complete API documentation