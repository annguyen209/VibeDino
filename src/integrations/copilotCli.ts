import { writeFileSync, existsSync, mkdirSync, readFileSync, unlinkSync, rmdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const PLUGIN_DIR = join(homedir(), '.copilot', 'plugins', 'vibedino');
const MANIFEST_PATH = join(PLUGIN_DIR, 'plugin.json');

export function generateCopilotPluginManifest() {
  return {
    name: 'vibedino',
    version: '0.1.0',
    description: 'Play dino runner when rate limited',
    hooks: {
      onError: {
        match: ['rate_limit', 'token_exhausted', '429'],
        action: 'exec',
        command: 'npx vibedino --trigger copilot --reason "Rate limited"',
      },
    },
  };
}

export function installCopilotPlugin(): void {
  if (!existsSync(PLUGIN_DIR)) {
    mkdirSync(PLUGIN_DIR, { recursive: true });
  }

  const manifest = generateCopilotPluginManifest();
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`  Installed VibeDino Copilot plugin at ${MANIFEST_PATH}`);
}

export function uninstallCopilotPlugin(): void {
  if (!existsSync(MANIFEST_PATH)) {
    console.log('  No VibeDino Copilot plugin found.');
    return;
  }

  unlinkSync(MANIFEST_PATH);
  try {
    rmdirSync(PLUGIN_DIR);
  } catch {
    // Directory not empty or other issue, that's fine
  }
  console.log('  Removed VibeDino Copilot plugin.');
}
