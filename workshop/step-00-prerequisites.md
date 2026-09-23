# Step 0: Prerequisites

Before you start building, we need to get your environment set up. This step covers everything you need installed and configured before Step 1.

## 0.1 Core requirements

You'll need the following on your machine:

- **[Node.js](https://nodejs.org/)** v18 or higher
- **[Yarn](https://yarnpkg.com/)** v4.5.0 or higher
- **[Git](https://git-scm.com/)**
- **macOS 10.15+ or Ubuntu 20.04+** (required for the Vega SDK)

## 0.2 Install ADBT (Amazon Developer Build Tools, recommended)

ADBT is the agentic tooling for Vega development. It exposes an MCP server that your AI assistant (Claude, Cursor, etc.) can talk to, so you can prompt it to install the SDK, build packages, and manage devices instead of running each command yourself. Full details are in the [Vega MCP server guide](https://developer.amazon.com/docs/vega/0.24/mcp-server.html).

ADBT is recommended because it provides the guided path used throughout the workshop. If you cannot install it, Step 6 also includes a manual Vega Studio and CLI path for measuring UI fluidity.

Install ADBT by initialising the context for your project:

```bash
npx -y @amazon-devices/amazon-devices-buildertools-mcp@latest init-context
```

Then verify the setup by checking the status:

```bash
npx -y @amazon-devices/amazon-devices-buildertools-mcp@latest check-status
```

You should see output like:

```
Agent                  │ Context Document         │ MCP Configuration
───────────────────────┼──────────────────────────┼──────────────────────────
Kiro                   │ ✅ v5.1                   │ ✅ Configured

📊 Summary:
   Total agents checked: 1
   ✅ Fully configured: 1
```

## 0.3 Install the Vega SDK

**Option A: Use ADBT (recommended)**

With ADBT connected to your AI assistant, prompt it to install the SDK:

> Install the Vega SDK and set up Yarn for Amazon device packages.

ADBT will install the `vega` CLI, the Vega Virtual Device, React Native Kepler, and configure Yarn to resolve Amazon device packages.

**Option B: Manual install**

Follow the official guides:

1. **[Install the Vega Developer Tools](https://developer.amazon.com/docs/vega/latest/install-vega-sdk.html)** - installs the `vega` CLI, the Vega Virtual Device, and React Native Kepler
2. **[Configure Yarn for Vega](https://developer.amazon.com/docs/vega/latest/configure-package-managers.html)** - sets up Yarn to resolve Amazon device packages

## 0.4 Optional: Expo TV targets

The workshop uses web as the second target by default (no extra setup). If you'd rather run on a TV emulator, install one of the following:

- **[Expo CLI](https://docs.expo.dev/get-started/installation/)** (required for any Expo TV target)
- **Android TV:** [Android Studio](https://developer.android.com/studio) with an Android TV system image
- **Apple TV:** [Xcode](https://developer.apple.com/xcode/)

## 0.5 Verify your environment

Check that the core tools are on your PATH:

```bash
# Vega CLI installed
vega --version

# Node.js 18+
node --version

# Yarn 4+
yarn --version
```

## 0.6 Install dependencies

From the root of the repo, install all workspace dependencies:

```bash
yarn
```

This installs everything for `packages/shared`, `packages/vega`, and `packages/expotv` in one go.

---

**Next:** [Step 1: Set up and run the app →](./step-01-setup-and-run.md)
