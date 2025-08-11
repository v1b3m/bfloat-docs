---
title: React Native Generation
description: How bfloat's AI transforms natural language into complete React Native applications
---

# React Native Generation

bfloat's React Native generation system is where the magic happens - transforming conversational prompts into production-ready mobile applications. This sophisticated process goes far beyond simple code completion to understand app requirements, architect solutions, and generate complete React Native projects with proper structure, navigation, and state management.

## Generation Philosophy

### Beyond Component Generation

Unlike tools that generate isolated components, bfloat creates **complete applications** with:

- **🏗️ Full Project Structure**: Proper file organization and navigation setup
- **📱 Mobile-First Design**: Platform-optimized UI patterns and performance
- **🔄 State Management**: Intelligent selection of Redux, Zustand, or Context API
- **🧭 Navigation Flow**: Complete React Navigation implementation
- **🎨 Consistent Styling**: Unified design system with responsive layouts
- **♿ Accessibility**: WCAG-compliant components with proper semantics

### AI-Driven Architecture Decisions

The AI doesn't just generate code - it makes **architectural decisions**:

```typescript
// app/lib/llm/architecture-analyzer.ts
export class ArchitectureAnalyzer {
  analyzeRequirements(prompt: string, context: ProjectContext): ArchitecturalDecisions {
    const requirements = this.extractRequirements(prompt);
    
    return {
      navigation: this.selectNavigationPattern(requirements),
      stateManagement: this.selectStateManagement(requirements),
      styling: this.selectStylingApproach(requirements),
      dataLayer: this.selectDataLayer(requirements),
      authentication: this.selectAuthStrategy(requirements),
      testing: this.selectTestingFramework(requirements)
    };
  }

  private selectNavigationPattern(requirements: Requirements): NavigationPattern {
    const { screens, complexity, userFlow } = requirements;
    
    if (screens.length <= 3 && !userFlow.includes('nested')) {
      return 'stack';
    }
    
    if (userFlow.includes('tabs') || screens.some(s => s.type === 'main')) {
      return screens.length > 5 ? 'drawer-with-tabs' : 'bottom-tabs';
    }
    
    if (complexity > 0.7 || userFlow.includes('modal')) {
      return 'stack-with-modal';
    }
    
    return 'stack'; // Default
  }

  private selectStateManagement(requirements: Requirements): StateManagementStrategy {
    const { complexity, dataFlow, realTimeNeeds } = requirements;
    
    if (complexity < 0.3 && !realTimeNeeds) {
      return 'react-state'; // useState + Context
    }
    
    if (complexity < 0.6 && !dataFlow.includes('complex')) {
      return 'zustand';
    }
    
    if (realTimeNeeds || dataFlow.includes('normalized')) {
      return 'redux-toolkit';
    }
    
    return 'zustand'; // Sweet spot for most apps
  }
}
```

## Project Structure Generation

### Intelligent File Organization

bfloat generates a complete project structure optimized for React Native development:

