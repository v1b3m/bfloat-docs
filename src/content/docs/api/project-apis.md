---
title: Project APIs
description: Project management, file operations, and React Native project lifecycle endpoints
---

# Project APIs

The Project APIs handle the complete lifecycle of React Native projects in bfloat - from creation to deployment. These endpoints manage project metadata, file storage, collaboration, and integration with external services.

## Core Endpoints

### GET /api/projects

**List user projects with pagination and filtering**

Retrieves all projects accessible to the authenticated user, including personal projects and shared collaborations.

#### Request Parameters

```typescript
interface ListProjectsParams {
  limit?: number;          // Default: 20, Max: 100
  cursor?: string;         // Pagination cursor
  sort?: 'created' | 'updated' | 'name';
  order?: 'asc' | 'desc';  // Default: 'desc'
  filter?: {
    isPublic?: boolean;
    template?: string;
    hasDeployments?: boolean;
  };
}
```

#### Example Request

```bash
curl -X GET '/api/projects?limit=10&sort=updated&filter[isPublic]=true' \
  -H "Authorization: Bearer <clerk-token>"
```

#### Response

```typescript
interface ListProjectsResponse {
  success: true;
  data: Project[];
  metadata: {
    pagination: {
      hasNext: boolean;
      hasPrev: boolean;
      nextCursor?: string;
      prevCursor?: string;
      total?: number;
    }
  }
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  userId: string;
  template: string;
  isPublic: boolean;
  appIconUrl?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Project status
  updateInProgress: boolean;
  lastEntryId?: string;
  
  // Deployment info
  deployments?: Deployment[];
  
  // Collaboration
  collaborators?: User[];
  
  // Metadata
  messageCount: number;
  fileCount: number;
  lastActivity: string;
}
```

#### Features

- **📊 Rich Metadata**: Project statistics, activity, and deployment status
- **🔍 Advanced Filtering**: Filter by template, public status, deployment state
- **👥 Collaboration Info**: Shared projects and collaborator details
- **⚡ Performance**: Cursor-based pagination for large project lists

---

### POST /api/projects

**Create new React Native projects**

Creates a new project from a prompt, template, or file uploads with automatic title generation and icon creation.

#### Request

```typescript
interface CreateProjectRequest {
  prompt: string;          // Project description/requirements
  template?: string;       // JSON string of template files
  title?: string;          // Optional custom title
  files?: File[];          // Upload existing files
  settings?: ProjectSettings;
}

interface ProjectSettings {
  isPublic?: boolean;
  template?: 'expo-router' | 'navigation' | 'blank';
  features?: string[];     // ['navigation', 'state-management', 'authentication']
}
```

#### Example Request

```bash
curl -X POST /api/projects \
  -H "Content-Type: multipart/form-data" \
  -H "Authorization: Bearer <clerk-token>" \
  -F 'prompt=Create a fitness tracking app with workout logging' \
  -F 'template={"App.tsx": "export default function App() {...}"}' \
  -F 'files=@design.png'
```

#### Response

```typescript
interface CreateProjectResponse {
  success: true;
  data: {
    projectId: string;
    title: string;        // AI-generated title
    prompt: string;
    messages: Message[];  // Initial conversation
    appIconUrl?: string;  // AI-generated app icon
    template: ProjectTemplate;
  }
}
```

#### Features

- **🤖 AI Title Generation**: Automatic project naming based on description
- **🎨 Icon Generation**: AI-created app icons matching the project theme
- **📁 File Uploads**: Support for design files, existing code, and assets
- **📋 Template Selection**: Pre-configured project templates
- **💬 Initial Conversation**: Sets up first chat message for immediate development

---

### GET /api/projects/:id

**Get detailed project information**

Retrieves complete project details including files, messages, deployment history, and collaboration data.

#### Request Parameters

