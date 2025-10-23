#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

type Replacement = { from: RegExp; to: string };

function isTextFile(filePath: string): boolean {
  const textExtensions = [
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.json',
    '.md',
    '.css',
    '.html',
    '.txt',
    '.yml',
    '.yaml',
    '.svg',
  ];
  const ext = path.extname(filePath).toLowerCase();
  return textExtensions.includes(ext);
}

function buildDefaultReplacements(newName: string): Replacement[] {
  const safe = (s: string) => s.replace(/[$()*+.?[\\\]^{|}-]/g, r => `\\${r}`);
  const defaults: Array<[string, string]> = [
    ['Contractor Bud', newName],
    ['Contractor Buddy', newName],
    ['CBud', newName],
    ['cbud', newName],
    ['MoMegaTemplate PWA', newName],
    ['MoMegaTemplate', newName],
    ['MoMega', newName],
    ['Template PWA', newName],
  ];
  return defaults.map(([from, to]) => ({ from: new RegExp(safe(from), 'g'), to }));
}

function parseArgs(argv: string[]) {
  const args = argv.slice(2);
  const pairs: Array<{ from: string; to: string }> = [];
  let presetName = '';
  let rootDir = process.cwd();
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--from' && i + 1 < args.length) {
      const from = args[++i];
      if (args[i + 1] === '--to' && i + 2 < args.length) {
        const to = args[i + 2];
        i += 2;
        pairs.push({ from, to });
      } else {
        throw new Error('--from must be followed by --to <value>');
      }
    } else if (a === '--preset' && i + 1 < args.length) {
      presetName = args[++i];
    } else if ((a === '-C' || a === '--cwd') && i + 1 < args.length) {
      rootDir = path.resolve(args[++i]);
    } else if (a === '--dry-run') {
      dryRun = true;
    } else if (a === '--help' || a === '-h') {
      printHelpAndExit();
    }
  }

  return { pairs, presetName, rootDir, dryRun };
}

function presetToReplacements(preset: string): Replacement[] {
  if (!preset) return [];
  // For now only one preset: replace CBud/MoMega template branding with provided name
  // Use environment variable BRAND_NAME or fallback to "Your App"
  const brandName = process.env.BRAND_NAME || 'Your App';
  return buildDefaultReplacements(brandName);
}

function pairsToReplacements(pairs: Array<{ from: string; to: string }>): Replacement[] {
  const escape = (s: string) => s.replace(/[$()*+.?[\\\]^{|}-]/g, r => `\\${r}`);
  return pairs.map(p => ({ from: new RegExp(escape(p.from), 'g'), to: p.to }));
}

function collectFiles(dir: string, ignoreDirs: string[]): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (ignoreDirs.includes(entry.name)) continue;
      files.push(...collectFiles(full, ignoreDirs));
    } else if (entry.isFile()) {
      if (isTextFile(full)) files.push(full);
    }
  }
  return files;
}

function applyReplacementsToContent(content: string, replacements: Replacement[]) {
  let result = content;
  for (const r of replacements) {
    result = result.replace(r.from, r.to);
  }
  return result;
}

function printHelpAndExit(code = 0): never {
  const help = `\nUsage: brand [--preset default --env BRAND_NAME="New Name"] [--from A --to B ...] [--cwd path] [--dry-run]\n\nExamples:\n  BRAND_NAME="Acme Suite" pnpm brand --preset default\n  pnpm brand --from "Contractor Bud" --to "Acme Suite" --from CBud --to Acme\n\nNotes:\n  - When using --preset, provide BRAND_NAME env var (fallback: "Your App").\n  - Non-text and large bundles in node_modules, .git, .next, dist, build are skipped.\n`;
  // eslint-disable-next-line no-console
  console.log(help);
  // eslint-disable-next-line no-process-exit
  process.exit(code);
}

async function main() {
  const { pairs, presetName, rootDir, dryRun } = parseArgs(process.argv);
  if (!pairs.length && !presetName) {
    printHelpAndExit(1);
  }

  const ignore = ['node_modules', '.git', '.next', 'dist', 'build', 'test-results'];

  const files = collectFiles(rootDir, ignore);
  const replacements: Replacement[] = [
    ...presetToReplacements(presetName),
    ...pairsToReplacements(pairs),
  ];

  let changedCount = 0;
  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    const updated = applyReplacementsToContent(original, replacements);
    if (updated !== original) {
      changedCount++;
      if (!dryRun) {
        fs.writeFileSync(file, updated, 'utf8');
      }
      // eslint-disable-next-line no-console
      console.log(`${dryRun ? '[dry]' : '[write]'} ${path.relative(rootDir, file)}`);
    }
  }

  // eslint-disable-next-line no-console
  console.log(`Done. Modified files: ${changedCount}${dryRun ? ' (dry-run)' : ''}`);
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});


