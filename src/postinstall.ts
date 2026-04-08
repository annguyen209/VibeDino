import { existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { installClaudeHook } from './integrations/claudeCode.js';
import { installCopilotPlugin } from './integrations/copilotCli.js';

// Only run for global installs (not when used as a dependency)
const isGlobal = process.env.npm_config_global === 'true' ||
  process.argv.includes('--global') ||
  !process.env.INIT_CWD?.includes('node_modules');

if (isGlobal) {
  const home = homedir();
  let installed = false;

  // Auto-detect Claude Code
  const claudeDir = join(home, '.claude');
  if (existsSync(claudeDir)) {
    try {
      installClaudeHook(home);
      installed = true;
    } catch {
      // Silent fail — don't break install
    }
  }

  // Auto-detect Copilot CLI
  const copilotDir = join(home, '.copilot');
  if (existsSync(copilotDir)) {
    try {
      installCopilotPlugin();
      installed = true;
    } catch {
      // Silent fail
    }
  }

  if (installed) {
    console.log('\n  🦕 VibeDino hooks installed! Play when your AI hits a token limit.\n');
  } else {
    console.log('\n  🦕 VibeDino installed! Run: vibedino --install claude (or copilot)\n');
  }
}