```typescript
interface GetProjectParams {
  include?: ('messages' | 'files' | 'deployments' | 'collaborators')[];
  fileLimit?: number;      // Limit file responses for large projects
  messageLimit?: number;   // Limit message history
}
```

#### Example Request

```bash
curl -X GET '/api/projects/proj_abc123?include=messages,deployments' \
  -H "Authorization: Bearer <clerk-token>"
```

#### Response

```typescript
interface GetProjectResponse {
  success: true;
  data: {
    project: Project;
    files?: ProjectFile[];
    messages?: Message[];
    deployments?: Deployment[];
    collaborators?: User[];
    integrations?: Integration[];
  }
}

interface ProjectFile {
  path: string;
  content: string;
  size: number;
  mimeType: string;
  lastModified: string;
  isGenerated: boolean;    // AI-generated vs user-uploaded
}
```

---

### PUT /api/projects/:id

**Update project configuration and metadata**

Updates project settings, metadata, and configuration without modifying the actual project files.

#### Request

```typescript
interface UpdateProjectRequest {
  title?: string;
  description?: string;
  isPublic?: boolean;
  settings?: ProjectSettings;
  collaborators?: {
    add?: string[];      // User IDs to add
    remove?: string[];   // User IDs to remove  
  };
  integrations?: IntegrationConfig[];
}

interface IntegrationConfig {
  type: 'supabase' | 'expo' | 'app-store-connect';
  config: Record<string, any>;
}
```

#### Example Request

```bash
curl -X PUT /api/projects/proj_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <clerk-token>" \
  -d '{
    "title": "Fitness Tracker Pro",
    "isPublic": true,
    "settings": {
      "features": ["navigation", "state-management"]
    }
  }'
```

#### Response

```typescript
interface UpdateProjectResponse {
  success: true;
  data: {
    project: Project;
    updated: string[];    // Fields that were updated
  }
}
```

---

### DELETE /api/projects/:id

**Delete projects and cleanup resources**

Permanently deletes a project and all associated resources including files, deployments, and chat history.

#### Request

```typescript
interface DeleteProjectRequest {
  confirm?: boolean;       // Required for safety
  cleanup?: {
    deleteFiles?: boolean;     // Default: true
    deleteDeployments?: boolean; // Default: false (preserve deployed apps)
    revokeSharing?: boolean;   // Default: true
  };
}
```

#### Example Request

```bash
curl -X DELETE /api/projects/proj_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <clerk-token>" \
  -d '{"confirm": true}'
```

#### Response

```typescript
interface DeleteProjectResponse {
  success: true;
  data: {
    projectId: string;
    deleted: {
      files: number;
      messages: number; 
      deployments: number;
    };
    preserved: {
      deployments?: string[];  // IDs of preserved deployments
    };
  }
}
```

---

## File Management APIs

### GET /api/files

**Retrieve project file structure and contents**

Gets the complete file tree and contents for a project, with support for large projects and selective loading.

#### Request Parameters

```typescript
interface GetFilesParams {
  projectId: string;
  path?: string;           // Get specific directory/file
  recursive?: boolean;     // Include subdirectories
  includeContent?: boolean; // Include file contents (default: true for small projects)
  limit?: number;          // Limit number of files returned
  types?: string[];        // Filter by file extensions
}
```

#### Example Request

```bash
curl -X GET '/api/files?projectId=proj_abc123&path=src/screens&recursive=true' \
  -H "Authorization: Bearer <clerk-token>"
```

#### Response

```typescript
interface GetFilesResponse {
  success: true;
  data: {
    files: ProjectFile[];
    structure: FileTreeNode;
    metadata: {
      totalFiles: number;
      totalSize: number;
      lastModified: string;
    }
  }
}

interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileTreeNode[];
  size?: number;
  lastModified?: string;
}
```

---

### POST /api/files

**Save generated or uploaded files to project**

Saves new files to a project, typically called after AI generation or user uploads.

#### Request

