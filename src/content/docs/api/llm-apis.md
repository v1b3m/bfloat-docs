---
title: LLM APIs
description: Chat, streaming, and AI model interaction endpoints
---

# LLM APIs

The LLM APIs are the core of bfloat's AI-powered React Native generation system. These endpoints handle chat interactions, streaming responses, and direct AI model communication.

## Core Endpoints

### POST /api/chat

**Primary endpoint for AI-powered code generation with streaming responses**

Handles real-time chat interactions with AI models, generating React Native code based on conversational prompts.

#### Request

```typescript
interface ChatRequest {
  messages: Message[];
  projectSnapshot: string;  // JSON string of current project files
  projectId: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  annotations?: MessageAnnotation[];
}
```

#### Example Request

```bash
curl -X POST /api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <clerk-token>" \
  -d '{
    "messages": [
      {
        "id": "msg_1",
        "role": "user", 
        "content": "Create a login screen with email and password fields"
      }
    ],
    "projectSnapshot": "{\"App.tsx\": \"export default function App() { return <Text>Hello</Text>; }\"}",
    "projectId": "proj_abc123"
  }'
```

#### Response (Server-Sent Events)

The endpoint returns a streaming response using Server-Sent Events format:

```typescript
// Content chunks
data: {"type": "content", "content": "I'll create a login screen...", "id": "chunk_1"}

// Tool usage annotations
data: {"type": "annotation", "annotation": {"label": "Thinking", "message": "Planning the login screen components"}}

// File artifacts
data: {"type": "artifact", "artifact": {"type": "file", "path": "LoginScreen.tsx", "content": "..."}}

// Stream completion
data: {"type": "finish", "finishReason": "stop"}
```

#### Features

- **🤖 Multi-Model Support**: Automatically selects optimal AI model (Claude, GPT-4, etc.)
- **📝 Context Management**: Intelligent context window management for large projects  
- **🔧 Tool Integration**: AI can read files, access documentation, and think through problems
- **⚡ Streaming**: Real-time response streaming for immediate user feedback
- **🔄 Continuation**: Automatic handling of response length limits with continuation
- **💾 State Management**: Updates project state during generation

#### Error Responses

```typescript
// Rate limit exceeded
{
  "error": "You have reached your daily message limit of 10. Please try again tomorrow or upgrade your plan.",
  "status": 429
}

// Project too large
{
  "error": "Your project is too large to be processed. Please fork the project or try again with a smaller project.",
  "status": 413  
}

// Authentication required
{
  "error": "Authentication required",
  "message": "You must be logged in to use the chat feature.",
  "status": 401
}
```

---

### POST /api/chat-new

**Initialize new chat sessions**

Creates a new chat session for a project with initial system prompts and context.

#### Request

```typescript
interface NewChatRequest {
  projectId: string;
  initialPrompt?: string;
  template?: 'blank' | 'expo-router' | 'navigation';
}
```

#### Response

```typescript
interface NewChatResponse {
  success: true;
  data: {
    chatId: string;
    projectId: string;
    initialMessages: Message[];
    systemPrompt: string;
  }
}
```

---

### POST /api/llmcall

**Direct LLM API calls for specific tasks**

Lower-level endpoint for direct AI model interactions without the full chat context.

#### Request

```typescript
interface LLMCallRequest {
  model?: 'claude-3.5-sonnet' | 'gpt-4-turbo' | 'deepseek-coder';
  messages: Message[];
  temperature?: number;
  maxTokens?: number;
  tools?: Tool[];
}
```

#### Response

```typescript
interface LLMCallResponse {
  success: true;
  data: {
    content: string;
    model: string;
    usage: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    }
  }
}
```

---

### POST /api/init-stream

**Initialize streaming connections**

Sets up WebSocket or Server-Sent Event connections for real-time communication.

#### Request

```typescript
interface InitStreamRequest {
  projectId: string;
  streamType: 'sse' | 'websocket';
  capabilities?: string[];
}
```

#### Response

```typescript
interface InitStreamResponse {
  success: true;
  data: {
    streamId: string;
    endpoint: string;
    protocol: 'sse' | 'websocket';
    authToken: string;
  }
}
```

## AI Model Selection

### Intelligent Model Routing

bfloat automatically selects the optimal AI model based on:

```typescript
interface ModelSelectionCriteria {
  taskType: 'code_generation' | 'ui_design' | 'debugging' | 'architecture';
  complexity: number;        // 0.0 - 1.0
  tokenCount: number;        // Context size
  userTier: 'free' | 'pro' | 'super';
  conversationLength: number;
}

// Example model selection logic
const selectModel = (criteria: ModelSelectionCriteria): AIModel => {
  if (criteria.conversationLength > 5) {
    return 'claude-3.5-sonnet-latest';
  }
  
  if (criteria.taskType === 'code_generation' && criteria.complexity > 0.7) {
    return 'deepseek-coder';
  }
  
  if (criteria.userTier === 'free') {
    return 'gpt-4o-mini';
  }
  
  return 'claude-3.5-sonnet-latest'; // Default
};
```

