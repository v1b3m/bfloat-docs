---
title: LLM Integration
description: Deep dive into bfloat's multi-provider AI strategy and intelligent code generation
---

# LLM Integration

bfloat's LLM integration is the heart of the platform - a sophisticated orchestration layer that coordinates multiple AI providers to generate high-quality React Native code. This system goes beyond simple API calls to implement intelligent routing, context management, and quality assurance.

## Multi-Provider Strategy

### Why Multiple Providers?

Different AI models excel at different aspects of code generation:

- **🎯 Code Generation**: DeepSeek Coder for complex logic and algorithms
- **🎨 UI/UX Design**: Claude 3.5 Sonnet for design reasoning and component structure  
- **🏗️ Architecture**: GPT-4 Turbo for high-level planning and system design
- **🐛 Debugging**: Gemini Pro for error analysis and code fixing
- **⚡ Speed**: Grok for rapid prototyping and simple components

### Provider Configuration

```typescript
// app/lib/llm/model.ts
export interface LLMProvider {
  id: string;
  name: string;
  maxTokens: number;
  costPerToken: number;
  strengths: string[];
  weaknesses: string[];
}

export const AI_PROVIDERS: Record<string, LLMProvider> = {
  'gpt-4-turbo': {
    id: 'gpt-4-turbo',
    name: 'OpenAI GPT-4 Turbo',
    maxTokens: 128000,
    costPerToken: 0.00001,
    strengths: ['reasoning', 'architecture', 'complex_logic'],
    weaknesses: ['cost', 'speed']
  },
  'claude-3.5-sonnet': {
    id: 'claude-3.5-sonnet',
    name: 'Anthropic Claude 3.5 Sonnet',
    maxTokens: 200000,
    costPerToken: 0.000003,
    strengths: ['ui_design', 'code_quality', 'context_understanding'],
    weaknesses: ['math', 'api_integrations']
  },
  'deepseek-coder': {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    maxTokens: 16000,
    costPerToken: 0.0000014,
    strengths: ['code_generation', 'algorithms', 'performance'],
    weaknesses: ['ui_design', 'context_length']
  },
  'gemini-pro': {
    id: 'gemini-pro',
    name: 'Google Gemini Pro',
    maxTokens: 30720,
    costPerToken: 0.000125,
    strengths: ['debugging', 'analysis', 'multimodal'],
    weaknesses: ['consistency', 'creative_tasks']
  },
  'grok-beta': {
    id: 'grok-beta',
    name: 'xAI Grok',
    maxTokens: 131072,
    costPerToken: 0.000005,
    strengths: ['speed', 'real_time', 'conversational'],
    weaknesses: ['accuracy', 'complex_reasoning']
  }
};
```

## Intelligent Model Router

The Model Router is bfloat's decision engine that selects the optimal AI provider for each request based on multiple factors.

### Routing Logic