```typescript
interface SaveFilesRequest {
  projectId: string;
  files: {
    path: string;
    content: string;
    mimeType?: string;
    isGenerated?: boolean;  // Marks AI-generated files
  }[];
  operation: 'create' | 'update' | 'upsert';
  message?: string;        // Commit message for file changes
}
```

#### Example Request

```bash
curl -X POST /api/files \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <clerk-token>" \
  -d '{
    "projectId": "proj_abc123",
    "operation": "upsert",
    "files": [
      {
        "path": "src/screens/LoginScreen.tsx",
        "content": "import React from \"react\"...",
        "isGenerated": true
      }
    ]
  }'
```

#### Response

```typescript
interface SaveFilesResponse {
  success: true;
  data: {
    projectId: string;
    filesCreated: number;
    filesUpdated: number;
    totalSize: number;
    s3Key: string;          // Storage reference
    version: string;        // File version for caching
  }
}
```

---

## Project Analytics & Stats

### GET /api/project-stats

**Get project usage and performance analytics**

Provides detailed analytics for project usage, AI generation metrics, and performance data.

#### Request Parameters

```typescript
interface ProjectStatsParams {
  projectId?: string;      // Specific project, or all user projects
  timeRange?: '24h' | '7d' | '30d' | '90d';
  metrics?: ('messages' | 'files' | 'deployments' | 'usage')[];
}
```

#### Response

```typescript
interface ProjectStatsResponse {
  success: true;
  data: {
    overview: {
      totalProjects: number;
      totalMessages: number;
      totalFiles: number;
      totalDeployments: number;
    };
    usage: {
      aiGenerations: number;
      tokensUsed: number;
      storageUsed: number;  // In bytes
    };
    activity: {
      date: string;
      messages: number;
      files: number;
      deployments: number;
    }[];
    topProjects: {
      projectId: string;
      title: string;
      activity: number;
    }[];
  }
}
```

---

## Project Templates

### GET /api/project-templates

**List available project templates**

Returns available React Native project templates with their configurations and features.

#### Response

```typescript
interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'navigation' | 'data' | 'auth' | 'ecommerce';
  features: string[];
  files: Record<string, string>;  // Template files
  dependencies: Record<string, string>;
  preview?: {
    images: string[];
    demo: string;
  };
  metadata: {
    complexity: 'beginner' | 'intermediate' | 'advanced';
    estimatedSetupTime: number;  // In minutes
    popularity: number;
  };
}
```

### Example Templates

```typescript
const TEMPLATES = {
  'expo-router-basic': {
    name: 'Expo Router Basic',
    description: 'Simple app with file-based routing',
    category: 'basic',
    features: ['expo-router', 'typescript', 'safe-area'],
    files: {
      'App.tsx': '...',
      'app/(tabs)/index.tsx': '...',
      'package.json': '...'
    }
  },
  'navigation-drawer': {
    name: 'Navigation + Drawer',
    description: 'Complete navigation setup with drawer and tabs',
    category: 'navigation', 
    features: ['react-navigation', 'drawer', 'tabs', 'typescript'],
    files: { /* template files */ }
  },
  'auth-supabase': {
    name: 'Authentication with Supabase',
    description: 'Full auth flow with Supabase backend',
    category: 'auth',
    features: ['supabase', 'auth', 'database', 'typescript'],
    files: { /* template files */ }
  }
} as const;
```

---

## Project Collaboration

### POST /api/projects/:id/share

**Share projects with other users**

Enables collaboration by sharing projects with other users with configurable permissions.

#### Request

```typescript
interface ShareProjectRequest {
  users: {
    email: string;
    role: 'viewer' | 'editor' | 'admin';
  }[];
  settings: {
    allowPublicView?: boolean;
    allowForking?: boolean;
    expiresAt?: string;     // Optional expiration
  };
  message?: string;         // Invitation message
}
```

#### Response

