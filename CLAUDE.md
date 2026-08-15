# CLAUDE.md

Guidance for AI agents (and humans) working in this repository. This is the
canonical onboarding doc — `AGENTS.md`, `README.md`, and `CONTRIBUTING.md` point here.

## What this is

`react-native-restart` is a React Native native module that reloads the running JS
bundle at runtime (a programmatic "restart the app"). It is published to npm as
[`react-native-restart`](https://www.npmjs.com/package/react-native-restart).

It is a **thin JS bridge over three native implementations** (iOS, Android, Windows).
There is almost no JS logic — the JS layer just forwards calls to a native module named
`RNRestart` that exists on each platform.

Public API (see `src/index.tsx`):

| Method | Notes |
| --- | --- |
| `RNRestart.restart(reason?)` | Reload the JS bundle. Preferred entry point. |
| `RNRestart.Restart(reason?)` | **Deprecated** — kept for backward compatibility; identical behavior. |
| `RNRestart.getReason()` | `Promise<string>` — returns the last reason passed to a restart. |

## Architecture

Four layers that must stay in sync:

```
JS bridge        src/index.tsx        ← NativeModules.RNRestart, default export RNRestart
   │
   ├─ iOS        ios/Restart.m|.h      ← RCTTriggerReloadCommandListeners (main thread)
   ├─ Android    android/src/main/java/com/reactnativerestart/
   │                 RestartModule.java       (ReactContextBaseJavaModule, name "RNRestart")
   │                 RestartPackage.java       (ReactPackage registration)
   │                 ReactInstanceHolder.java  (optional instance-manager holder interface)
   └─ Windows    windows/ReactNativeRestart/  (C++ / C++/WinRT)
```

- **iOS**: `Restart`/`restart` store the reason, hop to the main thread, and call
  `RCTTriggerReloadCommandListeners(...)` to reload the bundle.
- **Android**: `RestartModule` calls `instanceManager.recreateReactContextInBackground()`,
  falling back to `Activity.recreate()` (`loadBundleLegacy`) if that fails. Uses the
  `com.jakewharton:process-phoenix` dependency (see `android/build.gradle`).
- **Windows**: mirrors the same `RNRestart` module surface in C++.

> **Key rule:** changing the public API means editing the JS type in `src/index.tsx`
> **and every native platform in lockstep** (iOS, Android, Windows). The native module
> name is `RNRestart` everywhere — don't rename it on one platform only.

## Repository map

| Path | What it is |
| --- | --- |
| `src/index.tsx` | The entire JS/TS surface. `RestartType` + default export. |
| `src/__tests__/index.test.tsx` | Jest unit test for the JS API. |
| `src/__mocks__/react-native-restart.tsx` | Jest manual mock consumers use in their tests. |
| `ios/` | iOS native module (`Restart.m`, `Restart.h`) + Xcode project. |
| `android/` | Android library module (`build.gradle`, Java sources under `src/main/java/...`). |
| `windows/` | Windows (RNW) native module. |
| `Example/` | Standalone RN app that consumes the library; has its own package.json/tests. |
| `react-native-restart.podspec` | CocoaPods spec (reads version from `package.json`). |
| `badges/` | Auto-generated coverage badges (`yarn test` output — do not hand-edit). |
| `lib/` | **Build output** from `react-native-builder-bob` — do not hand-edit. |
| `.github/workflows/` | CI (`ci.yml`), PR checks (`pull_request.yml`), release (`publish.yml`). |

## Common commands

Run from the repo root (yarn is the project's package manager; `npm run <script>` also works):

| Command | What it does |
| --- | --- |
| `yarn test` | Jest with coverage, then regenerates coverage badges. |
| `yarn typescript` | Type-check with `tsc --noEmit`. |
| `yarn lint` | ESLint over `.js/.ts/.tsx`. |
| `yarn bootstrap` | Install deps for root + `Example/`, run pods, copy `.env`. |
| `yarn example <cmd>` | Run a script inside the `Example/` app (e.g. `yarn example start`). |
| `bob build` (`yarn prepare` / `prepack`) | Compile `src/` → `lib/` (commonjs, module, typescript). |

Run `yarn typescript && yarn lint && yarn test` before committing — the same checks CI runs.
(`yarn` and `npm run` are interchangeable here; the checks above only need Node + `npm ci`.)

## Local environment setup (macOS)

The JS checks only need Node. To run the **full native build matrix** (what CI's
`build-android` / `build-ios` jobs do) you also need Java, the Android SDK, Xcode,
and CocoaPods. One-time setup with Homebrew:

```bash
# JS/native tooling
brew install openjdk@17 cocoapods watchman
brew install --cask android-commandlinetools    # SDK root: /opt/homebrew/share/android-commandlinetools

# Persist the toolchain env (also appended to ~/.zshrc by setup)
export JAVA_HOME="/opt/homebrew/opt/openjdk@17"
export ANDROID_HOME="/opt/homebrew/share/android-commandlinetools"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"

# Accept licenses + install the SDK packages the RN 0.85 build needs
yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-36" "build-tools;36.0.0" "cmake;3.22.1"
# NDK 27.1.x is pulled in automatically by the Android Gradle Plugin on first build.
```

- **iOS** additionally needs **Xcode** (from the App Store) — it cannot be installed via Homebrew.
- **Windows** (`windows/`) can only be built on Windows with Visual Studio + the RNW
  toolchain; there is no way to build it on macOS/Linux.

### Running the full builds

```bash
# JS (root)
npm ci && npm run typescript && npm run lint && npm test

# Android (New Architecture is enabled in the Example app)
cd Example && npm ci
cd android && echo "sdk.dir=$ANDROID_HOME" > local.properties
./gradlew assembleDebug            # first run downloads Gradle 9.3.1 + RN artifacts (~15 min)

# iOS
cd Example/ios && pod install
xcodebuild -workspace HelloWorld.xcworkspace -scheme HelloWorld \
  -configuration Debug -sdk iphonesimulator
```

> **`Example/node_modules/react-native-restart` is a symlink to the repo root.** Native
> builds therefore compile the library source of whatever branch is currently checked
> out — do **not** switch branches while a build is running, or you'll compile a mix.

## Build & publish

- **Build**: `react-native-builder-bob` compiles `src/` → `lib/` in three targets:
  `commonjs`, `module`, `typescript`. `package.json` `main`/`module`/`types` point into
  `lib/`, while the `react-native` field points at `src/index.tsx` (Metro reads source).
- **Packaged files**: controlled by the `files` allowlist in `package.json` (`src`, `lib`,
  `android`, `ios`, `windows`, podspec — with build/workspace subdirs excluded).
- **Publish**: automated via `.github/workflows/publish.yml` using npm trusted publishing
  (`publishConfig.provenance: true`) and `release-it` with conventional-changelog.

## Conventions

- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/), enforced by
  commitlint via husky (`.husky/commit-msg`). Types: `feat`, `fix`, `refactor`, `docs`,
  `test`, `chore`, `perf`, `ci`, plus `BREAKING CHANGE`.
- **Pre-commit** (`.husky/pre-commit`): runs lint + tests before a commit lands.
- **Formatting**: Prettier — single quotes, 2-space indent, ES5 trailing commas, no tabs.

## Compatibility matrix

Match the installed package version to your React Native version (from `README.md`):

| React Native | Package version |
| --- | --- |
| `< 0.62` | `0.0.17` |
| `0.62` – `< 0.71` | `0.0.24` |
| `0.72` – `0.84` | `0.0.28` |
| `>= 0.85` | `0.0.28` and above |

## Gotchas when contributing

- **Sync all platforms.** Any public-API change must land in `src/index.tsx` **and** iOS,
  Android, and Windows native code together.
- **Never hand-edit `lib/` or `badges/`.** Both are generated (`bob build` / `yarn test`).
- **Android SDK versions differ by file.** `android/build.gradle` defaults to
  `compile/target 36`, `min 24`, while `android/gradle.properties` still lists
  `33/21/33`. The `build.gradle` `safeExtGet(...) ?: <default>` values are what apply
  when the library is consumed. Don't "fix" one to match the other without confirming intent.
- **Run the checks.** `yarn typescript && yarn lint && yarn test` locally before pushing.
- **Test in `Example/`.** For behavior changes, verify in the example app before opening a PR.