```typescript
// app/lib/llm/model-router.ts
export class ModelRouter {
  constructor(
    private providers: LLMProvider[],
    private usage: UsageTracker,
    private performance: PerformanceTracker
  ) {}

  async routeRequest(request: LLMRequest): Promise<LLMProvider> {
    const { type, complexity, tokenCount, urgency, budget } = request;
    
    // Score each provider based on multiple criteria
    const scores = await Promise.all(
      this.providers.map(provider => this.scoreProvider(provider, request))
    );
    
    // Select highest scoring available provider
    const selectedProvider = this.selectBestProvider(scores);
    
    // Log routing decision for monitoring
    this.logRoutingDecision(request, selectedProvider);
    
    return selectedProvider;
  }

  private async scoreProvider(
    provider: LLMProvider, 
    request: LLMRequest
  ): Promise<ProviderScore> {
    let score = 0;
    
    // Task-specific scoring
    score += this.getTaskScore(provider, request.type);
    
    // Performance scoring based on historical data
    score += await this.getPerformanceScore(provider);
    
    // Cost efficiency scoring
    score += this.getCostScore(provider, request.budget);
    
    // Availability scoring
    score += await this.getAvailabilityScore(provider);
    
    // Context window scoring
    score += this.getContextScore(provider, request.tokenCount);
    
    return {
      provider,
      score,
      breakdown: {
        task: this.getTaskScore(provider, request.type),
        performance: await this.getPerformanceScore(provider),
        cost: this.getCostScore(provider, request.budget),
        availability: await this.getAvailabilityScore(provider),
        context: this.getContextScore(provider, request.tokenCount)
      }
    };
  }

  private getTaskScore(provider: LLMProvider, taskType: TaskType): number {
    const taskMap: Record<TaskType, string> = {
      'code_generation': 'code_generation',
      'ui_design': 'ui_design', 
      'architecture': 'reasoning',
      'debugging': 'debugging',
      'refactoring': 'code_quality',
      'testing': 'analysis',
      'documentation': 'reasoning'
    };
    
    const requiredStrength = taskMap[taskType];
    return provider.strengths.includes(requiredStrength) ? 100 : 0;
  }

  private async getPerformanceScore(provider: LLMProvider): Promise<number> {
    const stats = await this.performance.getStats(provider.id);
    
    // Weight recent performance more heavily
    const recentSuccessRate = stats.successRate.last24h;
    const averageLatency = stats.averageLatency.last24h;
    
    // Score based on success rate (0-50 points)
    const successScore = recentSuccessRate * 50;
    
    // Score based on latency (0-50 points, inverted)
    const latencyScore = Math.max(0, 50 - (averageLatency / 1000) * 10);
    
    return successScore + latencyScore;
  }
}
```

### Request Classification

Before routing, requests are analyzed and classified:

```typescript
// app/lib/llm/request-classifier.ts
export class RequestClassifier {
  classifyRequest(prompt: string, context: ConversationContext): LLMRequest {
    const analysis = this.analyzePrompt(prompt);
    
    return {
      type: this.determineTaskType(analysis),
      complexity: this.estimateComplexity(analysis, context),
      tokenCount: this.estimateTokens(prompt, context),
      urgency: this.determineUrgency(context),
      budget: this.estimateBudget(analysis),
      requirements: this.extractRequirements(analysis)
    };
  }

  private determineTaskType(analysis: PromptAnalysis): TaskType {
    const keywords = analysis.keywords.toLowerCase();
    
    if (keywords.includes('create component') || keywords.includes('build screen')) {
      return 'code_generation';
    }
    
    if (keywords.includes('design') || keywords.includes('ui') || keywords.includes('style')) {
      return 'ui_design';
    }
    
    if (keywords.includes('architecture') || keywords.includes('structure')) {
      return 'architecture';
    }
    
    if (keywords.includes('fix') || keywords.includes('error') || keywords.includes('debug')) {
      return 'debugging';
    }
    
    if (keywords.includes('refactor') || keywords.includes('optimize')) {
      return 'refactoring';
    }
    
    return 'code_generation'; // Default
  }

  private estimateComplexity(analysis: PromptAnalysis, context: ConversationContext): number {
    let complexity = 0;
    
    // Analyze request scope
    if (analysis.mentions.includes('navigation')) complexity += 0.2;
    if (analysis.mentions.includes('state management')) complexity += 0.3;
    if (analysis.mentions.includes('api integration')) complexity += 0.2;
    if (analysis.mentions.includes('authentication')) complexity += 0.3;
    if (analysis.mentions.includes('database')) complexity += 0.4;
    
    // Analyze context length
    complexity += Math.min(context.messages.length / 50, 0.3);
    
    // Analyze technical requirements
    if (analysis.technicalTerms.length > 5) complexity += 0.2;
    
    return Math.min(complexity, 1.0);
  }
}
```

## Context Management

Managing conversation context across multiple providers is critical for maintaining coherent code generation.

### Sliding Context Window

