/**
 * CLI argument-validation tests for scripts/cleanup-orphans.mjs.
 *
 * Guardrail: a malformed invocation (missing --team-name value, or an unknown
 * flag) must exit 1 with a usage hint BEFORE any process scan runs. It must
 * never silently degrade into a scan-all with exit 0 — this is a destructive
 * CLI that kills processes, so silent scope-widening is the worst failure mode.
 *
 * Every spawn below includes --dry-run wherever a process scan could run, so
 * no test can ever kill a process (the invalid-arg paths reject before the
 * scan anyway; --dry-run is belt-and-braces for the valid control case).
 */

import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');
const SCRIPT_PATH = join(REPO_ROOT, 'scripts', 'cleanup-orphans.mjs');

interface RunResult {
  status: number | null;
  stdout: string;
  stderr: string;
}

function runCleanup(args: string[]): RunResult {
  const result = spawnSync(process.execPath, [SCRIPT_PATH, ...args], {
    cwd: REPO_ROOT,
    encoding: 'utf-8',
    timeout: 15000,
  });
  return {
    status: result.status,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

// A process scan emits a JSON result line on stdout (e.g.
// '{"cleaned":0,...}' or 'Found N stale worker(s)...'). Its absence proves
// the scan never ran (validation exited before findOrphanProcesses()).
function expectScanNeverRan(result: RunResult): void {
  expect(result.stdout).not.toContain('"cleaned"');
  expect(result.stdout).not.toContain('Found');
  expect(result.stdout).not.toContain('stale worker');
}

describe('scripts/cleanup-orphans.mjs — CLI argument validation (no silent scan-all)', () => {
  it('rejects --team-name with no value (exit 1, scan never runs)', () => {
    const result = runCleanup(['--team-name']);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('--team-name requires a value');
    expect(result.stderr).toContain('Usage:');
    expectScanNeverRan(result);
  });

  it('rejects --team-name followed by --dry-run (exit 1, scan never runs)', () => {
    const result = runCleanup(['--team-name', '--dry-run']);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('--team-name requires a value');
    expect(result.stderr).toContain('Usage:');
    expect(result.stderr).not.toContain('Invalid team name');
    expectScanNeverRan(result);
  });

  it('rejects an unknown flag (exit 1, scan never runs)', () => {
    const result = runCleanup(['--unknown', '--dry-run']);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Unknown argument');
    expect(result.stderr).toContain('--unknown');
    expect(result.stderr).toContain('Usage:');
    expectScanNeverRan(result);
  });

  it('rejects an unknown short flag / positional junk (exit 1, scan never runs)', () => {
    const unknownFlag = runCleanup(['--bogus-flag', '--dry-run']);
    expect(unknownFlag.status).toBe(1);
    expect(unknownFlag.stderr).toContain('Unknown argument');
    expect(unknownFlag.stderr).toContain('--bogus-flag');
    expectScanNeverRan(unknownFlag);

    const shortFlag = runCleanup(['-x', '--dry-run']);
    expect(shortFlag.status).toBe(1);
    expect(shortFlag.stderr).toContain('Unknown argument');
    expectScanNeverRan(shortFlag);

    const positional = runCleanup(['junk', '--dry-run']);
    expect(positional.status).toBe(1);
    expect(positional.stderr).toContain('Unknown argument');
    expect(positional.stderr).toContain('junk');
    expectScanNeverRan(positional);
  });

  it('rejects empty --team-name value (exit 1, scan never runs)', () => {
    const result = runCleanup(['--team-name', '', '--dry-run']);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('--team-name requires a value');
    expect(result.stderr).toContain('Usage:');
    expectScanNeverRan(result);
  });

  it('rejects whitespace-only --team-name value (exit 1, scan never runs)', () => {
    const result = runCleanup(['--team-name', '   ', '--dry-run']);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('--team-name requires a value');
    expect(result.stderr).toContain('Usage:');
    expectScanNeverRan(result);
  });

  it('rejects duplicate --team-name flags (exit 1, scan never runs)', () => {
    const laterValid = runCleanup(['--team-name', 'team-a', '--team-name', 'team-b', '--dry-run']);
    expect(laterValid.status).toBe(1);
    expect(laterValid.stderr).toContain('Duplicate --team-name');
    expect(laterValid.stderr).toContain('Usage:');
    expectScanNeverRan(laterValid);

    const laterEmpty = runCleanup(['--team-name', 'team-a', '--team-name', '', '--dry-run']);
    expect(laterEmpty.status).toBe(1);
    expect(laterEmpty.stderr).toContain('Duplicate --team-name');
    expect(laterEmpty.stderr).toContain('Usage:');
    expectScanNeverRan(laterEmpty);

    const laterFlagLike = runCleanup(['--team-name', 'team-a', '--team-name', '--dry-run']);
    expect(laterFlagLike.status).toBe(1);
    expect(laterFlagLike.stderr).toContain('Duplicate --team-name');
    expect(laterFlagLike.stderr).toContain('Usage:');
    expectScanNeverRan(laterFlagLike);
  });

  it('accepts a valid --dry-run invocation (exit 0)', () => {
    const result = runCleanup(['--dry-run']);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('"cleaned"');
  });

  it('accepts a valid --team-name/--dry-run combination (exit 0)', () => {
    const result = runCleanup(['--team-name', 'team-a', '--dry-run']);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('"cleaned"');
  });
});
