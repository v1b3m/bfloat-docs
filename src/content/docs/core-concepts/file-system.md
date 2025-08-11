---
title: File System
description: File organization, structure patterns, and file handling in bfloat's React Native generation
---

# File System

bfloat's file system management ensures generated React Native projects follow industry best practices for organization, maintainability, and scalability. The AI intelligently structures projects based on complexity, platform requirements, and architectural patterns.

## Project Structure Generation

### Intelligent Architecture Selection

bfloat analyzes project requirements to generate appropriate file structures:

- **📱 Standard Structure**: For simple to moderate complexity apps
- **🏗️ Feature-Based**: For apps with distinct feature modules  
- **⚡ Monorepo**: For complex apps with shared components
- **🎯 Domain-Driven**: For enterprise applications with business domains

### Standard React Native Structure

For most applications, bfloat generates a clean, organized structure:

```
MyReactNativeApp/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Shared components
│   │   ├── forms/           # Form-specific components
│   │   └── index.ts         # Component barrel exports
│   ├── screens/             # Screen components
│   │   ├── auth/           # Authentication screens
│   │   ├── home/           # Home flow screens
│   │   ├── profile/        # Profile management
│   │   └── index.ts        # Screen exports
│   ├── navigation/          # Navigation configuration
│   │   ├── AppNavigator.tsx # Main navigation
│   │   ├── AuthNavigator.tsx# Auth flow navigation
│   │   └── types.ts        # Navigation type definitions
│   ├── services/           # API and external services
│   │   ├── api/            # API client and endpoints
│   │   ├── storage/        # Local storage utilities
│   │   └── notifications/ # Push notification handling
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts      # Authentication hooks
│   │   ├── useApi.ts       # API hooks
│   │   └── useStorage.ts   # Storage hooks
│   ├── store/              # State management
│   │   ├── slices/         # Redux slices or Zustand stores
│   │   ├── index.ts        # Store configuration
│   │   └── types.ts        # State type definitions
│   ├── utils/              # Utility functions
│   │   ├── constants.ts    # App constants
│   │   ├── helpers.ts      # Helper functions
│   │   └── validators.ts   # Form validation
│   ├── types/              # TypeScript type definitions
│   │   ├── api.ts          # API types
│   │   ├── navigation.ts   # Navigation types
│   │   └── common.ts       # Shared types
│   └── styles/             # Styling and themes
│       ├── colors.ts       # Color palette
│       ├── typography.ts   # Text styles
│       └── spacing.ts      # Layout spacing
├── assets/                 # Static assets
│   ├── images/            # Image assets
│   ├── fonts/             # Custom fonts
│   └── icons/             # Icon assets
├── android/               # Android-specific code
├── ios/                   # iOS-specific code
├── __tests__/             # Test files
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

### Feature-Based Structure

For larger applications, bfloat generates feature-based organization:

```
MyReactNativeApp/
├── src/
│   ├── features/               # Feature modules
│   │   ├── authentication/     # Auth feature
│   │   │   ├── components/     # Auth-specific components
│   │   │   ├── screens/       # Auth screens
│   │   │   ├── services/      # Auth API services
│   │   │   ├── hooks/         # Auth hooks
│   │   │   ├── store/         # Auth state
│   │   │   ├── types/         # Auth types
│   │   │   └── index.ts       # Feature exports
│   │   ├── projects/          # Projects feature
│   │   │   ├── components/    # Project components
│   │   │   ├── screens/       # Project screens
│   │   │   ├── services/      # Project APIs
│   │   │   └── store/         # Project state
│   │   └── chat/              # Chat feature
│   │       ├── components/    # Chat UI components
│   │       ├── screens/       # Chat screens
│   │       ├── services/      # Chat services
│   │       └── store/         # Chat state
│   ├── shared/                # Shared across features
│   │   ├── components/        # Common components
│   │   ├── hooks/            # Shared hooks
│   │   ├── services/         # Common services
│   │   ├── utils/            # Utility functions
│   │   └── types/            # Shared types
│   ├── navigation/           # App navigation
│   └── styles/               # Global styles
└── assets/                   # Static assets
```

## File Naming Conventions

### Component Files

bfloat generates consistent naming patterns:

```typescript
// Screen components (PascalCase + Screen suffix)
LoginScreen.tsx
ProjectListScreen.tsx
UserProfileScreen.tsx

// UI Components (PascalCase)
Button.tsx
TextInput.tsx
LoadingSpinner.tsx

// Hook files (camelCase with use prefix)
useAuth.ts
useProjects.ts
useWebSocket.ts

// Service files (camelCase + Service suffix)
apiService.ts
storageService.ts
notificationService.ts

// Type definition files (camelCase + Types suffix)
authTypes.ts
apiTypes.ts
navigationTypes.ts
```

### Index Files and Barrel Exports

For clean imports, bfloat generates barrel export files:

```typescript
// src/components/index.ts
export { default as Button } from './Button';
export { default as TextInput } from './TextInput';
export { default as LoadingSpinner } from './LoadingSpinner';
export * from './forms';

// src/screens/index.ts  
export { default as LoginScreen } from './auth/LoginScreen';
export { default as HomeScreen } from './home/HomeScreen';
export { default as ProfileScreen } from './profile/ProfileScreen';

