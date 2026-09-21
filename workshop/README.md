# Workshop: From Vega hello world to multi-platform TV

This workshop walks you through running a multi-platform TV app on Vega OS (Fire TV) and at least one other target (web, Android TV, or Apple TV). Over four steps, you'll add shared components that adapt to each platform.

You'll start with a working monorepo that has a simple tile-based UI. The monorepo structure is already set up for you - Yarn workspaces, Metro configs, the lot. Your job is to build the interesting bits: shared components with platform-specific behaviour.

## What you'll learn

- How to set up the Vega SDK and run a React Native app on Fire TV
- TV-specific patterns: focus management, D-pad navigation, 1080p scaling
- How a Yarn workspaces monorepo shares code across TV platforms
- Two approaches to platform-specific code: file extensions (`.kepler.tsx`, `.web.tsx`) vs. `Platform.select()`
- Adding native modules (Lottie animations) with platform-specific fallbacks
- Sharing network logic and utilities across all platforms

## Prerequisites

- Node.js v18+
- Yarn v4.5.0+
- Familiarity with React and React Native basics
- macOS 10.15+ or Ubuntu 20.04+ (required for Vega SDK)
- Optional: Android Studio with a TV system image (for Android TV)
- Optional: Xcode (for Apple TV)

## Workshop steps

| Step                                                         | What you'll do                                         | What you'll learn                                          |
| ------------------------------------------------------------ | ------------------------------------------------------ | ---------------------------------------------------------- |
| [Step 1: Set up and run the app](./step-01-setup-and-run.md) | Install the Vega SDK, run the app on Fire TV and web   | Environment setup, monorepo structure, building for Vega   |
| [Step 2: Add a shared Header](./step-02-shared-header.md)    | Create a Header component with platform-specific logos | File extensions vs. Platform.select(), platform resolution |
| [Step 3: Add a Lottie animation](./step-03-add-animation.md) | Add an animated React Native logo with a web fallback  | Native modules, platform-specific fallbacks, Lottie        |
| [Step 4: Add an API demo](./step-04-add-api-demo.md)         | Fetch data from a public API in a shared component     | Network requests, shared utilities, fetch across platforms |

## How the monorepo works

This project uses [Yarn workspaces](https://yarnpkg.com/features/workspaces) to manage multiple packages in a single repository. Here's the structure:

```
├── package.json              # Root workspace config (Yarn 4)
├── .yarnrc.yml               # Yarn config (node-modules linker, hoisting limits)
├── packages/
│   ├── shared/               # @multitv/shared - UI components and utilities
│   ├── vega/                 # @multitv/vega - Fire TV app (React Native Kepler)
│   └── expotv/               # @multitv/expotv - Android TV, Apple TV, and web (Expo)
```

**`packages/shared`** contains all the cross-platform code: components, screens, scaling utilities, and services. It has no platform runtime of its own - it's consumed by the other two packages.

**`packages/vega`** is the Fire TV app. It uses React Native Kepler (Vega's RN runtime) and imports from `@multitv/shared`. When you run `yarn vega:build`, it bundles the shared code along with the Vega entry point into a `.vpkg` file that runs on Fire TV.

**`packages/expotv`** is the Expo TV app. It targets Android TV, Apple TV, and web using `react-native-tvos` and Expo. It also imports from `@multitv/shared` - the same components render on all its target platforms.

If you write components once in `shared/`, and both `vega/` and `expotv/` consume them. Platform-specific differences are handled via file extensions (`.kepler.tsx`, `.android.tsx`, `.ios.tsx`, `.web.tsx`) or `Platform.select()` - you'll learn both approaches in this workshop.

## Finished reference

The `main` branch of this repo contains the completed version with all steps applied. Compare your progress at any point by checking `main`.
