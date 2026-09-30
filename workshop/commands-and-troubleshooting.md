# Commands and troubleshooting

A quick reference for the yarn scripts you'll use throughout the workshop, plus common issues and how to fix them.

## Quick commands

```bash
# Install all workspace dependencies
yarn

# Build the Vega/Fire TV app (debug)
yarn vega:build

# Run on Vega Virtual Device (Mac M-series)
yarn vega:vvd:mseries

# Run on Vega Virtual Device (Intel Mac)
yarn vega:vvd:intel

# Run on a Fire TV Stick (debug build, pass DSN)
yarn vega:firetv <DSN>
yarn vega:firetv:debug <DSN>     # explicit
yarn vega:firetv:release <DSN>   # release build (used in Step 6)

# Prebuild Expo TV native projects (TV variant, sets EXPO_TV=1)
yarn expotv:prebuild

# Run on Android TV
yarn expotv:android

# Run on a specific Android TV AVD (when multiple emulators are attached)
yarn expotv android --device <YourAvdName>   # e.g. Television_1080p_API_34_2

# Run on Apple TV
yarn expotv:ios

# Run on web
yarn expotv:web
```

## Troubleshooting

### Metro dependency resolution

If Metro fails to resolve dependencies, check that `watchFolders` and `nodeModulesPaths` are correctly configured in the Metro config. The monorepo uses `react-native-monorepo-tools` to handle this.

### Metro resolves `react` to `@types/react`

If Metro resolves the runtime `react` module to `@types/react`, check the
TypeScript path mappings. Do not map `react` or `react/jsx-runtime` to type-only
packages. Keep those mappings out of Metro resolution while preserving the
existing `@/*` source alias.

### Vega build issues

Make sure the Vega CLI tools are installed and configured correctly.
See [Vega CLI Installation](https://developer.amazon.com/docs/vega/0.24/install-vega-sdk.html).

### `IVega_1_2` module dependency not found on install

If the app builds but fails to install with:

```
error (Module dependency not found): /com.amazon.vega.os@IVega_1_2
```

Your Vega SDK is older than 0.24 and doesn't ship Vega OS 1.2. The manifest targets 1.2, so nothing older will accept the package. Fix it by installing a 0.24 SDK and switching to it:

```bash
vega sdk list                    # see what you have
vega sdk install 0.24.12112      # or a newer 0.24.x patch
vega sdk use 0.24.12112
```

Then rebuild and reinstall.

### Fast Refresh not working

Fast Refresh only works with debug builds:

- `vega_aarch64.vpkg` from `aarch64-debug/` for M-series Mac
- `vega_x86_64.vpkg` from `x86_64-debug/` for Intel Mac
- `vega_armv7.vpkg` from `armv7-debug/` for Fire TV Stick

### Android NDK error

If you see `[CXX1101] NDK did not have a source.properties file`, remove any empty NDK installation directories from your Android SDK.

### Metro port conflicts

Apple TV (iOS) must run on port 8081. Avoid running Vega and Expo TV builds at the same time, as they use separate Metro instances that can conflict.
