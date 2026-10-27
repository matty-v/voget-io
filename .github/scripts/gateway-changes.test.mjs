import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, chmodSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const script = fileURLToPath(new URL('./gateway-changes.sh', import.meta.url));

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'gateway-routing-'));
  const env = { PATH: '/usr/bin:/bin', HOME: root, LANG: 'C.UTF-8', GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null' };
  const git = (...args) => execFileSync('git', ['-c', 'core.hooksPath=/dev/null', ...args], { cwd: root, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git('init', '-q', '-b', 'main');
  git('config', 'user.name', 'test'); git('config', 'user.email', 'test@example.invalid');
  mkdirSync(join(root, 'gateway'));
  writeFileSync(join(root, 'gateway', 'server.js'), 'one\n');
  writeFileSync(join(root, 'package-lock.json'), '{}\n');
  const commit = () => { git('add', '-A'); git('commit', '-qm', 'fixture'); return git('rev-parse', 'HEAD'); };
  const base = commit();
  const run = (before, after, event = 'push', path = env.PATH) => {
    const output = join(root, 'output'); writeFileSync(output, '');
    const result = spawnSync('bash', [script], { cwd: root, env: { ...env, PATH: path, BEFORE_SHA: before, AFTER_SHA: after, EVENT_NAME: event, GITHUB_OUTPUT: output }, encoding: 'utf8' });
    return { ...result, output: readFileSync(output, 'utf8') };
  };
  return { root, env, git, commit, base, run, close: () => rmSync(root, { recursive: true, force: true }) };
}

for (const kind of ['frontend-only', 'gateway-edit', 'gateway-delete', 'gateway-rename', 'multi-commit']) {
  test(kind, () => {
    const f = fixture();
    try {
      if (kind === 'frontend-only') writeFileSync(join(f.root, 'package-lock.json'), '{"updated":true}\n');
      if (kind === 'gateway-edit' || kind === 'multi-commit') writeFileSync(join(f.root, 'gateway', 'server.js'), 'two\n');
      if (kind === 'gateway-delete') rmSync(join(f.root, 'gateway', 'server.js'));
      if (kind === 'gateway-rename') f.git('mv', 'gateway/server.js', 'renamed.js');
      let head = f.commit();
      if (kind === 'multi-commit') { writeFileSync(join(f.root, 'package-lock.json'), '{"later":true}\n'); head = f.commit(); }
      const result = f.run(f.base, head);
      assert.equal(result.status, 0, result.stderr);
      assert.equal(result.output, `changed=${kind !== 'frontend-only'}\n`);
    } finally { f.close(); }
  });
}

test('manual deployment forces gateway and unknown events fail closed', () => {
  const f = fixture();
  try {
    assert.equal(f.run('', f.base, 'workflow_dispatch').output, 'changed=true\n');
    const result = f.run(f.base, f.base, 'other');
    assert.notEqual(result.status, 0); assert.equal(result.output, '');
  } finally { f.close(); }
});

test('invalid, zero, missing or wrong checked-out commits fail before outputs', () => {
  const f = fixture();
  try {
    writeFileSync(join(f.root, 'package-lock.json'), '{"new":true}\n'); const head = f.commit();
    for (const [before, after] of [['bad; id', head], ['0'.repeat(40), head], ['f'.repeat(40), head], [f.base, 'bad'], [f.base, f.base]]) {
      const result = f.run(before, after);
      assert.notEqual(result.status, 0); assert.equal(result.output, '');
    }
  } finally { f.close(); }
});

test('git diff errors never become unchanged', () => {
  const f = fixture();
  try {
    const bin = join(f.root, 'bin'); mkdirSync(bin);
    const git = join(bin, 'git');
    writeFileSync(git, '#!/bin/sh\nif [ "$1" = diff ]; then exit 2; fi\nexec /usr/bin/git "$@"\n'); chmodSync(git, 0o700);
    const result = f.run(f.base, f.base, 'push', `${bin}:${f.env.PATH}`);
    assert.equal(result.status, 2); assert.equal(result.output, '');
  } finally { f.close(); }
});