```typescript
// app/lib/llm/extract-context.ts
export class ContextManager {
  constructor(private tokenCounter: TokenCounter) {}

  extractRelevantContext(
    messages: Message[],
    maxTokens: number,
    strategy: ContextStrategy = 'recent_first'
  ): Message[] {
    switch (strategy) {
      case 'recent_first':
        return this.extractRecentFirst(messages, maxTokens);
      case 'importance_weighted':
        return this.extractByImportance(messages, maxTokens);
      case 'semantic_similarity':
        return this.extractBySimilarity(messages, maxTokens);
      default:
        return this.extractRecentFirst(messages, maxTokens);
    }
  }

  private extractRecentFirst(messages: Message[], maxTokens: number): Message[] {
    const context: Message[] = [];
    let tokenCount = 0;
    
    // Always include system message
    const systemMessage = messages.find(m => m.role === 'SYSTEM');
    if (systemMessage) {
      context.push(systemMessage);
      tokenCount += this.tokenCounter.count(systemMessage.content);
    }
    
    // Add most recent messages within token limit
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message.role === 'SYSTEM') continue;
      
      const messageTokens = this.tokenCounter.count(message.content);
      
      if (tokenCount + messageTokens > maxTokens) {
        // Try to fit a truncated version
        const remainingTokens = maxTokens - tokenCount;
        if (remainingTokens > 100) {
          const truncated = this.truncateMessage(message, remainingTokens);
          context.unshift(truncated);
        }
        break;
      }
      
      context.unshift(message);
      tokenCount += messageTokens;
    }
    
    return context;
  }

  private extractByImportance(messages: Message[], maxTokens: number): Message[] {
    const scoredMessages = messages
      .filter(m => m.role !== 'SYSTEM')
      .map(message => ({
        message,
        score: this.calculateImportanceScore(message),
        tokens: this.tokenCounter.count(message.content)
      }))
      .sort((a, b) => b.score - a.score);

    const context: Message[] = [];
    let tokenCount = 0;
    
    // Add system message first
    const systemMessage = messages.find(m => m.role === 'SYSTEM');
    if (systemMessage) {
      context.push(systemMessage);
      tokenCount += this.tokenCounter.count(systemMessage.content);
    }
    
    // Add highest scoring messages that fit
    for (const item of scoredMessages) {
      if (tokenCount + item.tokens <= maxTokens) {
        context.push(item.message);
        tokenCount += item.tokens;
      }
    }
    
    // Sort by timestamp to maintain conversation flow
    return context.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  private calculateImportanceScore(message: Message): number {
    let score = 0;
    const content = message.content.toLowerCase();
    
    // Code-related messages are more important
    if (content.includes('```') || message.artifacts?.length > 0) {
      score += 10;
    }
    
    // Error messages are important for context
    if (content.includes('error') || content.includes('fix')) {
      score += 8;
    }
    
    // Architectural decisions
    if (content.includes('architecture') || content.includes('structure')) {
      score += 7;
    }
    
    // User requirements and specifications
    if (message.role === 'USER' && content.length > 100) {
      score += 5;
    }
    
    // Recent messages get a recency boost
    const ageHours = (Date.now() - new Date(message.createdAt).getTime()) / (1000 * 60 * 60);
    score += Math.max(0, 5 - ageHours);
    
    return score;
  }
}
```

### Context Injection Strategy

```typescript
// app/lib/llm/context-injection.ts
export class ContextInjector {
  injectContext(
    messages: Message[],
    projectContext: ProjectContext
  ): Message[] {
    const enrichedMessages: Message[] = [];
    
    // Inject system message with project context
    const systemMessage = this.createSystemMessage(projectContext);
    enrichedMessages.push(systemMessage);
    
    // Process each message and add relevant context
    for (const message of messages) {
      if (message.role === 'USER') {
        // Add file context if mentioned
        const contextualMessage = this.addFileContext(message, projectContext);
        enrichedMessages.push(contextualMessage);
      } else {
        enrichedMessages.push(message);
      }
    }
    
    return enrichedMessages;
  }

