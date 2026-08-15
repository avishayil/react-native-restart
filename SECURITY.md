# Security Policy

## Supported versions

Security fixes are provided for the latest published version of `react-native-restart`.
Please make sure you are on the latest release before reporting an issue.

| Version | Supported |
| ------- | --------- |
| latest (`0.0.x`) | ✅ |
| older releases   | ❌ (please upgrade) |

## Reporting a vulnerability

**Please do not open a public issue for security vulnerabilities.**

Report privately using **GitHub's private vulnerability reporting**:

1. Go to the [Security tab](https://github.com/avishayil/react-native-restart/security) of
   this repository.
2. Click **"Report a vulnerability"** and fill in the advisory form.

This opens a private advisory visible only to the maintainers, where we can discuss and fix
the issue before any public disclosure.

If private reporting is unavailable for any reason, you may instead email the maintainer at
**avishay.il@gmail.com** with the details.

Please include, where possible:

- A description of the vulnerability and its impact.
- The affected version(s) and platform(s) (iOS / Android / Windows).
- Steps to reproduce, and a minimal proof of concept if you have one.

## Response expectations

- **Acknowledgement:** within 5 business days.
- **Initial assessment:** within 10 business days.
- **Fix / mitigation:** prioritized by severity; a coordinated disclosure timeline will be
  agreed with the reporter.

We will credit reporters in the release notes / advisory unless you ask to remain anonymous.

## Scope

This library is a small native module that reloads the React Native bundle / restarts the
app. It ships only the JavaScript entry point, the TurboModule spec, and the native
iOS/Android/Windows sources (see the `files` allowlist in `package.json`).

- **In scope:** vulnerabilities in this library's own code (`src/`, `ios/`, `android/`,
  `windows/`).
- **Out of scope:** vulnerabilities in transitive dependencies of the React Native framework
  or build tooling that are **not shipped** in the published package and are not reachable
  from this library's runtime API. Those should be reported to the respective upstream
  projects (or React Native). This package declares **no runtime dependencies**, so
  Dependabot alerts on this repository concern the development/build toolchain, not the
  shipped module.
