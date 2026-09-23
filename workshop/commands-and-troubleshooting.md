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

# Run on a Fire TV Stick (pass DSN)
yarn vega:firetv <DSN>

# Prebuild Expo TV native projects
yarn expotv:prebuild

# Run on Android TV
yarn expotv:android

# Run on Apple TV
yarn expotv:ios

# Run on web
yarn expotv:web
```

## Troubleshooting

### Metro dependency resolution

If Metro fails to resolve dependencies, check that `watchFolders` and `nodeModulesPaths` are correctly configured in the Metro config. The monorepo uses `react-native-monorepo-tools` to handle this.

### Vega build issues

Make sure the Vega CLI tools are installed and configured correctly.
See [Vega CLI Installation](https://developer.amazon.com/docs/vega/0.24/install-vega-sdk.html).

### Fast Refresh not working

Fast Refresh only works with debug builds:

- `vega_aarch64.vpkg` from `aarch64-debug/` for M-series Mac
- `vega_x86_64.vpkg` from `x86_64-debug/` for Intel Mac
- `vega_armv7.vpkg` from `armv7-debug/` for Fire TV Stick

### Android NDK error

If you see `[CXX1101] NDK did not have a source.properties file`, remove any empty NDK installation directories from your Android SDK.

### Metro port conflicts

Apple TV (iOS) must run on port 8081. Avoid running Vega and Expo TV builds at the same time, as they use separate Metro instances that can conflict.
