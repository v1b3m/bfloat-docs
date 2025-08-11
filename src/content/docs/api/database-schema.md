---
title: Database Schema
description: Complete database schema and data model reference for bfloat
---

# Database Schema

bfloat uses PostgreSQL with Prisma ORM for robust data management. The schema is optimized for AI-powered React Native project generation, user management, and deployment workflows.

## Schema Overview

```mermaid
erDiagram
    User ||--o{ Project : creates
    User ||--|| Subscription : has
    User ||--|| AccountSettings : has
    User ||--o{ DeployedApp : deploys
    User ||--o{ Integrations : configures
    
    Project ||--o{ DeployedApp : "has deployments"
    Project {
        string id PK
        string title
        string description
        json messages
        string filesS3Key
        string userId FK
        json template
        boolean isPublic
        boolean updateInProgress
        datetime createdAt
        datetime updatedAt
    }
    
    DeployedApp {
        string id PK
        string userId FK
        string projectId FK
        string status
        string deploymentType
        datetime deployedAt
    }
    
    Subscription {
        string id PK
        string userId FK
        string tier
        string status
        string stripeCustomerId
        string stripeSubscriptionId
    }
```

## Core Models

### Project

**Primary model for React Native projects**

```prisma
model Project {
  id                 String        @id @unique @default(uuid())
  title              String
  description        String?
  messages           Json          @default("[]")
  filesS3Key         String?       // S3 bucket key for project files
  createdAt          DateTime      @default(now()) @db.Timestamptz(6)
  updatedAt          DateTime      @updatedAt @db.Timestamptz(6)
  userId             String?
  template_version   String?
  template           Json?
  isPublic           Boolean       @default(false)
  
  // Supabase Integration
  supabaseProjectRef String?
  supabaseAnonKey    String?
  supabaseUrl        String?
  
  // Project Status
  updateInProgress   Boolean       @default(false)
  lastEntryId        String?
  
  // App Configuration
  androidAppIconUrl  String?
  androidPackageName String?
  iosAppIconUrl      String?
  appIconUrl         String?
  iosBundleId        String?
  slug               String?
  iosAppId           String?
  
  // Soft Delete & Favorites
  isFavorite         Boolean       @default(false)
  deletedAt          DateTime?     @db.Timestamptz(6)
  
  // Relations
  deployedApps       DeployedApp[]

  @@index([createdAt(sort: Desc)])
}
```

#### Key Fields Explained

- **`messages`**: JSON array of chat conversation history
- **`filesS3Key`**: Reference to S3 storage where project files are stored
- **`template`**: JSON object containing base project template configuration
- **`updateInProgress`**: Flag to prevent concurrent AI generation
- **`lastEntryId`**: Used for streaming connection management

#### Usage Patterns

```typescript
// Create new project
const project = await prisma.project.create({
  data: {
    title: "Fitness Tracker",
    description: "A comprehensive fitness tracking app",
    userId: "user_123",
    template: {
      name: "expo-router",
      version: "1.0.0"
    },
    messages: [],
    isPublic: false
  }
});

// Update project with generated files
await prisma.project.update({
  where: { id: projectId },
  data: {
    filesS3Key: `projects/${projectId}/files-v${Date.now()}.json`,
    messages: [...existingMessages, newMessage],
    updateInProgress: false,
    updatedAt: new Date()
  }
});

// Soft delete project
await prisma.project.update({
  where: { id: projectId },
  data: { deletedAt: new Date() }
});
```

---

### DeployedApp

**Tracks React Native app deployments and builds**

```prisma
model DeployedApp {
  id                    String           @id @default(uuid())
  userId                String
  status                DeploymentStatus @default(in_progress)
  deployedAt            DateTime         @default(now()) @db.Timestamptz(6)
  updatedAt             DateTime         @updatedAt @db.Timestamptz(6)
  projectId             String?
  webUrl                String?
  deploymentType        String?          // 'expo', 'eas-build', 'manual'
  createdAt             DateTime         @default(now()) @db.Timestamptz(6)
  
  // Build URLs
  androidBuildUrl       String?
  iosBuildUrl           String?
  applicationArchiveUrl String?
  buildDetailsPageUrl   String?
  
  // App Metadata
  appVersion            String?
  projectName           String?
  
  // Relations
  Project               Project?         @relation(fields: [projectId], references: [id])

  @@index([projectId])
}

enum DeploymentStatus {
  in_progress
  aborted
  successful
}
```

#### Deployment Workflow

```typescript
// Start deployment
const deployment = await prisma.deployedApp.create({
  data: {
    userId: "user_123",
    projectId: "proj_456",
    status: "in_progress",
    deploymentType: "eas-build",
    appVersion: "1.0.0"
  }
});

// Update with build URLs
await prisma.deployedApp.update({
  where: { id: deployment.id },
  data: {
    status: "successful",
    androidBuildUrl: "https://expo.dev/builds/...",
    iosBuildUrl: "https://expo.dev/builds/...",
    buildDetailsPageUrl: "https://expo.dev/projects/..."
  }
});
```