```typescript
// app/lib/react-native/project-structure.ts
export class ProjectStructureGenerator {
  generateStructure(decisions: ArchitecturalDecisions): ProjectStructure {
    const structure: ProjectStructure = {
      'App.tsx': this.generateAppEntry(decisions),
      'app.json': this.generateExpoConfig(decisions),
      'package.json': this.generatePackageJson(decisions),
    };

    // Core directories
    structure['src/'] = {};
    structure['src/components/'] = this.generateComponentsStructure(decisions);
    structure['src/screens/'] = this.generateScreensStructure(decisions);
    structure['src/navigation/'] = this.generateNavigationStructure(decisions);
    
    // Conditional directories based on architecture
    if (decisions.stateManagement !== 'react-state') {
      structure['src/store/'] = this.generateStoreStructure(decisions);
    }
    
    if (decisions.dataLayer.includes('api')) {
      structure['src/services/'] = this.generateServicesStructure(decisions);
    }
    
    if (decisions.styling === 'styled-system') {
      structure['src/theme/'] = this.generateThemeStructure(decisions);
    }

    return structure;
  }

  private generateAppEntry(decisions: ArchitecturalDecisions): string {
    const { navigation, stateManagement, authentication } = decisions;
    
    let imports = [
      "import React from 'react';",
      "import { SafeAreaProvider } from 'react-native-safe-area-context';",
    ];
    
    let providers = ['SafeAreaProvider'];
    let appContent = '<AppNavigator />';

    // Add navigation setup
    if (navigation !== 'none') {
      imports.push("import { NavigationContainer } from '@react-navigation/native';");
      imports.push("import AppNavigator from './src/navigation/AppNavigator';");
      providers.push('NavigationContainer');
    }

    // Add state management providers
    switch (stateManagement) {
      case 'redux-toolkit':
        imports.push("import { Provider } from 'react-redux';");
        imports.push("import { store } from './src/store';");
        providers.unshift('Provider');
        break;
      case 'react-query':
        imports.push("import { QueryClient, QueryClientProvider } from '@tanstack/react-query';");
        providers.push('QueryClientProvider');
        break;
    }

    // Add authentication provider
    if (authentication !== 'none') {
      imports.push("import { AuthProvider } from './src/context/AuthContext';");
      providers.push('AuthProvider');
    }

    return this.generateAppComponent(imports, providers, appContent, stateManagement);
  }

  private generateAppComponent(
    imports: string[], 
    providers: string[], 
    content: string,
    stateManagement: string
  ): string {
    const importSection = imports.join('\n');
    
    let queryClientSetup = '';
    if (providers.includes('QueryClientProvider')) {
      queryClientSetup = `
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});`;
    }

    const wrappedContent = providers.reduce((acc, provider) => {
      switch (provider) {
        case 'Provider':
          return `<Provider store={store}>${acc}</Provider>`;
        case 'QueryClientProvider':
          return `<QueryClientProvider client={queryClient}>${acc}</QueryClientProvider>`;
        case 'SafeAreaProvider':
          return `<SafeAreaProvider>${acc}</SafeAreaProvider>`;
        case 'NavigationContainer':
          return `<NavigationContainer>${acc}</NavigationContainer>`;
        case 'AuthProvider':
          return `<AuthProvider>${acc}</AuthProvider>`;
        default:
          return acc;
      }
    }, content);

    return `${importSection}
${queryClientSetup}
export default function App() {
  return (
    ${wrappedContent.split('\n').map(line => line ? `    ${line}` : line).join('\n')}
  );
}`;
  }
}
```

## Screen Generation System

### Intelligent Screen Creation

bfloat generates complete screens with proper navigation, state management, and mobile UX patterns:

```typescript
// app/lib/react-native/screen-generator.ts
export class ScreenGenerator {
  async generateScreen(specification: ScreenSpecification): Promise<GeneratedScreen> {
    const { name, type, requirements, navigation } = specification;
    
    // Analyze screen requirements
    const analysis = await this.analyzeScreenRequirements(requirements);
    
    // Generate screen components
    const screenComponent = await this.generateScreenComponent(name, type, analysis);
    const styles = this.generateScreenStyles(analysis);
    const hooks = this.generateScreenHooks(analysis);
    const types = this.generateScreenTypes(analysis);
    
    return {
      component: screenComponent,
      styles,
      hooks,
      types,
      navigation: this.generateNavigationIntegration(name, navigation),
      tests: this.generateScreenTests(name, analysis)
    };
  }

  private async generateScreenComponent(
    name: string,
    type: ScreenType,
    analysis: ScreenAnalysis
  ): Promise<string> {
    const { layout, interactions, dataNeeds, accessibility } = analysis;
    
    let imports = this.generateImports(analysis);
    let hooks = this.generateHookUsage(analysis);
    let content = this.generateScreenContent(layout, interactions);
    let handlers = this.generateEventHandlers(interactions);

    return `${imports.join('\n')}

interface ${name}Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any, '${name}'>;
}

export default function ${name}Screen({ navigation, route }: ${name}Props) {
  ${hooks.join('\n  ')}
  
  ${handlers.join('\n  ')}

  return (
    <SafeAreaView style={styles.container}>
      ${content.split('\n').map(line => line ? `      ${line}` : line).join('\n')}
    </SafeAreaView>
  );
}

${this.generateScreenStyles(analysis)}`;
  }

  private generateScreenContent(layout: LayoutStructure, interactions: Interaction[]): string {
    switch (layout.type) {
      case 'list':
        return this.generateListLayout(layout, interactions);
      case 'form':
        return this.generateFormLayout(layout, interactions);
      case 'detail':
        return this.generateDetailLayout(layout, interactions);
      case 'dashboard':
        return this.generateDashboardLayout(layout, interactions);
      default:
        return this.generateBasicLayout(layout, interactions);
    }
  }

  private generateListLayout(layout: LayoutStructure, interactions: Interaction[]): string {
    const { itemType, searchable, filterable, refreshable } = layout;
    
    let headerContent = '';
    if (searchable) {
      headerContent += `
<View style={styles.searchContainer}>
  <TextInput
    style={styles.searchInput}
    placeholder="Search ${itemType}s..."
    value={searchQuery}
    onChangeText={setSearchQuery}
    accessibilityLabel="Search input"
  />