  private createSystemMessage(context: ProjectContext): Message {
    const systemPrompt = `
You are an expert React Native developer working on a project with the following context:

**Project Structure:**
${this.formatFileTree(context.files)}

**Current Dependencies:**
${context.dependencies.join(', ')}

**Navigation Setup:**
${context.navigationType} navigation with ${context.screens.length} screens

**State Management:**
${context.stateManagement}

**Key Requirements:**
- Generate TypeScript code with proper types
- Follow React Native best practices
- Use consistent styling patterns
- Ensure accessibility compliance
- Optimize for both iOS and Android

**Active Files Context:**
${this.getActiveFilesContext(context.activeFiles)}

When generating code:
1. Maintain consistency with existing patterns
2. Import required dependencies
3. Use proper TypeScript interfaces
4. Follow the established file structure
5. Add helpful comments for complex logic
    `.trim();

    return {
      id: 'system',
      content: systemPrompt,
      role: 'SYSTEM',
      createdAt: new Date().toISOString(),
      projectId: context.projectId
    };
  }

  private addFileContext(message: Message, context: ProjectContext): Message {
    const mentionedFiles = this.extractFileMentions(message.content);
    
    if (mentionedFiles.length === 0) {
      return message;
    }
    
    let contextualContent = message.content;
    
    for (const fileName of mentionedFiles) {
      const fileContent = context.files[fileName];
      if (fileContent) {
        contextualContent += `\n\n**Current ${fileName}:**\n\`\`\`typescript\n${fileContent}\n\`\`\``;
      }
    }
    
    return {
      ...message,
      content: contextualContent
    };
  }
}
```

## Code Generation Pipeline

The core code generation process involves multiple stages to ensure high-quality output.

### Generation Workflow

```typescript
// app/lib/llm/code-generator.ts
export class CodeGenerator {
  constructor(
    private modelRouter: ModelRouter,
    private contextManager: ContextManager,
    private validator: CodeValidator,
    private postProcessor: CodePostProcessor
  ) {}

  async generateCode(request: GenerationRequest): Promise<GenerationResult> {
    // 1. Classify and route request
    const llmRequest = this.classifyRequest(request);
    const provider = await this.modelRouter.routeRequest(llmRequest);
    
    // 2. Extract and prepare context
    const context = this.contextManager.extractRelevantContext(
      request.messages,
      provider.maxTokens * 0.7 // Leave room for generation
    );
    
    // 3. Generate code with streaming
    const generation = await this.streamGeneration(provider, context, request);
    
    // 4. Post-process generated code
    const processed = await this.postProcessor.process(generation);
    
    // 5. Validate output quality
    const validation = await this.validator.validate(processed);
    
    // 6. Handle validation failures
    if (!validation.isValid && validation.severity === 'error') {
      return this.handleValidationFailure(request, validation);
    }
    
    return {
      code: processed.code,
      files: processed.files,
      artifacts: processed.artifacts,
      validation,
      metadata: {
        provider: provider.id,
        tokens: generation.tokenUsage,
        duration: generation.duration,
        retries: generation.retries
      }
    };
  }

  private async streamGeneration(
    provider: LLMProvider,
    context: Message[],
    request: GenerationRequest
  ): Promise<StreamedGeneration> {
    const startTime = Date.now();
    let fullContent = '';
    let tokenCount = 0;
    
    try {
      const stream = await this.callProvider(provider, context, request);
      
      for await (const chunk of stream) {
        fullContent += chunk.content;
        tokenCount += chunk.tokens;
        
        // Emit streaming updates
        request.onProgress?.({
          type: 'content',
          content: chunk.content,
          totalContent: fullContent
        });
      }
      
      return {
        content: fullContent,
        tokenUsage: tokenCount,
        duration: Date.now() - startTime,
        retries: 0
      };
      
    } catch (error) {
      // Implement retry logic with different providers
      return this.handleGenerationError(error, provider, context, request);
    }
  }

