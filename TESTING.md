# Testing

`react-native-restart` is tested at four layers. Every layer exercises the **full restart
(refresh) scenario** — set a reason → restart → read the reason back — so the behavior is
verified on the JS bridge and on each native platform, not just in isolation.

## What runs where

| Layer | Location | Command | What it verifies |
| --- | --- | --- | --- |
| **JS unit** | `src/__tests__/index.test.tsx`, `src/__tests__/linking.test.tsx` | `npm test` (Jest) | `restart()`/`Restart()`/`getReason()` route through the TurboModule spec; `restart()` uses the non-deprecated native method; `reason ?? null` normalization; a clear error when the native module isn't linked. **100%** statements/lines/functions of `src/index.tsx`. |
| **Android unit** | `android/src/test/java/com/reactnativerestart/RestartModuleTest.java` | `./gradlew :react-native-restart:testDebugUnitTest` and `:testReleaseUnitTest` | Robolectric + Mockito, full refresh scenario: `restart(reason)` persists the reason to `SharedPreferences`, calls `ProcessPhoenix.triggerRebirth`, the reason is read back once on the next construction and exposed via `getReason()`; `null` clears it; the deprecated `Restart` alias; module name `RNRestart`. |
| **iOS unit** | `Example/ios/HelloWorldTests/RestartModuleTests.mm` | `xcodebuild test -workspace Example/ios/HelloWorld.xcworkspace -scheme HelloWorld -configuration Release -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPhone 17'` | XCTest, refresh scenario: `restart(reason)`/`Restart(reason)` store the reason and `getReason` resolves it; module name `RNRestart`. |
| **E2E** | `.maestro/restart.yaml` | `maestro test -e APP_ID=<id> .maestro/restart.yaml` | Drives the Example app on a real simulator/emulator: taps **Restart** (which calls `restart('maestro-e2e')`), then asserts the app reloads and displays the reason returned by `getReason()` — an actual end-to-end refresh with no crash and reason survival. |

## Running everything

```bash
# JS (root)
npm ci && npm test               # Jest + coverage (badges written to ./badges)

# Android native unit tests (from the Example app, which links the library)
cd Example && npm ci
cd android && ./gradlew :react-native-restart:testDebugUnitTest :react-native-restart:testReleaseUnitTest

# iOS native unit tests (Release — the host app needs the embedded JS bundle)
cd Example/ios && pod install
xcodebuild test -workspace HelloWorld.xcworkspace -scheme HelloWorld \
  -configuration Release -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,name=iPhone 17'

# End-to-end (Maestro) — build & install the Example app first, then:
maestro test -e APP_ID=org.reactjs.native.example.HelloWorld .maestro/restart.yaml   # iOS
maestro test -e APP_ID=com.example .maestro/restart.yaml                             # Android
```

## Notes

- **iOS unit tests run in Release.** They are hosted in the Example app, which loads the
  JavaScript bundle on launch. In Debug that bundle is served by Metro (not available in CI),
  so the host app can't boot; the **Release** configuration embeds the bundle, so the tests
  run reliably there. Android unit tests pass in both Debug and Release.
- **Coverage.** `src/index.tsx` is at 100% statements/lines/functions via Jest. The native
  modules' logic is covered by the Android (Robolectric) and iOS (XCTest) suites plus the
  Maestro end-to-end flow. `npm test` writes coverage badges to `badges/`.
- **Windows** shares the same TurboModule spec (`src/NativeRNRestart.ts`); it is validated by
  the build on CI (it cannot be built on macOS/Linux).
- CI runs the JS, Android, iOS, and Maestro suites — see `.github/workflows/`.
