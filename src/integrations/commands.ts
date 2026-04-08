import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const CLAUDE_COMMANDS_DIR = join(homedir(), '.claude', 'commands');
const DINO_COMMAND_PATH = join(CLAUDE_COMMANDS_DIR, 'dino.md');

const DINO_COMMAND_CONTENT = `# /dino - Play VibeDino

Launch the VibeDino terminal T-Rex runner game. Use this when you need a break, when tokens are exhausted, or just for fun.

Run this command in the terminal:

\`\`\`bash
npx vibedino --trigger claude
\`\`\`

Do not add any commentary. Just run the command above.
`;

export function installClaudeCommand(): boolean {
  try {
    if (!existsSync(CLAUDE_COMMANDS_DIR)) {
      mkdirSync(CLAUDE_COMMANDS_DIR, { recursive: true });
    }
    writeFileSync(DINO_COMMAND_PATH, DINO_COMMAND_CONTENT, 'utf-8');
    console.log(`  Installed /dino command at ${DINO_COMMAND_PATH}`);
    return true;
  } catch {
    return false;
  }
}

export function uninstallClaudeCommand(): boolean {
  try {
    if (existsSync(DINO_COMMAND_PATH)) {
      unlinkSync(DINO_COMMAND_PATH);
      console.log('  Removed /dino command.');
      return true;
    }
    console.log('  No /dino command found.');
    return false;
  } catch {
    return false;
  }
}