  private async handleGenerationError(
    error: Error,
    failedProvider: LLMProvider,
    context: Message[],
    request: GenerationRequest
  ): Promise<StreamedGeneration> {
    console.warn(`Generation failed with ${failedProvider.id}:`, error.message);
    
    // Try with fallback provider
    const fallbackProvider = await this.modelRouter.getFallbackProvider(failedProvider);
    
    if (fallbackProvider) {
      console.log(`Retrying with fallback provider: ${fallbackProvider.id}`);
      return this.streamGeneration(fallbackProvider, context, {
        ...request,
        retryCount: (request.retryCount || 0) + 1
      });
    }
    
    throw new Error(`Code generation failed: ${error.message}`);
  }
}
```

### Code Post-Processing

```typescript
// app/lib/llm/code-post-processor.ts
export class CodePostProcessor {
  async process(generation: StreamedGeneration): Promise<ProcessedGeneration> {
    const { content } = generation;
    
    // Extract code blocks and files
    const artifacts = this.extractArtifacts(content);
    
    // Process each artifact
    const processedArtifacts = await Promise.all(
      artifacts.map(artifact => this.processArtifact(artifact))
    );
    
    // Organize into file structure
    const files = this.organizeFiles(processedArtifacts);
    
    // Apply consistent formatting
    const formattedFiles = await this.formatFiles(files);
    
    // Add missing imports and dependencies
    const completeFiles = await this.completeDependencies(formattedFiles);
    
    return {
      code: content,
      files: completeFiles,
      artifacts: processedArtifacts,
      metadata: {
        filesGenerated: Object.keys(completeFiles).length,
        linesOfCode: this.countLinesOfCode(completeFiles),
        complexity: this.calculateComplexity(completeFiles)
      }
    };
  }

  private async processArtifact(artifact: Artifact): Promise<ProcessedArtifact> {
    let { content, path, type } = artifact;
    
    // Clean up code formatting
    content = this.cleanupCode(content);
    
    // Add TypeScript types if missing
    if (path.endsWith('.ts') || path.endsWith('.tsx')) {
      content = await this.addTypeScriptTypes(content);
    }
    
    // Add React Native imports
    if (type === 'component' && path.endsWith('.tsx')) {
      content = this.addReactNativeImports(content);
    }
    
    // Optimize for performance
    content = this.optimizePerformance(content);
    
    return {
      ...artifact,
      content,
      processed: true
    };
  }

  private addReactNativeImports(content: string): string {
    const imports = [];
    const usedComponents = this.extractUsedComponents(content);
    
    // Core React imports
    if (content.includes('useState') || content.includes('useEffect')) {
      imports.push("import React, { useState, useEffect } from 'react';");
    } else if (content.includes('React.')) {
      imports.push("import React from 'react';");
    }
    
    // React Native imports
    const rnComponents = usedComponents.filter(comp => 
      ['View', 'Text', 'ScrollView', 'TouchableOpacity', 'Image', 'TextInput']
        .includes(comp)
    );
    
    if (rnComponents.length > 0) {
      imports.push(`import { ${rnComponents.join(', ')} } from 'react-native';`);
    }
    
    // Navigation imports
    if (content.includes('useNavigation') || content.includes('NavigationProp')) {
      imports.push("import { useNavigation } from '@react-navigation/native';");
    }
    
    // Prepend imports to content
    return imports.length > 0 
      ? `${imports.join('\n')}\n\n${content}`
      : content;
  }

  private optimizePerformance(content: string): string {
    let optimized = content;
    
    // Add React.memo for components
    if (content.includes('export default function') && content.includes('Props')) {
      optimized = optimized.replace(
        /export default function (\w+)/,
        'export default React.memo(function $1'
      );
      optimized += optimized.endsWith('}') ? ')' : '';
    }
    
    // Optimize StyleSheet usage
    if (content.includes('style=') && !content.includes('StyleSheet.create')) {
      optimized = this.addStyleSheet(optimized);
    }
    
    return optimized;
  }
}
```

## Quality Assurance & Validation

### Multi-Stage Validation

```typescript
// app/lib/llm/code-validator.ts
export class CodeValidator {
  async validate(generation: ProcessedGeneration): Promise<ValidationResult> {
    const results = await Promise.all([
      this.syntaxValidation(generation),
      this.typeScriptValidation(generation),
      this.reactNativeValidation(generation),
      this.accessibilityValidation(generation),
      this.performanceValidation(generation),
      this.securityValidation(generation)
    ]);
    
    return this.aggregateValidationResults(results);
  }