</View>`;
    }

    if (filterable) {
      headerContent += `
<View style={styles.filterContainer}>
  {filters.map((filter, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.filterChip, filter.active && styles.filterChipActive]}
      onPress={() => toggleFilter(filter.id)}
      accessibilityRole="button"
    >
      <Text style={[styles.filterText, filter.active && styles.filterTextActive]}>
        {filter.label}
      </Text>
    </TouchableOpacity>
  ))}
</View>`;
    }

    const refreshControl = refreshable 
      ? `refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}`
      : '';

    return `${headerContent}
<FlatList
  data={filteredData}
  renderItem={({ item }) => (
    <${itemType}Item
      item={item}
      onPress={() => navigation.navigate('${itemType}Detail', { id: item.id })}
    />
  )}
  keyExtractor={(item) => item.id}
  ${refreshControl}
  contentContainerStyle={styles.listContainer}
  showsVerticalScrollIndicator={false}
/>`;
  }

  private generateFormLayout(layout: LayoutStructure, interactions: Interaction[]): string {
    const { fields, validation, submitAction } = layout;
    
    const formFields = fields.map(field => {
      switch (field.type) {
        case 'text':
          return this.generateTextInput(field);
        case 'email':
          return this.generateEmailInput(field);
        case 'password':
          return this.generatePasswordInput(field);
        case 'select':
          return this.generateSelectInput(field);
        case 'date':
          return this.generateDateInput(field);
        default:
          return this.generateTextInput(field);
      }
    }).join('\n\n      ');

    const submitButton = `
<TouchableOpacity
  style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]}
  onPress={handleSubmit}
  disabled={!isFormValid || isSubmitting}
  accessibilityRole="button"
  accessibilityState={{ disabled: !isFormValid || isSubmitting }}
>
  {isSubmitting ? (
    <ActivityIndicator color="#ffffff" />
  ) : (
    <Text style={styles.submitButtonText}>${submitAction.label}</Text>
  )}
</TouchableOpacity>`;

    return `<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.formContainer}>
        ${formFields}
        
        ${submitButton}
      </View>
    </ScrollView>`;
  }

  private generateTextInput(field: FormField): string {
    const { name, label, required, validation, placeholder } = field;
    
    return `<View style={styles.inputContainer}>
  <Text style={styles.inputLabel}>
    ${label}${required ? ' *' : ''}
  </Text>
  <TextInput
    style={[styles.textInput, errors.${name} && styles.textInputError]}
    value={formData.${name}}
    onChangeText={(text) => updateFormData('${name}', text)}
    placeholder="${placeholder || label}"
    accessibilityLabel="${label}"
    accessibilityRequired={${required}}
  />
  {errors.${name} && (
    <Text style={styles.errorText}>{errors.${name}}</Text>
  )}
</View>`;
  }
}
```

## Component Generation System

### Smart Component Architecture

bfloat generates reusable components following React Native best practices:

```typescript
// app/lib/react-native/component-generator.ts
export class ComponentGenerator {
  async generateComponent(specification: ComponentSpecification): Promise<GeneratedComponent> {
    const { name, type, props, styling, accessibility } = specification;
    
    // Analyze component complexity and patterns
    const analysis = this.analyzeComponent(specification);
    
    // Generate component variations
    const baseComponent = this.generateBaseComponent(name, analysis);
    const styledComponent = this.generateStyledVariant(name, analysis);
    const compoundComponents = this.generateCompoundComponents(name, analysis);
    
    return {
      base: baseComponent,
      styled: styledComponent,
      compounds: compoundComponents,
      types: this.generateComponentTypes(analysis),
      stories: this.generateComponentStories(name, analysis),
      tests: this.generateComponentTests(name, analysis)
    };
  }

  private generateBaseComponent(name: string, analysis: ComponentAnalysis): string {
    const { props, variants, interactions, performance } = analysis;
    
    let imports = [
      "import React from 'react';",
      "import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';",
    ];

    // Add performance optimizations
    if (performance.shouldMemo) {
      imports[0] = "import React, { memo } from 'react';";
    }

    if (performance.needsCallback) {
      imports[0] = imports[0].replace('memo', 'memo, useCallback');
    }

    // Generate prop interface
    const propInterface = this.generatePropInterface(name, props, variants);
    
    // Generate component body
    const componentBody = this.generateComponentBody(name, analysis);
    
    // Generate styles
    const styles = this.generateComponentStyles(analysis);

    const component = `${imports.join('\n')}

${propInterface}