```typescript
interface ShareProjectResponse {
  success: true;
  data: {
    projectId: string;
    invitations: {
      email: string;
      invitationId: string;
      status: 'sent' | 'accepted' | 'declined';
    }[];
    publicUrl?: string;     // If public sharing enabled
  }
}
```

---

### GET /api/projects/:id/collaborators

**List project collaborators and permissions**

#### Response

```typescript
interface CollaboratorsResponse {
  success: true;
  data: {
    owner: User;
    collaborators: {
      user: User;
      role: 'viewer' | 'editor' | 'admin';
      joinedAt: string;
      lastActive: string;
    }[];
    pendingInvitations: {
      email: string;
      role: string;
      invitedAt: string;
      expiresAt: string;
    }[];
  }
}
```

---

## Project Forking

### POST /api/projects/:id/fork

**Create a copy of an existing project**

Creates a personal copy of a project (your own or a public project) for independent development.

#### Request

```typescript
interface ForkProjectRequest {
  title?: string;          // Custom title for fork
  isPublic?: boolean;      // Make fork public
  includeHistory?: boolean; // Include chat history (default: false)
}
```

#### Response

```typescript
interface ForkProjectResponse {
  success: true;
  data: {
    originalProjectId: string;
    forkedProjectId: string;
    title: string;
    filesCount: number;
    forkedAt: string;
  }
}
```

---

## Integration with External Services

### Supabase Integration

Projects can be connected to Supabase for backend services:

```typescript
// Project with Supabase integration
interface SupabaseProject extends Project {
  supabase: {
    projectRef: string;
    databaseUrl: string;
    anonKey: string;
    serviceKey: string;
    connected: boolean;
  };
}
```

### Expo Integration

Integration with Expo Application Services for deployment:

```typescript
interface ExpoIntegration {
  username: string;
  accessToken: string;
  projects: {
    slug: string;
    name: string;
    platforms: ('ios' | 'android' | 'web')[];
    lastBuild: string;
  }[];
}
```

## Error Handling

### Common Error Scenarios

```typescript
// Project not found
{
  "success": false,
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "Project not found or access denied",
    "details": { "projectId": "proj_123" }
  }
}

// Project size limit exceeded  
{
  "success": false,
  "error": {
    "code": "PROJECT_SIZE_LIMIT",
    "message": "Project exceeds size limit",
    "details": { 
      "currentSize": 104857600,
      "limit": 100000000
    }
  }
}

// Insufficient permissions
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "You don't have permission to perform this action",
    "details": { "required": "editor", "current": "viewer" }
  }
}

// Validation errors
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "field": "title",
      "reason": "Title must be between 1 and 100 characters"
    }
  }
}
```

## Performance Considerations

### File Storage Optimization

```typescript
// Large project file handling
const getProjectFiles = async (projectId: string, options: FileOptions) => {
  if (options.includeContent && totalFiles > 100) {
    // Return file structure only for large projects
    return {
      files: fileStructure,
      contentUrl: `/api/files/${projectId}/content`, // Separate endpoint for content
      streaming: true
    };
  }
  
  return {
    files: filesWithContent
  };
};
```

### Caching Strategy

```typescript
// Redis caching for frequently accessed projects
const getCachedProject = async (projectId: string): Promise<Project | null> => {
  const cached = await redis.get(`project:${projectId}`);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const project = await db.project.findUnique({ where: { id: projectId } });
  
  if (project) {
    await redis.setex(`project:${projectId}`, 300, JSON.stringify(project));
  }
  
  return project;
};
```

The Project APIs provide comprehensive management of React Native projects throughout their entire lifecycle, from initial creation through development, collaboration, and deployment, while maintaining high performance and reliability standards.

## Next Steps

- **[Deployment APIs](/api/deployment-apis/)** - React Native app deployment and distribution
- **[Database Schema](/api/database-schema/)** - Complete data model reference
- **[LLM APIs](/api/llm-apis/)** - AI-powered code generation endpoints