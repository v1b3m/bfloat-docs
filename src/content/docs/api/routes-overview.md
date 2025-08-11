---
title: Routes Overview
description: Complete overview of bfloat's API endpoints and their organization
---

# API Routes Overview

bfloat's API is built on React Router v7's file-based routing system, providing a comprehensive set of endpoints for AI-powered React Native app generation, project management, and user interactions.

## API Architecture

### Route Organization

```
app/routes/
├── api.chat.ts                 # Chat/LLM interactions
├── api.chat-new.ts             # New chat sessions
├── api.projects.ts             # Project CRUD operations
├── api.projects.$id.ts         # Individual project operations
├── api.files.ts                # File management
├── api.deploy.ts               # Deployment operations
├── api.deploy.ios.ts           # iOS-specific deployment
├── api.subscription.ts         # User subscriptions
├── api.settings.tsx            # User settings
├── api.integrations.ts         # Third-party integrations
└── api.webhook.ts              # External webhooks
```

### Authentication Pattern

All API routes use Clerk for authentication with consistent patterns:

```typescript
// Standard authentication check
export async function loader({ request }: LoaderFunctionArgs) {
  const { userId } = await getAuth(request);
  if (!userId) {
    throw redirect('/sign-in');
  }
  // Route logic...
}

// Project access validation
export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireAuth(request);
  const project = await requireProjectAccess(request, params.id);
  // Route logic...
}
```

## Core API Groups

### 1. Chat & LLM APIs

**Primary endpoint for AI interactions and code generation**

- **`POST /api/chat`** - Stream AI responses for code generation
- **`POST /api/chat-new`** - Start new chat sessions
- **`POST /api/llmcall`** - Direct LLM API calls
- **`POST /api/init-stream`** - Initialize streaming connections

### 2. Project Management APIs

**Complete project lifecycle management**

- **`GET /api/projects`** - List user projects with pagination
- **`POST /api/projects`** - Create new React Native projects
- **`GET /api/projects/:id`** - Get specific project details
- **`PUT /api/projects/:id`** - Update project configuration
- **`DELETE /api/projects/:id`** - Delete projects and cleanup

### 3. File Management APIs

**Handle generated React Native project files**

- **`GET /api/files`** - Retrieve project file structure
- **`POST /api/files`** - Save generated files to storage
- **`PUT /api/files`** - Update individual files
- **`DELETE /api/files`** - Remove files from project

### 4. Deployment APIs

**React Native app deployment and distribution**

- **`POST /api/deploy`** - Deploy to Expo Application Services
- **`POST /api/deploy.ios`** - iOS-specific deployment
- **`GET /api/deployment-status`** - Check deployment progress
- **`GET /api/project-deployments`** - List deployment history

### 5. Integration APIs

**Third-party service integrations**

- **`GET /api/integrations`** - List available integrations
- **`POST /api/integrations`** - Configure new integrations
- **`DELETE /api/integrations`** - Remove integrations

### 6. User & Subscription APIs

**User management and billing**

- **`GET /api/subscription`** - Current subscription status
- **`POST /api/subscription`** - Update subscription plans
- **`DELETE /api/cancel-subscription`** - Cancel subscriptions
- **`GET /api/settings`** - User preferences and settings

## Request/Response Patterns

### Standard Response Format

All API endpoints follow a consistent response pattern:

```typescript
// Success Response
{
  success: true,
  data: T,
  metadata?: {
    pagination?: PaginationInfo,
    timing?: TimingInfo,
    version?: string
  }
}

// Error Response
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: unknown,
    timestamp: string
  }
}

// Streaming Response (Server-Sent Events)
data: {"type": "content", "content": "Generated code...", "id": "chunk-1"}

data: {"type": "artifact", "artifact": {...}, "id": "artifact-1"}

data: {"type": "complete", "summary": {...}}
```

### Common Request Headers

```http
Content-Type: application/json
Authorization: Bearer <clerk-session-token>
X-Request-ID: <unique-request-id>
```

### Error Handling

Standard HTTP status codes with detailed error information:

```typescript
// 400 - Bad Request
{
  success: false,
  error: {
    code: "INVALID_REQUEST",
    message: "Missing required field: projectName",
    details: {
      field: "projectName",
      received: null,
      expected: "string"
    }
  }
}

// 401 - Unauthorized  
{
  success: false,
  error: {
    code: "UNAUTHORIZED",
    message: "Authentication required"
  }
}

// 403 - Forbidden
{
  success: false,
  error: {
    code: "FORBIDDEN", 
    message: "Access denied to project",
    details: { projectId: "proj_123" }
  }
}

// 429 - Rate Limited
{
  success: false,
  error: {
    code: "RATE_LIMITED",
    message: "Too many requests",
    details: {
      limit: 100,
      remaining: 0,
      resetTime: "2024-01-01T12:00:00Z"
    }
  }
}

// 500 - Internal Server Error
{
  success: false,
  error: {
    code: "INTERNAL_ERROR",
    message: "An unexpected error occurred",
    details: {
      requestId: "req_abc123",
      supportContact: "support@bfloat.ai"
    }
  }
}
```