// src/hooks/index.ts
export { useAuth } from './useAuth';
export { useProjects } from './useProjects';
export { useStorage } from './useStorage';
```

## Asset Management

### Image Organization

bfloat structures assets for optimal loading and maintenance:

```
assets/
├── images/
│   ├── common/              # Shared images
│   │   ├── logo.png
│   │   ├── placeholder.png
│   │   └── background.jpg
│   ├── icons/               # Icon images
│   │   ├── tab-icons/       # Tab bar icons
│   │   ├── header-icons/    # Navigation icons
│   │   └── action-icons/    # Button icons
│   ├── onboarding/          # Feature-specific images
│   └── profile/             # Profile images
└── fonts/                   # Custom fonts
    ├── Inter-Regular.ttf
    ├── Inter-Bold.ttf
    └── Inter-SemiBold.ttf
```

### Generated Asset Utilities

bfloat creates utilities for asset management:

```typescript
// src/utils/assets.ts
export const Images = {
  logo: require('../../assets/images/common/logo.png'),
  placeholder: require('../../assets/images/common/placeholder.png'),
  background: require('../../assets/images/common/background.jpg'),
} as const;

export const Icons = {
  home: require('../../assets/images/icons/tab-icons/home.png'),
  profile: require('../../assets/images/icons/tab-icons/profile.png'),
  settings: require('../../assets/images/icons/header-icons/settings.png'),
} as const;

// Usage in components
import { Images, Icons } from '../utils/assets';

<Image source={Images.logo} style={styles.logo} />
<Image source={Icons.home} style={styles.icon} />
```

## Configuration Files

### TypeScript Configuration

bfloat generates comprehensive TypeScript configurations:

```json
// tsconfig.json
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/screens/*": ["src/screens/*"],
      "@/services/*": ["src/services/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/store/*": ["src/store/*"],
      "@/utils/*": ["src/utils/*"],
      "@/types/*": ["src/types/*"],
      "@/assets/*": ["assets/*"]
    },
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": [
    "src/**/*",
    "assets/**/*",
    "__tests__/**/*"
  ],
  "exclude": [
    "node_modules",
    "android",
    "ios"
  ]
}
```

### Babel Configuration

```javascript
// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@/components': './src/components',
          '@/screens': './src/screens',
          '@/services': './src/services',
          '@/hooks': './src/hooks',
          '@/store': './src/store',
          '@/utils': './src/utils',
          '@/types': './src/types',
          '@/assets': './assets',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
```

## Platform-Specific Files

### iOS-Specific Organization

```
ios/
├── MyApp/
│   ├── Info.plist          # iOS app configuration
│   ├── AppDelegate.h       # App delegate header
│   ├── AppDelegate.mm      # App delegate implementation
│   ├── main.m              # App entry point
│   └── Images.xcassets/    # iOS image assets
├── MyApp.xcodeproj/        # Xcode project
└── Podfile                 # CocoaPods dependencies
```

### Android-Specific Organization

```
android/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/        # Java/Kotlin code
│   │   │   ├── res/         # Android resources
│   │   │   └── AndroidManifest.xml
│   │   └── debug/           # Debug configuration
│   ├── build.gradle         # App build configuration
│   └── proguard-rules.pro   # ProGuard rules
├── gradle/                  # Gradle wrapper
├── build.gradle             # Project build configuration
└── settings.gradle          # Project settings
```

## File Generation Patterns

### Screen Generation

bfloat creates screens with consistent patterns:

```typescript
// Generated screen template
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { Button } from '@/components';
import { Colors, Spacing, Typography } from '@/styles';
import { HomeScreenProps } from '@/types/navigation';

export const HomeScreen: React.FC<HomeScreenProps> = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Home</Text>
        
        <Button
          title="Go to Profile"
          onPress={() => navigation.navigate('Profile')}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.large,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Typography.heading1,
    marginBottom: Spacing.large,
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing.medium,
  },
});
```

### Service Generation

bfloat generates service files with proper error handling:

```typescript
// Generated API service
import { ApiResponse, User, CreateUserRequest } from '@/types/api';

class UserService {
  private baseURL = process.env.API_BASE_URL;

  async getUser(userId: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${this.baseURL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async getToken(): Promise<string> {
    // Token retrieval logic
    return '';
  }
}

export const userService = new UserService();
```

## Environment Configuration

### Environment Variables

bfloat generates environment configuration files:

```typescript
// src/config/environment.ts
import Config from 'react-native-config';

export const Environment = {
  API_BASE_URL: Config.API_BASE_URL || 'http://localhost:3000',
  WS_URL: Config.WS_URL || 'ws://localhost:3001',
  SENTRY_DSN: Config.SENTRY_DSN,
  IS_DEV: __DEV__,
  IS_IOS: Platform.OS === 'ios',
  IS_ANDROID: Platform.OS === 'android',
} as const;
```

## Next Steps

- **[Authentication](/core-concepts/authentication/)** - User authentication and security patterns
- **[API Reference](/api/routes-overview/)** - Explore the complete API documentation
- **[Components](/components/ui-components/)** - Understanding UI component generation