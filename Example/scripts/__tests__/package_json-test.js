const fs = require('fs');
const { execSync } = require('child_process');

const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

const isStableBranch = /\d+\.\d+-stable$/.test(branch);

const isReactNativePackage = pkg =>
  pkg === 'react-native' || pkg.startsWith('@react-native/');

const label = isStableBranch ? 'react-native and ' : '';

describe('react-native packages on a version branch need to be aligned', () => {
  it(`has a consistent version for ${label}@react-native/ scoped packages in the template/package.json`, () => {
    const pkgJson = JSON.parse(fs.readFileSync('template/package.json'));

    const everything = Object.entries({
      ...pkgJson.dependencies,
      ...pkgJson.devDependencies,
      ...(pkgJson.peerDependencies ?? {}),
    });

    const versions = Object.fromEntries(
      everything.filter(([name]) => isReactNativePackage(name)),
    );

    if (!isStableBranch) {
      // This is the one case where "react-native" doesn't have to match
      delete versions['react-native'];
    }

    const allReactNativeVersions = new Set(Object.values(versions));

    // Only a single version
    expect(allReactNativeVersions.size).toEqual(1);
  });
});