  private async reactNativeValidation(generation: ProcessedGeneration): Promise<ValidationReport> {
    const issues: ValidationIssue[] = [];
    
    for (const [path, content] of Object.entries(generation.files)) {
      if (!path.endsWith('.tsx') && !path.endsWith('.ts')) continue;
      
      // Check for React Native best practices
      if (content.includes('<View') && !content.includes('StyleSheet')) {
        issues.push({
          file: path,
          line: this.findLineNumber(content, '<View'),
          severity: 'warning',
          message: 'Consider using StyleSheet.create for better performance',
          rule: 'react-native/stylesheet-usage'
        });
      }
      
      // Check for accessibility
      if (content.includes('TouchableOpacity') && !content.includes('accessibilityRole')) {
        issues.push({
          file: path,
          line: this.findLineNumber(content, 'TouchableOpacity'),
          severity: 'error',
          message: 'TouchableOpacity components should have accessibilityRole',
          rule: 'react-native/accessibility'
        });
      }
      
      // Check for platform-specific code
      if (content.includes('Platform.OS') && !content.includes("import { Platform }")) {
        issues.push({
          file: path,
          line: this.findLineNumber(content, 'Platform.OS'),
          severity: 'error',
          message: 'Platform import is missing',
          rule: 'react-native/missing-imports'
        });
      }
    }
    
    return {
      category: 'react-native',
      issues,
      score: this.calculateScore(issues)
    };
  }

  private async performanceValidation(generation: ProcessedGeneration): Promise<ValidationReport> {
    const issues: ValidationIssue[] = [];
    
    for (const [path, content] of Object.entries(generation.files)) {
      // Check for expensive operations in render
      if (content.includes('.map(') && content.includes('return (')) {
        const mapUsages = content.match(/\.map\([^}]+}/g) || [];
        for (const usage of mapUsages) {
          if (!usage.includes('key=')) {
            issues.push({
              file: path,
              line: this.findLineNumber(content, usage),
              severity: 'warning',
              message: 'List items should have unique key prop',
              rule: 'performance/list-keys'
            });
          }
        }
      }
      
      // Check for inline functions in JSX
      const inlineFunctions = content.match(/onClick={\(\) =>/g) || [];
      if (inlineFunctions.length > 0) {
        issues.push({
          file: path,
          line: 0,
          severity: 'info',
          message: 'Consider using useCallback for event handlers',
          rule: 'performance/inline-functions'
        });
      }
    }
    
    return {
      category: 'performance',
      issues,
      score: this.calculateScore(issues)
    };
  }
}
```

## Error Recovery & Fallbacks

### Intelligent Error Handling

```typescript
// app/lib/llm/error-recovery.ts
export class ErrorRecoverySystem {
  async handleGenerationFailure(
    error: GenerationError,
    originalRequest: GenerationRequest
  ): Promise<GenerationResult> {
    const strategy = this.selectRecoveryStrategy(error);
    
    switch (strategy) {
      case 'retry_with_fallback':
        return this.retryWithFallbackProvider(originalRequest);
        
      case 'simplify_request':
        return this.simplifyAndRetry(originalRequest);
        
      case 'partial_generation':
        return this.generatePartialSolution(originalRequest);
        
      case 'template_fallback':
        return this.useTemplateFallback(originalRequest);
        
      default:
        throw new Error('Unable to recover from generation failure');
    }
  }

