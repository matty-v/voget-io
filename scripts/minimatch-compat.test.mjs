import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const estreeRequire = createRequire(require.resolve('@typescript-eslint/typescript-estree'));
const { minimatch } = estreeRequire('minimatch');

// The override crosses the parent's declared major range. Exercise the actual
// CommonJS dependency that the parser loads, including its dot:true option.
test('the TypeScript parser resolves patched minimatch with compatible path matching', () => {
  const version = JSON.parse(readFileSync(estreeRequire.resolve('minimatch/package.json'), 'utf8')).version;
  assert.equal(version, '11.0.4');
  for (const [path, pattern, expected] of [
    ['config.ts', '*.ts', true],
    ['.config.ts', '*.ts', true],
    ['config.js', '*.ts', false],
    ['src/config.ts', '*.ts', false],
    ['src/config.ts', 'src/*.ts', true],
    ['src/.config.ts', 'src/*.ts', true],
    ['src/deep/config.ts', 'src/*.ts', false],
    ['src/config.ts', 'src/*.{ts,tsx}', true],
    ['src/view.tsx', 'src/*.{ts,tsx}', true],
    ['src/config.js', 'src/*.{ts,tsx}', false],
    ['config.ts', 'config.?s', true],
    ['config.ts', 'config.[jt]s', true],
  ]) {
    assert.equal(minimatch(path, pattern, { dot: true }), expected, `${path} / ${pattern}`);
  }
});

test('actual parser project-service allowDefaultProject accepts matches and rejects other paths', () => {
  const parser = require('@typescript-eslint/parser');
  const root = mkdtempSync(join(tmpdir(), 'voget-parser-compat-'));
  try {
    const source = 'const value: number = 1;\n';
    for (const filename of ['config.ts', '.config.ts', 'other.ts']) {
      writeFileSync(join(root, filename), source);
    }
    const options = {
      tsconfigRootDir: root,
      projectService: { allowDefaultProject: ['config.ts', '.config.ts'] },
    };
    for (const filename of ['config.ts', '.config.ts']) {
      const result = parser.parseForESLint(source, { ...options, filePath: join(root, filename) });
      assert.ok(result.services.program, filename);
      assert.equal(result.ast.body[0].type, 'VariableDeclaration');
    }
    assert.throws(
      () => parser.parseForESLint(source, { ...options, filePath: join(root, 'other.ts') }),
      /not found by the project service/,
    );
  } finally {
    parser.clearCaches();
    rmSync(root, { recursive: true, force: true });
  }
});