${performance.shouldMemo ? 'const' : 'export default function'} ${name}${performance.shouldMemo ? ': React.FC<' + name + 'Props>' : ''} = ${performance.shouldMemo ? 'memo(' : ''}({
  ${props.map(p => p.name).join(',\n  ')},
  ...restProps
}: ${name}Props) => {
  ${componentBody}
}${performance.shouldMemo ? ')' : ''};

${!performance.shouldMemo ? '' : `export default ${name};`}

${styles}`;

    return component;
  }

  private generateComponentBody(name: string, analysis: ComponentAnalysis): string {
    const { layout, interactions, variants, accessibility } = analysis;
    
    // Generate variant logic
    let variantLogic = '';
    if (variants.length > 0) {
      variantLogic = this.generateVariantLogic(variants);
    }

    // Generate interaction handlers
    let handlers = '';
    if (interactions.length > 0) {
      handlers = this.generateInteractionHandlers(interactions);
    }

    // Generate accessibility props
    const a11yProps = this.generateAccessibilityProps(accessibility);

    // Generate render logic
    const renderContent = this.generateRenderContent(layout, variants);

    return `${variantLogic}
  ${handlers}

  return (
    <View
      style={[styles.container, variantStyles]}
      ${a11yProps}
      {...restProps}
    >
      ${renderContent}
    </View>
  );`;
  }

  private generateVariantLogic(variants: ComponentVariant[]): string {
    const variantCases = variants.map(variant => {
      const conditions = variant.conditions.map(condition => {
        switch (condition.type) {
          case 'prop':
            return `${condition.prop} === '${condition.value}'`;
          case 'state':
            return `${condition.state}`;
          case 'platform':
            return `Platform.OS === '${condition.platform}'`;
          default:
            return 'false';
        }
      }).join(' && ');

      return `${conditions} && styles.${variant.name}`;
    }).join(',\n    ');

    return `const variantStyles = [
    ${variantCases}
  ].filter(Boolean);`;
  }

  private generateAccessibilityProps(accessibility: AccessibilityRequirements): string {
    const props = [];
    
    if (accessibility.role) {
      props.push(`accessibilityRole="${accessibility.role}"`);
    }
    
    if (accessibility.label) {
      props.push(`accessibilityLabel={${accessibility.label}}`);
    }
    
    if (accessibility.hint) {
      props.push(`accessibilityHint={${accessibility.hint}}`);
    }
    
    if (accessibility.state) {
      props.push(`accessibilityState={${JSON.stringify(accessibility.state)}}`);
    }

    return props.join('\n      ');
  }
}
```

## Navigation Generation

### Complete Navigation Setup

bfloat generates complete navigation systems with proper TypeScript typing:

