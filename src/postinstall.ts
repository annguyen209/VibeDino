import { existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { installClaudeHook } from './integrations/claudeCode.js';
import { installCopilotPlugin } from './integrations/copilotCli.js';
import { installClaudeCommand } from './integrations/commands.js';

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
      installClaudeCommand();
      installed = true;
    } catch {
      // Silent fail
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
    console.log('\n  🦕 VibeDino installed! Hooks + /dino command ready.\n');
  } else {
    console.log('\n  🦕 VibeDino installed! Run: vibedino --install claude (or copilot)\n');
  }
}
