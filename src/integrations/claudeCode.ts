import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const HOOK_ENTRY = {
  matcher: 'rate_limit|token_limit|quota_exceeded|overloaded',
  command: 'npx vibedino --trigger claude --reason "Token limit reached"',
  timeout: 300000,
};

export function generateClaudeHookConfig() {
  return {
    hooks: {
      PostToolUseFailure: [HOOK_ENTRY],
    },
  };
}

export function installClaudeHook(projectDir: string = process.cwd()): void {
  const claudeDir = join(projectDir, '.claude');
  const settingsPath = join(claudeDir, 'settings.json');

  if (!existsSync(claudeDir)) {
    mkdirSync(claudeDir, { recursive: true });
  }

  let settings: Record<string, unknown> = {};
  if (existsSync(settingsPath)) {
    try {
      settings = JSON.parse(readFileSync(settingsPath, 'utf-8'));
    } catch {
      // Start fresh if corrupt
    }
  }

  if (!settings.hooks) {
    settings.hooks = {};
  }
  const hooks = settings.hooks as Record<string, unknown[]>;
  if (!hooks.PostToolUseFailure) {
    hooks.PostToolUseFailure = [];
  }

  // Avoid duplicates
  const existing = hooks.PostToolUseFailure as Array<{ command?: string }>;
  if (!existing.some(h => h.command?.includes('vibedino'))) {
    existing.push(HOOK_ENTRY);
  }

  writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
  console.log(`  Installed VibeDino hook in ${settingsPath}`);
}

export function uninstallClaudeHook(projectDir: string = process.cwd()): void {
  const settingsPath = join(projectDir, '.claude', 'settings.json');

  if (!existsSync(settingsPath)) {
    console.log('  No .claude/settings.json found.');
    return;
  }

  const settings = JSON.parse(readFileSync(settingsPath, 'utf-8'));
  const hooks = settings.hooks?.PostToolUseFailure as Array<{ command?: string }> | undefined;

  if (hooks) {
    settings.hooks.PostToolUseFailure = hooks.filter(
      (h) => !h.command?.includes('vibedino')
    );
  }

  writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
  console.log(`  Removed VibeDino hook from ${settingsPath}`);
}