```typescript
// app/lib/react-native/navigation-generator.ts
export class NavigationGenerator {
  generateNavigation(structure: NavigationStructure): NavigationFiles {
    const { pattern, screens, modals, deepLinks } = structure;
    
    return {
      'AppNavigator.tsx': this.generateAppNavigator(pattern, screens, modals),
      'types.ts': this.generateNavigationTypes(screens, modals),
      'linking.ts': deepLinks ? this.generateLinkingConfig(deepLinks) : null,
      'hooks.ts': this.generateNavigationHooks(screens)
    };
  }

  private generateAppNavigator(
    pattern: NavigationPattern,
    screens: Screen[],
    modals: Modal[]
  ): string {
    switch (pattern) {
      case 'stack':
        return this.generateStackNavigator(screens, modals);
      case 'bottom-tabs':
        return this.generateTabNavigator(screens, modals);
      case 'drawer':
        return this.generateDrawerNavigator(screens, modals);
      case 'stack-with-modal':
        return this.generateStackWithModal(screens, modals);
      default:
        return this.generateStackNavigator(screens, modals);
    }
  }

  private generateStackNavigator(screens: Screen[], modals: Modal[]): string {
    const imports = [
      "import React from 'react';",
      "import { createNativeStackNavigator } from '@react-navigation/native-stack';",
      ...screens.map(screen => `import ${screen.component} from '../screens/${screen.component}';`),
      ...modals.map(modal => `import ${modal.component} from '../screens/${modal.component}';`),
      "import { RootStackParamList } from './types';"
    ];

    const screenDefinitions = screens.map(screen => {
      const options = this.generateScreenOptions(screen);
      return `<Stack.Screen
        name="${screen.name}"
        component={${screen.component}}
        ${options ? `options={${options}}` : ''}
      />`;
    }).join('\n        ');

    const modalDefinitions = modals.map(modal => {
      return `<Stack.Screen
        name="${modal.name}"
        component={${modal.component}}
        options={{
          presentation: 'modal',
          headerShown: ${modal.showHeader || false}
        }}
      />`;
    }).join('\n        ');

    return `${imports.join('\n')}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      {/* Main Screens */}
      ${screenDefinitions}
      
      {/* Modal Screens */}
      ${modalDefinitions}
    </Stack.Navigator>
  );
}`;
  }

  private generateTabNavigator(screens: Screen[], modals: Modal[]): string {
    const tabScreens = screens.filter(s => s.showInTabs);
    const stackScreens = screens.filter(s => !s.showInTabs);

    const imports = [
      "import React from 'react';",
      "import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';",
      "import { createNativeStackNavigator } from '@react-navigation/native-stack';",
      "import Icon from 'react-native-vector-icons/Feather';",
      ...screens.map(screen => `import ${screen.component} from '../screens/${screen.component}';`),
      "import { TabParamList, RootStackParamList } from './types';"
    ];

    const tabDefinitions = tabScreens.map(screen => {
      const iconName = this.getIconForScreen(screen);
      return `<Tab.Screen
        name="${screen.name}"
        component={${screen.component}}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="${iconName}" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />`;
    }).join('\n        ');

    return `${imports.join('\n')}

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#F8F9FA',
          borderTopColor: '#E5E5E7',
        },
      }}
    >
      ${tabDefinitions}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      {/* Add other stack screens and modals here */}
    </Stack.Navigator>
  );
}`;
  }

  private generateNavigationTypes(screens: Screen[], modals: Modal[]): string {
    const screenParams = screens.map(screen => {
      if (screen.params && screen.params.length > 0) {
        const paramTypes = screen.params.map(param => 
          `${param.name}${param.optional ? '?' : ''}: ${param.type}`
        ).join('; ');
        return `${screen.name}: { ${paramTypes} };`;
      }
      return `${screen.name}: undefined;`;
    }).join('\n  ');

    const modalParams = modals.map(modal => {
      if (modal.params && modal.params.length > 0) {
        const paramTypes = modal.params.map(param => 
          `${param.name}${param.optional ? '?' : ''}: ${param.type}`
        ).join('; ');
        return `${modal.name}: { ${paramTypes} };`;
      }
      return `${modal.name}: undefined;`;
    }).join('\n  ');

    return `export type RootStackParamList = {
  ${screenParams}
  ${modalParams}
};

export type TabParamList = {
  ${screens.filter(s => s.showInTabs).map(s => `${s.name}: undefined;`).join('\n  ')}
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}`;
  }
}
```

## State Management Integration

### Intelligent State Architecture

bfloat selects and implements the appropriate state management solution:

```typescript
// app/lib/react-native/state-generator.ts
export class StateManagementGenerator {
  generateStateManagement(strategy: StateManagementStrategy, requirements: StateRequirements): StateFiles {
    switch (strategy) {
      case 'zustand':
        return this.generateZustandStore(requirements);
      case 'redux-toolkit':
        return this.generateReduxToolkit(requirements);
      case 'react-query':
        return this.generateReactQuery(requirements);
      case 'react-state':
        return this.generateContextState(requirements);
      default:
        return this.generateZustandStore(requirements);
    }
  }

  private generateZustandStore(requirements: StateRequirements): StateFiles {
    const { entities, actions, persistence, middleware } = requirements;
    
    const stores = entities.map(entity => ({
      name: `${entity.name}Store.ts`,
      content: this.generateZustandStoreFile(entity, actions, persistence, middleware)
    }));

    return {
      stores,
      hooks: this.generateZustandHooks(entities),
      types: this.generateStateTypes(entities),
      utils: persistence ? this.generatePersistenceUtils() : null
    };
  }

  private generateZustandStoreFile(
    entity: StateEntity,
    actions: StateAction[],
    persistence: boolean,
    middleware: string[]
  ): string {
    const entityActions = actions.filter(a => a.entity === entity.name);
    
    let imports = [
      "import { create } from 'zustand';",
    ];

    if (persistence) {
      imports.push("import { persist } from 'zustand/middleware';");
    }

    if (middleware.includes('devtools')) {
      imports.push("import { devtools } from 'zustand/middleware';");
    }

    if (middleware.includes('immer')) {
      imports.push("import { immer } from 'zustand/middleware/immer';");
    }

    // Generate state interface
    const stateInterface = `interface ${entity.name}State {
  // Data
  ${entity.fields.map(field => `${field.name}: ${field.type};`).join('\n  ')}
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  ${entityActions.map(action => `${action.name}: ${this.generateActionSignature(action)};`).join('\n  ')}
}`;

    // Generate initial state
    const initialState = `{
  ${entity.fields.map(field => `${field.name}: ${field.defaultValue},`).join('\n  ')}
  isLoading: false,
  error: null,
}`;

    // Generate actions implementation
    const actionsImplementation = entityActions.map(action => 
      this.generateZustandAction(action, entity)
    ).join(',\n  ');

    // Generate store creation
    let storeCreation = `create<${entity.name}State>()`;
    
    // Apply middleware
    if (middleware.includes('devtools')) {
      storeCreation += `\n  devtools`;
    }
    
    if (middleware.includes('immer')) {
      storeCreation += `\n  immer`;
    }
    
    if (persistence) {
      storeCreation += `\n  persist`;
    }

    return `${imports.join('\n')}

