const { readFileSync, writeFileSync } = require('fs');

/**
 * Function to get the Nightly version of the package, similar to the one used in React Native.
 * Version will look as follows:
 * `0.75.0-nightly-20241010-abcd1234`
 */
function getNightlyVersion(originalVersion) {
  const version = originalVersion.split('-')[0];
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  // Get the sha fromt he current commit on github actions
  const sha = process.env.GITHUB_SHA.slice(0, 7);
  return `${version}-nightly-${year}${month}${day}-${sha}`;
}

if (!process.argv[2]) {
  console.error('Please provide a version to update the template to.');
  process.exit(1);
}
const targetVersion = process.argv[2];

// We first update version of the template we're about to publish.
const packageJsonData = readFileSync('package.json', 'utf8');
const packageJson = JSON.parse(packageJsonData);
if (targetVersion === 'nightly') {
  packageJson.version = getNightlyVersion(packageJson.version);
} else {
  packageJson.version = targetVersion;
}
const updatedPackageJsonData = JSON.stringify(packageJson, null, 2);
writeFileSync('package.json', updatedPackageJsonData, 'utf8');
console.log(`Template version updated to ${packageJson.version}`);