### Available Models

```typescript
const AI_MODELS = {
  'claude-3.5-sonnet-latest': {
    provider: 'anthropic',
    maxTokens: 200000,
    strengths: ['ui_design', 'code_quality', 'reasoning'],
    cost: 'medium'
  },
  'gpt-4-turbo': {
    provider: 'openai', 
    maxTokens: 128000,
    strengths: ['architecture', 'complex_logic'],
    cost: 'high'
  },
  'deepseek-coder': {
    provider: 'deepseek',
    maxTokens: 16000, 
    strengths: ['code_generation', 'algorithms'],
    cost: 'low'
  },
  'grok-beta': {
    provider: 'xai',
    maxTokens: 131072,
    strengths: ['speed', 'real_time'],
    cost: 'medium'
  }
} as const;
```

## AI Tools Integration

### Built-in Tools

The AI has access to several tools during code generation:

#### Think Tool

```typescript
const thinkTool = {
  description: "Think about the problem or task at hand",
  parameters: {
    thought: "string - A thought to think about"
  },
  usage: "When AI needs to reason through complex problems"
};

// Example usage in stream
data: {"type": "annotation", "annotation": {"label": "Thinking", "message": "I need to create a form with proper validation..."}}
```

#### Read File Tool

```typescript  
const readFileTool = {
  description: "Read the contents of a file in the project",
  parameters: {
    filePath: "string - The path to the file to read"
  },
  usage: "When AI needs to understand existing project structure"
};

// Example usage
data: {"type": "annotation", "annotation": {"label": "Reading file", "message": "Reading file: src/components/Header.tsx"}}
```

#### Documentation Tool

```typescript
const askDocumentationTool = {
  description: "Ask questions about Expo SDK components and APIs", 
  parameters: {
    question: "string - The question to ask"
  },
  usage: "When AI needs latest information about Expo APIs"
};

// Example usage
data: {"type": "annotation", "annotation": {"label": "Asking documentation", "message": "How do I implement AsyncStorage in Expo?"}}
```

## Context Management

### System Prompt Generation

```typescript
function getSystemPrompt(workDir: string, projectSnapshot: string): string {
  return `
You are an expert React Native developer working on a project.

**Current Working Directory:** ${workDir}

**Project Structure:**
${formatProjectSnapshot(projectSnapshot)}

**Your Capabilities:**
- Generate TypeScript React Native code
- Create complete screens and components
- Implement navigation with React Navigation
- Set up state management (Zustand, Redux Toolkit)
- Handle API integrations and data fetching
- Ensure accessibility compliance
- Optimize for both iOS and Android

**Best Practices:**
- Use TypeScript for all files
- Follow React Native performance patterns
- Implement proper error handling
- Add accessibility labels and roles
- Use consistent styling with StyleSheet.create
- Include proper prop types and interfaces

**Code Generation Rules:**
1. Always generate complete, working code
2. Include necessary imports and dependencies
3. Follow established project patterns
4. Add helpful comments for complex logic
5. Ensure responsive design for different screen sizes
  `.trim();
}
```

### Context Window Management

```typescript
interface ContextWindow {
  maxTokens: number;
  systemPromptTokens: number;
  availableForMessages: number;
  strategy: 'recent_first' | 'importance_weighted';
}

const manageContext = (messages: Message[], maxTokens: number): Message[] => {
  const systemPromptTokens = countTokens(getSystemPrompt());
  const availableTokens = maxTokens - systemPromptTokens - 2000; // Buffer for response
  
  let selectedMessages: Message[] = [];
  let tokenCount = 0;
  
  // Include recent messages within token limit
  for (let i = messages.length - 1; i >= 0; i--) {
    const messageTokens = countTokens(messages[i].content);
    
    if (tokenCount + messageTokens > availableTokens) {
      break;
    }
    
    selectedMessages.unshift(messages[i]);
    tokenCount += messageTokens;
  }
  
  return selectedMessages;
};
```

## Subscription & Rate Limiting

### Usage Limits by Tier

```typescript
const SUBSCRIPTION_LIMITS = {
  free: {
    dailyMessageLimit: 10,
    monthlyMessageLimit: 100,
    model: 'gpt-4o-mini',
    maxTokens: 50000
  },
  pro: {
    dailyMessageLimit: 100,
    monthlyMessageLimit: 1000, 
    model: 'claude-3.5-sonnet-latest',
    maxTokens: 100000
  },
  super: {
    dailyMessageLimit: 1000,
    monthlyMessageLimit: 10000,
    model: 'claude-3.5-sonnet-latest', 
    maxTokens: 200000
  }
} as const;
```