${stateInterface}

export const use${entity.name}Store = ${storeCreation}(
  ${persistence ? 'persist(' : ''}(set, get) => ({
    ...${initialState},
    ${actionsImplementation}
  })${persistence ? `, {
    name: '${entity.name.toLowerCase()}-storage',
    partialize: (state) => ({
      ${entity.fields.filter(f => f.persist !== false).map(f => f.name).join(',\n      ')}
    }),
  })` : ''}
);`;
  }

  private generateZustandAction(action: StateAction, entity: StateEntity): string {
    switch (action.type) {
      case 'sync':
        return `${action.name}: (${action.params.map(p => `${p.name}: ${p.type}`).join(', ')}) => 
    set(state => ({ ...state, ${action.updates} }))`;
      
      case 'async':
        return `${action.name}: async (${action.params.map(p => `${p.name}: ${p.type}`).join(', ')}) => {
    set(state => ({ ...state, isLoading: true, error: null }));
    try {
      ${action.implementation}
      set(state => ({ ...state, isLoading: false }));
    } catch (error) {
      set(state => ({ 
        ...state, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
    }
  }`;
      
      default:
        return `${action.name}: () => set(state => state)`;
    }
  }

  private generateReduxToolkit(requirements: StateRequirements): StateFiles {
    const { entities } = requirements;
    
    const slices = entities.map(entity => ({
      name: `${entity.name.toLowerCase()}Slice.ts`,
      content: this.generateRTKSlice(entity)
    }));

    return {
      store: this.generateRTKStore(entities),
      slices,
      hooks: this.generateRTKHooks(entities),
      types: this.generateRTKTypes(entities)
    };
  }

  private generateRTKSlice(entity: StateEntity): string {
    const actions = this.getActionsForEntity(entity);
    
    const imports = [
      "import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';",
      `import { ${entity.name} } from '../types';`
    ];

    // Generate async thunks
    const asyncThunks = actions
      .filter(a => a.type === 'async')
      .map(action => this.generateAsyncThunk(action, entity))
      .join('\n\n');

    // Generate initial state
    const initialState = `{
  items: [] as ${entity.name}[],
  currentItem: null as ${entity.name} | null,
  isLoading: false,
  error: null as string | null,
}`;

    // Generate reducers
    const reducers = actions
      .filter(a => a.type === 'sync')
      .map(action => this.generateRTKReducer(action))
      .join(',\n    ');

    // Generate extra reducers for async actions
    const extraReducers = actions
      .filter(a => a.type === 'async')
      .map(action => this.generateExtraReducers(action))
      .join('\n    ');

    return `${imports.join('\n')}

${asyncThunks}

interface ${entity.name}State {
  items: ${entity.name}[];
  currentItem: ${entity.name} | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ${entity.name}State = ${initialState};

const ${entity.name.toLowerCase()}Slice = createSlice({
  name: '${entity.name.toLowerCase()}',
  initialState,
  reducers: {
    ${reducers}
  },
  extraReducers: (builder) => {
    ${extraReducers}
  },
});

export const { ${actions.filter(a => a.type === 'sync').map(a => a.name).join(', ')} } = ${entity.name.toLowerCase()}Slice.actions;
export default ${entity.name.toLowerCase()}Slice.reducer;`;
  }
}
```

## Performance Optimization

### Mobile-First Performance

bfloat generates React Native code optimized for mobile performance:

```typescript
// app/lib/react-native/performance-optimizer.ts
export class PerformanceOptimizer {
  optimizeGeneration(code: GeneratedCode): OptimizedCode {
    return {
      ...code,
      components: this.optimizeComponents(code.components),
      screens: this.optimizeScreens(code.screens),
      navigation: this.optimizeNavigation(code.navigation),
      assets: this.optimizeAssets(code.assets)
    };
  }

  private optimizeComponents(components: Component[]): Component[] {
    return components.map(component => ({
      ...component,
      code: this.applyComponentOptimizations(component.code)
    }));
  }

  private applyComponentOptimizations(code: string): string {
    let optimized = code;

    // Add React.memo for functional components
    if (this.shouldMemoize(code)) {
      optimized = this.addMemoization(optimized);
    }

    // Optimize StyleSheet usage
    optimized = this.optimizeStyles(optimized);

    // Add useCallback for event handlers
    optimized = this.optimizeEventHandlers(optimized);

    // Optimize list rendering
    optimized = this.optimizeListRendering(optimized);

    // Add lazy loading for images
    optimized = this.optimizeImages(optimized);

    return optimized;
  }

  private shouldMemoize(code: string): boolean {
    // Memoize if component receives props and doesn't use much state
    const hasProps = code.includes('Props>');
    const hasMinimalState = (code.match(/useState/g) || []).length <= 2;
    const hasExpensiveRendering = code.includes('FlatList') || code.includes('.map(');
    
    return hasProps && (hasMinimalState || hasExpensiveRendering);
  }

  private optimizeListRendering(code: string): string {
    let optimized = code;

    // Add getItemLayout for fixed-size items
    if (code.includes('FlatList') && this.hasFixedItemSize(code)) {
      const itemHeight = this.extractItemHeight(code);
      optimized = optimized.replace(
        /(<FlatList[^>]*)/,
        `$1\n  getItemLayout={(data, index) => ({ length: ${itemHeight}, offset: ${itemHeight} * index, index })}`
      );
    }

    // Add keyExtractor optimization
    if (code.includes('FlatList') && !code.includes('keyExtractor')) {
      optimized = optimized.replace(
        /(<FlatList[^>]*)/,
        '$1\n  keyExtractor={(item, index) => item.id?.toString() || index.toString()}'
      );
    }

    // Add removeClippedSubviews for long lists
    if (code.includes('FlatList')) {
      optimized = optimized.replace(
        /(<FlatList[^>]*)/,
        '$1\n  removeClippedSubviews={true}'
      );
    }

    return optimized;
  }

  private optimizeImages(code: string): string {
    let optimized = code;

    // Add lazy loading for images
    if (code.includes('<Image')) {
      optimized = optimized.replace(
        /<Image\s+source=/g,
        '<Image\n  lazy\n  source='
      );
    }

    // Add optimized resize modes
    optimized = optimized.replace(
      /<Image([^>]*(?!resizeMode)[^>]*)>/g,
      '<Image$1 resizeMode="cover">'
    );

    return optimized;
  }
}
```

## Testing Generation

### Comprehensive Test Suite

bfloat generates complete test suites for React Native components and screens:

```typescript
// app/lib/react-native/test-generator.ts
export class TestGenerator {
  generateTests(component: GeneratedComponent): TestSuite {
    return {
      unit: this.generateUnitTests(component),
      integration: this.generateIntegrationTests(component),
      accessibility: this.generateAccessibilityTests(component),
      performance: this.generatePerformanceTests(component)
    };
  }

  private generateUnitTests(component: GeneratedComponent): string {
    const { name, props, interactions } = component;
    
    const imports = [
      "import React from 'react';",
      "import { render, fireEvent, waitFor } from '@testing-library/react-native';",
      `import ${name} from '../${name}';`
    ];

    const basicTests = `describe('${name}', () => {
  const defaultProps = {
    ${props.required.map(prop => `${prop.name}: ${prop.testValue}`).join(',\n    ')}
  };

  it('renders correctly', () => {
    const { getByTestId } = render(<${name} {...defaultProps} />);
    expect(getByTestId('${name.toLowerCase()}')).toBeTruthy();
  });

  it('renders with custom props', () => {
    const customProps = {
      ...defaultProps,
      ${props.optional.map(prop => `${prop.name}: ${prop.testValue}`).join(',\n      ')}
    };
    
    const { getByTestId } = render(<${name} {...customProps} />);
    expect(getByTestId('${name.toLowerCase()}')).toBeTruthy();
  });
`;

    const interactionTests = interactions.map(interaction => 
      this.generateInteractionTest(interaction, name)
    ).join('\n\n  ');

    return `${imports.join('\n')}

${basicTests}
${interactionTests}
});`;
  }

  private generateAccessibilityTests(component: GeneratedComponent): string {
    const { name, accessibility } = component;
    
    return `describe('${name} Accessibility', () => {
  const defaultProps = { /* default props */ };

  it('has proper accessibility labels', () => {
    const { getByLabelText } = render(<${name} {...defaultProps} />);
    ${accessibility.labels.map(label => 
      `expect(getByLabelText('${label}')).toBeTruthy();`
    ).join('\n    ')}
  });

  it('has proper accessibility roles', () => {
    const { getByRole } = render(<${name} {...defaultProps} />);
    ${accessibility.roles.map(role => 
      `expect(getByRole('${role}')).toBeTruthy();`
    ).join('\n    ')}
  });

  it('supports screen readers', async () => {
    const { getByTestId } = render(<${name} {...defaultProps} />);
    const component = getByTestId('${name.toLowerCase()}');
    
    expect(component.props.accessible).toBe(true);
    expect(component.props.accessibilityLabel).toBeTruthy();
  });
});`;
  }
}
```

## Quality Assurance

### React Native Validation

bfloat ensures generated code follows React Native best practices:

```typescript
// app/lib/react-native/validator.ts
export class ReactNativeValidator {
  async validateGeneration(generation: ReactNativeGeneration): Promise<ValidationReport> {
    const validations = await Promise.all([
      this.validateProjectStructure(generation.structure),
      this.validateComponentQuality(generation.components),
      this.validateNavigationSetup(generation.navigation),
      this.validatePerformance(generation.performance),
      this.validateAccessibility(generation.accessibility),
      this.validatePlatformCompatibility(generation.platforms)
    ]);

    return this.aggregateValidations(validations);
  }

  private async validateComponentQuality(components: Component[]): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];

    for (const component of components) {
      // Check for proper imports
      if (!component.code.includes("from 'react-native'")) {
        issues.push({
          component: component.name,
          severity: 'error',
          message: 'Missing React Native imports',
          suggestion: 'Add required React Native component imports'
        });
      }

      // Check for StyleSheet usage
      if (component.code.includes('style={{') && !component.code.includes('StyleSheet.create')) {
        issues.push({
          component: component.name,
          severity: 'warning',
          message: 'Inline styles detected',
          suggestion: 'Use StyleSheet.create for better performance'
        });
      }

      // Check for accessibility
      if (component.code.includes('TouchableOpacity') && !component.code.includes('accessibilityRole')) {
        issues.push({
          component: component.name,
          severity: 'error',
          message: 'Missing accessibility role for interactive element',
          suggestion: 'Add accessibilityRole prop to TouchableOpacity'
        });
      }

      // Check for proper key props in lists
      if (component.code.includes('.map(') && !component.code.includes('key=')) {
        issues.push({
          component: component.name,
          severity: 'error',
          message: 'Missing key prop in list rendering',
          suggestion: 'Add unique key prop to list items'
        });
      }
    }

    return {
      category: 'component-quality',
      issues,
      score: this.calculateQualityScore(issues),
      passed: issues.filter(i => i.severity === 'error').length === 0
    };
  }

  private async validatePerformance(performance: PerformanceMetrics): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];

    // Check bundle size
    if (performance.bundleSize > 50 * 1024 * 1024) { // 50MB
      issues.push({
        severity: 'warning',
        message: 'Large bundle size detected',
        suggestion: 'Consider code splitting or removing unused dependencies'
      });
    }

    // Check component complexity
    const complexComponents = performance.components.filter(c => c.complexity > 0.8);
    if (complexComponents.length > 0) {
      issues.push({
        severity: 'info',
        message: `${complexComponents.length} complex components detected`,
        suggestion: 'Consider breaking down complex components into smaller pieces'
      });
    }

    // Check for performance anti-patterns
    if (performance.antiPatterns.length > 0) {
      performance.antiPatterns.forEach(pattern => {
        issues.push({
          severity: 'warning',
          message: `Performance anti-pattern: ${pattern.name}`,
          suggestion: pattern.solution
        });
      });
    }

    return {
      category: 'performance',
      issues,
      score: this.calculatePerformanceScore(performance),
      passed: issues.filter(i => i.severity === 'error').length === 0
    };
  }
}
```

This comprehensive React Native generation system ensures that bfloat creates not just functional mobile applications, but production-ready, performant, and accessible React Native apps that follow industry best practices. The AI-driven approach means developers get complete applications with proper architecture, navigation, state management, and testing - dramatically reducing development time while maintaining code quality.

## Next Steps

Now that you understand how bfloat generates complete React Native applications, explore these related topics:

- **[State Management](/core-concepts/state-management/)** - Deep dive into application state architecture
- **[API Reference - Project APIs](/api/project-apis/)** - API endpoints for managing generated projects  
- **[Component Documentation](/components/ui-components/)** - UI component library and usage examples