  private selectRecoveryStrategy(error: GenerationError): RecoveryStrategy {
    if (error.type === 'rate_limit') {
      return 'retry_with_fallback';
    }
    
    if (error.type === 'context_too_long') {
      return 'simplify_request';
    }
    
    if (error.type === 'invalid_response') {
      return 'partial_generation';
    }
    
    if (error.type === 'provider_unavailable') {
      return 'template_fallback';
    }
    
    return 'retry_with_fallback';
  }

  private async retryWithFallbackProvider(
    request: GenerationRequest
  ): Promise<GenerationResult> {
    const fallbackProviders = this.getFallbackProviders(request.preferredProvider);
    
    for (const provider of fallbackProviders) {
      try {
        console.log(`Attempting recovery with provider: ${provider.id}`);
        
        const result = await this.codeGenerator.generateCode({
          ...request,
          preferredProvider: provider.id,
          isRetry: true
        });
        
        return result;
      } catch (fallbackError) {
        console.warn(`Fallback provider ${provider.id} also failed:`, fallbackError.message);
        continue;
      }
    }
    
    throw new Error('All fallback providers failed');
  }

  private async simplifyAndRetry(request: GenerationRequest): Promise<GenerationResult> {
    // Reduce context size
    const simplifiedContext = this.contextManager.extractRelevantContext(
      request.messages,
      8000 // Reduced token limit
    );
    
    // Break complex requests into smaller parts
    const simplifiedRequest = {
      ...request,
      messages: simplifiedContext,
      complexity: Math.max(0.1, request.complexity * 0.5)
    };
    
    return this.codeGenerator.generateCode(simplifiedRequest);
  }
}
```

## Performance Monitoring

### LLM Usage Analytics

```typescript
// app/lib/llm/analytics.ts
export class LLMAnalytics {
  async trackGeneration(result: GenerationResult, request: GenerationRequest) {
    const metrics = {
      provider: result.metadata.provider,
      duration: result.metadata.duration,
      tokens: result.metadata.tokens,
      success: result.validation.isValid,
      complexity: request.complexity,
      taskType: request.type,
      timestamp: new Date()
    };
    
    // Store metrics for analysis
    await this.metricsStore.record('llm_generation', metrics);
    
    // Update provider performance scores
    await this.updateProviderScores(metrics);
    
    // Track cost
    await this.trackCost(metrics);
  }

  async getProviderPerformance(timeRange: TimeRange): Promise<ProviderStats[]> {
    return this.metricsStore.aggregate('llm_generation', {
      groupBy: 'provider',
      timeRange,
      metrics: ['success_rate', 'avg_duration', 'avg_tokens', 'cost']
    });
  }

  async generateOptimizationRecommendations(): Promise<OptimizationRecommendation[]> {
    const stats = await this.getProviderPerformance({ hours: 24 });
    const recommendations: OptimizationRecommendation[] = [];
    
    for (const providerStats of stats) {
      if (providerStats.success_rate < 0.9) {
        recommendations.push({
          type: 'reliability',
          provider: providerStats.provider,
          message: `Provider ${providerStats.provider} has low success rate (${providerStats.success_rate}%)`,
          action: 'Consider reducing traffic or investigating failures'
        });
      }
      
      if (providerStats.avg_duration > 10000) {
        recommendations.push({
          type: 'performance',
          provider: providerStats.provider,
          message: `Provider ${providerStats.provider} has high latency`,
          action: 'Consider using for non-time-sensitive requests only'
        });
      }
    }
    
    return recommendations;
  }
}
```

This comprehensive LLM integration system ensures that bfloat can reliably generate high-quality React Native code by intelligently orchestrating multiple AI providers, managing context effectively, and implementing robust error recovery mechanisms.

## Next Steps

Now that you understand the LLM integration layer, explore these related topics:

- **[React Native Generation](/core-concepts/react-native-generation/)** - How AI creates complete mobile applications
- **[State Management](/core-concepts/state-management/)** - Managing application state across the platform
- **[API Reference - LLM APIs](/api/llm-apis/)** - Detailed API documentation for LLM endpoints