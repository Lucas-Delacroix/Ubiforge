# Ubiforge
A simple tool for creating custom Ubuntu ISO images, with pre-installation configurations, packages, and post-installation scripts and services.

## Overview
Node.js CLI to create customized Ubuntu ISOs (Desktop/Server) either interactively (prompts) or via flags.

## Requirements
- Node.js >= 18

## Install (dev)
```bash
npm install
```

## Usage
- Interactive (in-repo):
```bash
npm start
```

- Flags only (non-interactive, in-repo):
```bash
node bin/ubiforge.js \
  --non-interactive \
  --flavor desktop \
  --release 24.04 \
  --arch amd64 \
  --download \
  --output build/ubiforge \
  --with-packages curl,wget,git
```

To use as a global command during development:
```bash
npm link
ubiforge --help
```

### Available flags
- `--non-interactive` Run without prompts (requires minimum flags).
- `--flavor <desktop|server>` Base edition.
- `--release <24.04|22.04>` Ubuntu version (LTS recommended).
- `--arch <amd64|arm64>` Target architecture.
- `--output <dir>` Output directory for artifacts.
- `--download` Download the official ISO as the base.
- `--source-iso <path>` Use a local ISO as the base.
- `--with-packages <a,b,c>` Additional packages to include.
- `--debug` Verbose logs.

Note: This is an initial skeleton. The actual ISO build steps (mounting, injecting packages/customizations, repackaging) will be added next.
