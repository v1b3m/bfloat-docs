---
title: Quick Start
description: Get up and running with bfloat development in under 5 minutes
---

# Quick Start Guide

Get your bfloat development environment set up and running in under 5 minutes. This guide assumes you're familiar with TypeScript, React, and Node.js.

## Prerequisites

### Required Tools
- **Node.js** 18.17+ or 20+ 
- **npm** 9+ or **pnpm** 8+
- **Git** for version control
- **Docker** (optional, for containers)

### Recommended Tools
- **VS Code** with TypeScript support
- **Postman** for API testing
- **TablePlus** for database management

## Installation Steps

### 1. Clone and Install

```bash
git clone https://github.com/bfloat/bfloat-app-engineer
cd bfloat-app-engineer
npm install
```

### 2. Environment Setup

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Essential environment variables:
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bfloat"

# Authentication
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# LLM Providers (at least one required)
OPENAI_API_KEY=sk-xxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

### 3. Database Setup

Initialize and migrate the database:

```bash
npx prisma generate
npx prisma db push
npx prisma db seed # Optional: adds sample data
```

### 4. Start Development Server

Launch the development environment:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 5. Verify Installation

Open your browser and:
- ✅ See the bfloat homepage
- ✅ Sign up/login works (Clerk auth)
- ✅ Create a test project
- ✅ Try generating a simple React Native component

## What's Next?

- **🏗️ Architecture Overview**: Understand how bfloat processes AI requests and generates React Native apps → [Learn the architecture](/getting-started/architecture/)
- **🧠 Core Concepts**: Dive deeper into LLM integration, state management, and file handling → [Explore concepts](/core-concepts/llm-integration/)
- **🔧 Development Setup**: Complete development environment with debugging, testing, and hot reload → [Full setup guide](/getting-started/development-setup/)

## Common Issues

### Database Connection Errors
If you see `P1001: Can't reach database server`, ensure PostgreSQL is running and the connection string is correct.

### Missing API Keys
The app will show LLM provider errors without proper API keys. Check the [Environment Variables](/reference/environment-variables/) reference.

### Port Already in Use
If port 3000 is busy, the dev server will automatically use the next available port (3001, 3002, etc.).

---

**💡 Pro Tip**: Set up the [VS Code workspace settings](https://github.com/bfloat/bfloat-app-engineer/blob/main/.vscode/settings.json) for optimal TypeScript IntelliSense and auto-formatting.