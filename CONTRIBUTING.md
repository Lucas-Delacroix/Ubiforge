# Contributing to Ubiforge

Thank you for your interest in contributing! This document explains how to set up your environment, the project structure, conventions, and a high‑level overview of the main modules and functions, so you can be productive quickly.

## Prerequisites
- Node.js >= 18
- Git
- A Linux environment is recommended (for future ISO building steps).

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the CLI (interactive):
   ```bash
   npm start
   ```
3. Run with flags (non‑interactive):
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
4. Optional: link globally during development:
   ```bash
   npm link
   ubiforge --help
   ```

## Project structure
```
.
├─ bin/
│  └─ ubiforge.js            # Node entrypoint (bin)
├─ src/
│  ├─ cli.js                 # CLI flags parsing (commander) and orchestration
│  ├─ index.js               # Execution plan (placeholder for build pipeline)
│  ├─ ui/
│  │  └─ interactive.js      # Interactive prompts flow (single ask call)
│  ├─ domain/
│  │  └─ ubuntu.js           # Domain constants (flavors, releases, arches)
│  ├─ utils/
│  │  ├─ parse.js            # Parsing helpers (e.g., comma list)
│  │  ├─ prompts.js          # ask() wrapper + PromptCancelledError
│  │  └─ validation.js       # Input validation helpers (flags and prompts)
│  ├─ config/
│  │  └─ defaults.js         # Centralized defaults (e.g., output dir)
│  └─ types/
│     └─ config.d.ts         # Type definitions for config (TS/JSDoc consumers)
├─ package.json
├─ README.md
└─ LICENSE
```

## Development workflow
- Small, focused changes; keep modules cohesive and functions small.
- Prefer pure functions; push I/O and side effects to the edges (CLI or task executors).
- Avoid `process.exit()` in inner modules — throw errors (or specific error types) and let the CLI decide exit codes.
- Keep user interaction centralized via `utils/prompts.ask`.
- Keep parsing/validation centralized in `utils`.
- When adding features, update README and this guide if behavior or workflow changes.

## Code style and conventions
- Naming: explicit, descriptive names (`interactiveFlow`, `finalizeConfig`).
- Modules by responsibility: `ui/`, `utils/`, `domain/`, `config/`, `types/`.
- Errors: use specific error types (e.g., `PromptCancelledError`), throw early, handle at the CLI boundary.
- Logging: use `console.*` sparingly; honor `--debug` (future plumbing). Avoid noisy logs in `domain/` and `utils/`.
- Data‑driven prompts: define questions declaratively; use conditional `type` to skip irrelevant questions.

## Functions and modules (high‑level overview)

- bin/ubiforge.js
  - Purpose: Executable entrypoint declared in `package.json#bin`. Loads and runs the CLI. Catches unexpected startup errors and exits non‑zero.

- src/cli.js
  - `run()`: Main CLI orchestration. Declares flags (commander), parses options, decides between interactive and flags‑only mode, validates inputs, and invokes `executePlan`.
  - `normalizeOptions(opts)`: Normalizes raw commander options into a coherent config object (lowercases, trims, maps source selection, parses comma lists via `coerceCommaList`).
  - `hasMinimumFlags(config)`: Ensures required fields are present in non‑interactive mode.
  - Integration points:
    - `interactiveFlow(config)`: Runs the interactive UI (wrapped in try/catch for cancellations).
    - `validateFlagValues(config)`: Validates `flavor`, `release`, `arch` against the supported domain values.
    - `executePlan(config)`: Kicks off the build pipeline (currently a placeholder).

- src/ui/interactive.js
  - `buildQuestions(seed)`: Returns a declarative array of prompts. Conditionally omits questions based on prefilled `seed` values. Uses domain choices via `toPromptChoices`.
  - `finalizeConfig(seed, answers)`: Merges seed and answers into the final config, normalizing fields and parsing packages via `coerceCommaList`.
  - `confirmConfig(config)`: Asks for a final confirmation. Throws `PromptCancelledError` if declined.
  - `interactiveFlow(seed)`: Orchestrates the interactive sequence: ask questions, build config, confirm, and return.

- src/index.js
  - `executePlan(config)`: Placeholder for the execution pipeline. Currently prints the resolved configuration and outlines next steps (system checks, base ISO acquisition, working tree, customizations, repackaging). Intended to be split into task modules as the project evolves.

- src/domain/ubuntu.js
  - `SUPPORTED_FLAVORS`, `SUPPORTED_RELEASES`, `SUPPORTED_ARCHES`: Single source of truth for Ubuntu flavors, releases, and architectures.
  - `toPromptChoices(list)`: Maps domain lists to `prompts` choice format.

- src/utils/prompts.js
  - `ask(questions)`: Wrapper around `prompts` with a shared `onCancel` that throws `PromptCancelledError` instead of exiting.
  - `PromptCancelledError`: Specific error to represent user cancellation in interactive flows.

- src/utils/parse.js
  - `coerceCommaList(value)`: Parses comma‑separated input into a trimmed string array.

- src/utils/validation.js
  - `validateNonEmpty(message)`: Prompt validation helper (non‑empty check with message).
  - `validateFlagValues(config)`: Validates `flavor`, `release`, and `arch` against the supported domain sets and returns a list of human‑readable error messages.

- src/config/defaults.js
  - `defaultOutputDir`: Default build output directory used by the UI.

- src/types/config.d.ts
  - `UbiforgeSource`, `UbiforgeConfig`: Types for the CLI and pipeline configuration. Helpful for editors and future TS migration.

## Adding a new feature
- New flag
  - Add the option in `src/cli.js` (commander).
  - Update `normalizeOptions` to parse/normalize the value.
  - Validate in `validateFlagValues` if applicable (or create a similar validator).
  - Consider reflecting it in the interactive flow (`buildQuestions` and `finalizeConfig`).
  - Update README and this guide.

- New interactive question
  - Extend `buildQuestions` with a declarative prompt. Prefer conditional `type` functions to skip when prefilled.
  - Update `finalizeConfig` to include the new answer in the returned config.

- New supported Ubuntu item
  - Update constants in `src/domain/ubuntu.js`.
  - No changes needed elsewhere if validations and UI use these lists (they do).

- Execution pipeline (future)
  - Suggestion: organize as task modules under `src/tasks/`:
    - `syscheck.js`: host tool checks (xorriso, squashfs-tools, genisoimage, 7z, etc.).
    - `source.js`: download/verify checksums or accept local ISO, extract metadata.
    - `workspace.js`: prepare temp directories, mount/unsquash, chroot/container handling.
    - `customize.js`: inject packages, files, preseed/autoinstall configs.
    - `repack.js`: rebuild ISO with proper bootloaders and metadata.
  - Orchestrate tasks from `executePlan`, returning a concise summary and artifacts.

## Testing
- There are no automated tests yet. Suggestions:
  - For utilities (`utils/*`), add unit tests (e.g., Node’s test runner or Jest).
  - For CLI parsing, write focused tests on `normalizeOptions` and `validateFlagValues`.
  - For interactive UI, unit test `finalizeConfig` and question builders; keep `ask` thin.

## Commit and PR guidelines
- Keep commits scoped and descriptive. Reference modules touched and the intent (e.g., “ui: data‑driven prompts; utils: add `coerceCommaList`”).
- Prefer small PRs with clear scope.
- Include before/after notes or examples when changing CLI flags or behavior.

## License
- This project is licensed under Apache‑2.0 (see `LICENSE`).

---
If you have questions or want help scoping a contribution, open an issue or start a draft PR to discuss the approach.