## Rate Limiting

API endpoints are rate-limited based on subscription tiers:

```typescript
// Rate limit headers in responses
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200

// Rate limit configuration by endpoint
const RATE_LIMITS = {
  '/api/chat': {
    free: { requests: 10, window: '1h' },
    pro: { requests: 100, window: '1h' },
    super: { requests: 1000, window: '1h' }
  },
  '/api/projects': {
    free: { requests: 50, window: '1h' },
    pro: { requests: 500, window: '1h' },
    super: { requests: 5000, window: '1h' }
  }
};
```

## Pagination

List endpoints support cursor-based pagination:

```typescript
// Request parameters
{
  limit?: number = 20,        // Max 100
  cursor?: string,            // Opaque cursor from previous response
  sort?: 'created' | 'updated' = 'created',
  order?: 'asc' | 'desc' = 'desc'
}

// Response format
{
  success: true,
  data: T[],
  metadata: {
    pagination: {
      hasNext: boolean,
      hasPrev: boolean,
      nextCursor?: string,
      prevCursor?: string,
      total?: number
    }
  }
}
```

## WebSocket & Streaming

### Server-Sent Events (SSE)

Real-time updates for long-running operations:

```typescript
// Connect to streaming endpoint
const eventSource = new EventSource('/api/chat', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

eventSource.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'content':
      // Handle streaming content
      break;
    case 'artifact':
      // Handle generated files
      break;
    case 'error':
      // Handle errors
      break;
    case 'complete':
      // Handle completion
      eventSource.close();
      break;
  }
});
```

### WebSocket Events

For real-time project updates:

```typescript
// WebSocket connection for project updates
const ws = new WebSocket(`wss://api.bfloat.ai/ws/project/${projectId}`);

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  
  switch (update.type) {
    case 'file_updated':
      // Handle file changes
      break;
    case 'deployment_status':
      // Handle deployment updates
      break;
    case 'error':
      // Handle errors
      break;
  }
};
```

## API Versioning

### Current Version: v1

All endpoints are currently at version 1. Future versions will be supported via:

1. **URL Versioning**: `/api/v2/projects`
2. **Header Versioning**: `API-Version: v2`
3. **Backward Compatibility**: v1 endpoints remain available

### Version Migration

```typescript
// Gradual migration support
export async function handleVersionedRequest(request: Request) {
  const version = request.headers.get('API-Version') || 'v1';
  
  switch (version) {
    case 'v1':
      return handleV1Request(request);
    case 'v2':
      return handleV2Request(request);
    default:
      throw new Response('Unsupported API version', { status: 400 });
  }
}
```

## Development & Testing

### API Client Generation

TypeScript client generation for type safety:

```typescript
// Generated client types
export interface BfloatAPI {
  chat: {
    stream(request: ChatRequest): Promise<ChatResponse>;
    create(request: NewChatRequest): Promise<Chat>;
  };
  projects: {
    list(params?: ListProjectsParams): Promise<PaginatedResponse<Project>>;
    create(request: CreateProjectRequest): Promise<Project>;
    get(id: string): Promise<Project>;
    update(id: string, request: UpdateProjectRequest): Promise<Project>;
    delete(id: string): Promise<void>;
  };
  // ... other endpoints
}
```

### Testing Utilities

```typescript
// Test helpers for API endpoints
export const testUtils = {
  createAuthenticatedRequest: (userId: string, body?: unknown) => ({
    headers: { Authorization: `Bearer ${generateTestToken(userId)}` },
    body: body ? JSON.stringify(body) : undefined
  }),
  
  mockProject: (overrides?: Partial<Project>) => ({
    id: 'proj_test_123',
    name: 'Test Project',
    userId: 'user_test_456',
    ...overrides
  })
};
```

## Next Steps

Dive deeper into specific API groups:

- **[LLM APIs](/api/llm-apis/)** - Chat, streaming, and AI model interactions
- **[Project APIs](/api/project-apis/)** - Project management and file operations
- **[Deployment APIs](/api/deployment-apis/)** - React Native app deployment
- **[Database Schema](/api/database-schema/)** - Complete data model reference