---

### Subscription

**User subscription and billing management**

```prisma
model Subscription {
  id                   String           @id @default(cuid())
  userId               String           @unique
  status               String           @default("inactive")
  stripeCustomerId     String?          @unique
  stripeSubscriptionId String?          @unique
  currentPeriodEnd     DateTime?
  cancelAtPeriodEnd    Boolean          @default(false)
  createdAt            DateTime         @default(now())
  updatedAt            DateTime         @updatedAt
  priceId              String?
  canceledAt           DateTime?
  tier                 SubscriptionTier @default(free)
}

enum SubscriptionTier {
  free
  pro
  super
}
```

#### Subscription Tiers

```typescript
const SUBSCRIPTION_FEATURES = {
  free: {
    dailyMessageLimit: 10,
    monthlyMessageLimit: 100,
    maxProjects: 3,
    maxDeployments: 1,
    features: ['basic-templates', 'public-sharing']
  },
  pro: {
    dailyMessageLimit: 100,
    monthlyMessageLimit: 1000,
    maxProjects: 50,
    maxDeployments: 10,
    features: ['all-templates', 'private-projects', 'integrations', 'priority-support']
  },
  super: {
    dailyMessageLimit: 1000,
    monthlyMessageLimit: 10000,
    maxProjects: -1, // unlimited
    maxDeployments: -1, // unlimited
    features: ['everything', 'white-label', 'custom-templates', 'dedicated-support']
  }
} as const;
```

---

### AccountSettings

**User preferences and third-party integrations**

```prisma
model AccountSettings {
  id                     String    @id @default(cuid())
  userId                 String    @unique
  theme                  String    @default("light")
  defaultProjectTemplate String?
  language               String    @default("en")
  timezone               String    @default("UTC")
  createdAt              DateTime  @default(now())
  updatedAt              DateTime  @updatedAt
  emailNotifications     Boolean   @default(true)
  
  // Supabase OAuth Integration
  supabaseAccessToken    String?
  supabaseOrgId          String?
  supabaseRefreshToken   String?
  supabaseTokenExpiresAt DateTime?
  oauthState             String?
}
```

#### OAuth Integration Workflow

```typescript
// Store OAuth credentials
await prisma.accountSettings.upsert({
  where: { userId },
  create: {
    userId,
    supabaseAccessToken: tokens.access_token,
    supabaseRefreshToken: tokens.refresh_token,
    supabaseTokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
    supabaseOrgId: orgId
  },
  update: {
    supabaseAccessToken: tokens.access_token,
    supabaseRefreshToken: tokens.refresh_token,
    supabaseTokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000)
  }
});
```

---

### Integrations

**Third-party service configurations**

```prisma
model Integrations {
  id              String   @id @default(uuid())
  userId          String
  type            String?   // 'expo', 'app-store-connect', 'google-play'
  createdAt       DateTime @default(now())
  updatedAt       DateTime
  
  // Expo Integration
  expoAccessToken String?
  expoUsername    String?
  
  // App Store Connect Integration
  iosIssuerId     String?
  iosKeyId        String?

  @@unique([userId, type])
}
```

#### Integration Types

```typescript
interface ExpoIntegration {
  type: 'expo';
  expoAccessToken: string;
  expoUsername: string;
}

interface AppStoreConnectIntegration {
  type: 'app-store-connect';
  iosIssuerId: string;
  iosKeyId: string;
  privateKeyContent: string; // Stored securely, not in database
}

interface GooglePlayIntegration {
  type: 'google-play';
  serviceAccountJson: string; // Encrypted
  packageName: string;
}
```

---

## Advanced Queries

### Project Analytics

```typescript
// Get user project statistics
const userStats = await prisma.$queryRaw`
  SELECT 
    COUNT(*) as total_projects,
    COUNT(CASE WHEN "isPublic" = true THEN 1 END) as public_projects,
    COUNT(CASE WHEN "deletedAt" IS NULL THEN 1 END) as active_projects,
    AVG(CASE WHEN "deletedAt" IS NULL THEN 
      jsonb_array_length("messages"::jsonb) 
    END) as avg_messages_per_project,
    MAX("updatedAt") as last_activity
  FROM "Project" 
  WHERE "userId" = ${userId}
`;

// Get deployment success rate
const deploymentStats = await prisma.deployedApp.groupBy({
  by: ['status'],
  where: { userId },
  _count: { status: true },
  orderBy: { status: 'asc' }
});
```

### Message Search

```typescript
// Search within project messages (requires JSON path queries)
const searchResults = await prisma.$queryRaw`
  SELECT p.id, p.title, msg.value as message
  FROM "Project" p,
  jsonb_array_elements(p.messages) as msg
  WHERE p."userId" = ${userId}
  AND msg.value->>'content' ILIKE ${'%' + searchTerm + '%'}
  AND p."deletedAt" IS NULL
  ORDER BY p."updatedAt" DESC
  LIMIT 20