### Usage Tracking

```typescript
interface UsageTracker {
  subscriptionId: string;
  dailyCount: number;
  monthlyCount: number;
  resetDate: string;
}

// Usage reporting after successful requests
await stripeService.reportUsage(subscription.id, {
  quantity: 1,
  timestamp: Date.now(),
  metadata: {
    model: selectedModel,
    tokens: totalTokens,
    projectId: projectId
  }
});
```

## Error Handling & Recovery

### Stream Error Handling

```typescript
const streamOptions: StreamingOptions = {
  onError: async ({ error }) => {
    console.error("Stream error:", error);
    
    // Reset project state
    await updateProject({ 
      id: projectId, 
      updateInProgress: false 
    });
    
    // Send error to client
    dataStream.writeError({
      code: 'STREAM_ERROR',
      message: 'An error occurred during generation',
      details: error.message
    });
  },
  
  onFinish: async ({ finishReason, content }) => {
    // Handle different finish reasons
    switch (finishReason) {
      case 'stop':
        await saveGeneratedContent(content);
        break;
      case 'length':
        await continueGeneration(messages, content);
        break;
      case 'tool_calls':
        await handleToolCalls(toolCalls);
        break;
    }
  }
};
```

### Automatic Recovery

```typescript
const handleGenerationFailure = async (error: Error, context: GenerationContext) => {
  // Log error for monitoring
  console.error('Generation failed:', error);
  
  // Try with fallback model
  if (context.retries < 3) {
    const fallbackModel = getFallbackModel(context.currentModel);
    return retryGeneration({ 
      ...context, 
      model: fallbackModel,
      retries: context.retries + 1 
    });
  }
  
  // Return graceful error message
  return {
    success: false,
    error: 'Unable to generate code at this time. Please try again later.'
  };
};
```

## Client Integration

### TypeScript SDK

```typescript
import { BfloatClient } from '@bfloat/sdk';

const client = new BfloatClient({
  apiKey: process.env.BFLOAT_API_KEY,
  baseURL: 'https://api.bfloat.ai'
});

// Stream chat responses
const stream = await client.chat.stream({
  messages: [
    { role: 'user', content: 'Create a todo list app' }
  ],
  projectId: 'proj_123',
  projectSnapshot: projectFiles
});

for await (const chunk of stream) {
  switch (chunk.type) {
    case 'content':
      console.log('Generated:', chunk.content);
      break;
    case 'artifact':
      console.log('File created:', chunk.artifact.path);
      break;
    case 'annotation':
      console.log('AI thinking:', chunk.annotation.message);
      break;
  }
}
```

### React Hook

```typescript
import { useChatStream } from '@bfloat/react';

function ChatInterface({ projectId }: { projectId: string }) {
  const { 
    messages, 
    isStreaming, 
    sendMessage,
    annotations,
    artifacts 
  } = useChatStream({
    projectId,
    onArtifact: (artifact) => {
      // Handle generated files
      updateProjectFile(artifact.path, artifact.content);
    }
  });

  const handleSubmit = (prompt: string) => {
    sendMessage({
      role: 'user',
      content: prompt
    });
  };

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>{message.content}</div>
      ))}
      
      {annotations.map(annotation => (
        <div key={annotation.id} className="thinking">
          {annotation.label}: {annotation.message}
        </div>
      ))}
      
      <ChatInput onSubmit={handleSubmit} disabled={isStreaming} />
    </div>
  );
}
```

## Performance Optimization

### Response Caching

```typescript
// Cache frequently used responses
const responseCache = new Map<string, CachedResponse>();

const getCachedResponse = (requestHash: string): CachedResponse | null => {
  const cached = responseCache.get(requestHash);
  
  if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hour
    return cached;
  }
  
  return null;
};
```

### Token Optimization

```typescript
// Optimize token usage for better performance
const optimizeTokenUsage = (messages: Message[]): Message[] => {
  return messages.map(message => ({
    ...message,
    content: compressWhitespace(
      removeUnnecessaryComments(message.content)
    )
  }));
};
```

The LLM APIs form the intelligence core of bfloat, enabling sophisticated AI-powered React Native code generation through conversational interfaces while maintaining performance, reliability, and cost efficiency.

## Next Steps

- **[Project APIs](/api/project-apis/)** - Project management and file operations
- **[Deployment APIs](/api/deployment-apis/)** - React Native app deployment
- **[Database Schema](/api/database-schema/)** - Complete data model reference