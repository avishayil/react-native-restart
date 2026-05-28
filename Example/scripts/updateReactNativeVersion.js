const fs = require('fs');

function updateDependencies(pkgJson, update) {
  console.log('Changing package.json dependencies:');

  for (const [pkg, value] of Object.entries(update.dependencies ?? {})) {
    const old = pkgJson.dependencies[pkg];
    if (old) {
      console.log(` - ${pkg}: ${old} → ${value}`);
    } else {
      console.log(` - ${pkg}: ${value}`);
    }
    pkgJson.dependencies[pkg] = value;
  }

  for (const [pkg, value] of Object.entries(update.devDependencies ?? {})) {
    const old = pkgJson.devDependencies[pkg];
    if (old) {
      console.log(` - ${pkg}: ${old} → ${value}`);
    } else {
      console.log(` - ${pkg}: ${value}`);
    }
    pkgJson.devDependencies[pkg] = value;
  }

  return pkgJson;
}

const REACT_NATIVE_SCOPE = '@react-native/';

/**
 * Packages that are scoped under @react-native need a consistent version
 */
function normalizeReactNativeDeps(deps, version) {
  const updated = {};
  for (const key of Object.keys(deps ?? {}).filter(pkg =>
    pkg.startsWith(REACT_NATIVE_SCOPE),
  )) {
    updated[key] = version;
  }
  return updated;
}

async function main(version) {
  const PKG_JSON_PATH = 'template/package.json';
  // Update the react-native dependency if using the new @react-native-community/template.
  // We can figure this out as it ships with react-native@1000.0.0 set to a dummy version.
  let pkgJson = JSON.parse(fs.readFileSync(PKG_JSON_PATH, 'utf8'));

  pkgJson = updateDependencies(pkgJson, {
    dependencies: {
      'react-native': version,
      ...normalizeReactNativeDeps(pkgJson.dependencies, version),
    },
    devDependencies: {
      ...normalizeReactNativeDeps(pkgJson.devDependencies, version),
    },
  });

  let updated = JSON.stringify(pkgJson, null, 2);
  console.log(
    `\nWriting update template/package.json to ${PKG_JSON_PATH}:\n\n${updated}`,
  );
  fs.writeFileSync(PKG_JSON_PATH, updated);

  // 2. Update the scripts.version field in the top level package.json. This lets us leverage
  //    the https://registry.npmjs.org/@react-native-community/template API:
  //
  //  "name": "@react-native-community/template",
  //  "dist-tags": {
  //    ...
  //    "0.75-stable": "0.75.0-rc.0"
  //  },
  //  "versions": {
  //    "0.75.0-rc.0": {
  //      "name": "@react-native-community/template",
  //      "version": "0.75.0-rc.0",
  //      "scripts": {
  //        "version": "0.75.1"
  //        ...
  //      },
  //
  //  We can then correlate earlier version of react-native with earlier template. Significantly
  //  none of this is 'user facing'.
  const PKG_JSON_ROOT_PATH = './package.json';
  pkgJson = JSON.parse(fs.readFileSync(PKG_JSON_ROOT_PATH, 'utf8'));
  pkgJson.scripts ??= {};
  pkgJson.scripts.version = version;
  updated = JSON.stringify(pkgJson, null, 2);
  console.log(
    `\nWriting update package.json to ${PKG_JSON_ROOT_PATH}:\n\n${updated}`,
  );
  fs.writeFileSync(PKG_JSON_ROOT_PATH, updated);
}

if (require.main === module) {
  if (process.argv.length < 3) {
    console.log(`USAGE: updateReactNativeVersion.js <version>

Updates 'react-native' and '@react-native/' scoped packages to a common version within
the template.
`);
    process.exit(1);
  }
  main(process.argv.pop()).catch(e => {
    throw e;
  });
}