`;
```

### Recent Activity

```typescript
// Get recent user activity across all models
const recentActivity = await prisma.$queryRaw`
  (
    SELECT 'project' as type, title as name, "createdAt" as timestamp, id
    FROM "Project" 
    WHERE "userId" = ${userId} AND "deletedAt" IS NULL
  )
  UNION ALL
  (
    SELECT 'deployment' as type, "projectName" as name, "deployedAt" as timestamp, id
    FROM "DeployedApp"
    WHERE "userId" = ${userId}
  )
  ORDER BY timestamp DESC
  LIMIT 10
`;
```

---

## Database Optimization

### Indexes

```sql
-- Existing indexes from schema
CREATE INDEX idx_project_created_at ON "Project"("createdAt" DESC);
CREATE INDEX idx_deployed_app_project_id ON "DeployedApp"("projectId");
CREATE UNIQUE INDEX idx_subscription_user_id ON "Subscription"("userId");
CREATE UNIQUE INDEX idx_account_settings_user_id ON "AccountSettings"("userId");
CREATE UNIQUE INDEX idx_integrations_user_type ON "Integrations"("userId", "type");

-- Additional recommended indexes for performance
CREATE INDEX idx_project_user_public ON "Project"("userId", "isPublic", "deletedAt");
CREATE INDEX idx_project_updated_at ON "Project"("updatedAt" DESC) WHERE "deletedAt" IS NULL;
CREATE INDEX idx_deployed_app_status ON "DeployedApp"("status", "userId");
CREATE INDEX idx_subscription_stripe_customer ON "Subscription"("stripeCustomerId");
```

### Connection Pooling

```typescript
// Prisma connection configuration
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['query', 'info', 'warn', 'error'],
});

// Connection pool settings via DATABASE_URL
// postgresql://user:password@host:port/database?pgbouncer=true&connection_limit=10
```

---

## Data Migration Patterns

### Safe Schema Changes

```typescript
// Migration example: Adding new field with default
export default {
  async up(prisma: PrismaClient) {
    // Add column with default value
    await prisma.$executeRaw`
      ALTER TABLE "Project" 
      ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[]
    `;
    
    // Update existing records if needed
    await prisma.project.updateMany({
      where: { tags: null },
      data: { tags: [] }
    });
  },
  
  async down(prisma: PrismaClient) {
    await prisma.$executeRaw`ALTER TABLE "Project" DROP COLUMN "tags"`;
  }
};
```

### Data Backfill

```typescript
// Backfill example: Adding project slugs
export default {
  async up(prisma: PrismaClient) {
    const projects = await prisma.project.findMany({
      where: { slug: null },
      select: { id: true, title: true }
    });
    
    for (const project of projects) {
      const slug = project.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
        
      await prisma.project.update({
        where: { id: project.id },
        data: { slug: `${slug}-${project.id.slice(-6)}` }
      });
    }
  }
};
```

---

## Security Considerations

### Row-Level Security (Future Enhancement)

```sql
-- Example RLS policies for multi-tenant security
CREATE POLICY project_user_policy ON "Project"
  FOR ALL USING (
    "userId" = current_setting('app.user_id') 
    OR "isPublic" = true
  );

CREATE POLICY subscription_user_policy ON "Subscription"
  FOR ALL USING ("userId" = current_setting('app.user_id'));
```

### Data Encryption

```typescript
// Sensitive data encryption utilities
import { encrypt, decrypt } from '~/lib/encryption';

// Store encrypted integration credentials
const encryptedToken = encrypt(integrationToken);
await prisma.integrations.create({
  data: {
    userId,
    type: 'expo',
    expoAccessToken: encryptedToken
  }
});

// Retrieve and decrypt
const integration = await prisma.integrations.findUnique({
  where: { userId_type: { userId, type: 'expo' } }
});
const decryptedToken = decrypt(integration.expoAccessToken);
```

---

## Performance Monitoring

### Query Analysis

```typescript
// Prisma query logging and metrics
const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'info', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
    { level: 'error', emit: 'stdout' },
  ],
});

prisma.$on('query', (e) => {
  if (e.duration > 1000) { // Log slow queries
    console.warn('Slow query detected:', {
      query: e.query,
      params: e.params,
      duration: e.duration + 'ms'
    });
  }
});
```

### Connection Health

```typescript
// Database health check
export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', timestamp: new Date() };
  } catch (error) {
    return { 
      status: 'unhealthy', 
      error: error.message,
      timestamp: new Date() 
    };
  }
}
```

The database schema is designed to support bfloat's core functionality while maintaining performance, security, and scalability. The design emphasizes JSON flexibility for AI-generated content while maintaining relational integrity for critical business data.

## Next Steps

- **[Routes Overview](/api/routes-overview/)** - Complete API endpoint documentation
- **[LLM APIs](/api/llm-apis/)** - AI-powered code generation endpoints  
- **[Project APIs](/api/project-apis/)** - Project management operations