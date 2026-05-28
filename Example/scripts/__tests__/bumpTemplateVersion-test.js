const { execSync, exec: _exec } = require('child_process');
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const semver = require('semver');

function run(version) {
  return execSync(`./bumpedTemplateVersion.sh ${version}`, {
    cwd: 'scripts',
    stdio: ['ignore', 'pipe', 'ignore'],
  })
    .toString()
    .trim();
}

const FIFO_PATH = '/tmp/_npm_fifo';

const exec = promisify(_exec);
const writeFile = promisify(fs.writeFile);

async function runStubbedNpm(version, response) {
  cleanUpStubbedNpm();
  execSync(`mkfifo ${FIFO_PATH}`);
  return Promise.all([
    writeFile(FIFO_PATH, JSON.stringify(response)),
    exec(`./bumpedTemplateVersion.sh ${version}`, {
      cwd: 'scripts',
      stdio: ['ignore', 'pipe', 'ignore'],
      env: {
        PATH: `${__dirname}/stub:${process.env.PATH}`,
        NPM_STUB_FIFO: FIFO_PATH,
      },
    }).then(raw => raw.stdout.toString().trim()),
  ]).then(([, resp]) => resp);
}

function cleanUpStubbedNpm() {
  try {
    fs.unlinkSync(FIFO_PATH);
  } catch {
    // Best attempt is OK.
  }
}

describe('bumpTemplateVersion.sh', () => {
  it('nightlies stay the same', () => {
    expect(run('0.75.0-nightly-20240606-4324f0874')).toEqual(
      '0.75.0-nightly-20240606-4324f0874',
    );
  });

  it('release candidates appended with a sha', () => {
    expect(run('0.74.0-rc.3')).toMatch(/0\.74\.0-rc\.3-.+/);
  });

  it('assumed it is the first version when no matching MAJOR.MINOR', () => {
    const versionShouldNeverExist = '1111.0.1';
    expect(run(versionShouldNeverExist)).toEqual('1111.0.0');
  });

  it('bumps the patch if a version of the template already exists', async () => {
    // This sucks I know:
    const { version } = await fetch(
      'https://registry.npmjs.com/@react-native-community/template/latest',
    ).then(resp => resp.json());
    const { major, minor, patch } = semver.parse(version);
    expect(run(`${major}.${minor}.${patch}`)).toEqual(
      `${major}.${minor}.${patch + 1}`,
    );
  });

  describe('handles different npm responses', () => {
    afterAll(cleanUpStubbedNpm);
    it('arrays of versions', async () => {
      expect(
        await runStubbedNpm('0.76.0', [
          { version: '0.76.0' },
          { version: '0.76.2' },
          // Expecting +1 on this:
          { version: '0.76.3' },
        ]),
      ).toEqual('0.76.4');
    });

    it('single version', async () => {
      expect(await runStubbedNpm('0.76.0', { version: '0.76.0' })).toEqual(
        '0.76.1',
      );
    });
  });
});
