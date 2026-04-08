import { startGame } from './index.js';
import { getHighScore, getTopScores, resetScores } from './storage/ScoreStore.js';
import { installClaudeHook, uninstallClaudeHook } from './integrations/claudeCode.js';
import { installCopilotPlugin, uninstallCopilotPlugin } from './integrations/copilotCli.js';
import { installClaudeCommand, uninstallClaudeCommand } from './integrations/commands.js';
import type { StartGameOptions } from './integrations/types.js';

function printHelp(): void {
  console.log(`
  vibedino - Terminal T-Rex runner for when AI tools run out of tokens

  USAGE
    vibedino [options]

  OPTIONS
    --trigger <source>   Trigger source: claude, copilot, cli (default: cli)
    --reason <text>      Why the game was triggered
    --install <target>   Install integration: claude, copilot
    --uninstall <target> Remove integration: claude, copilot
    --scores             Show high scores and exit
    --reset              Reset high scores
    --help, -h           Show this help
    --version, -v        Show version

  CONTROLS
    SPACE / UP     Jump
    DOWN           Duck
    R              Restart (on game over)
    Q / ESC        Quit
  `);
}

function parseArgs(argv: string[]): Record<string, string | boolean> {
  const args: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else if (arg === '--version' || arg === '-v') {
      args.version = true;
    } else if (arg === '--scores') {
      args.scores = true;
    } else if (arg === '--reset') {
      args.reset = true;
    } else if (arg === '--trigger' && argv[i + 1]) {
      args.trigger = argv[++i];
    } else if (arg === '--reason' && argv[i + 1]) {
      args.reason = argv[++i];
    } else if (arg === '--install' && argv[i + 1]) {
      args.install = argv[++i];
    } else if (arg === '--uninstall' && argv[i + 1]) {
      args.uninstall = argv[++i];
    }
  }
  return args;
}

export async function cli(argv: string[]): Promise<void> {
  const args = parseArgs(argv);

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  if (args.version) {
    console.log('vibedino v0.1.0');
    process.exit(0);
  }

  if (args.scores) {
    const hi = getHighScore();
    const top = getTopScores();
    console.log(`\n  High Score: ${hi}\n`);
    if (top.length > 0) {
      console.log('  Top Scores:');
      top.forEach((s, i) => {
        console.log(`    ${i + 1}. ${String(s.score).padStart(5, '0')}  (${s.date.split('T')[0]})`);
      });
      console.log();
    }
    process.exit(0);
  }

  if (args.install) {
    if (args.install === 'claude') { installClaudeHook(); installClaudeCommand(); }
    else if (args.install === 'copilot') installCopilotPlugin();
    else console.log('  Unknown target. Use: claude, copilot');
    process.exit(0);
  }

  if (args.uninstall) {
    if (args.uninstall === 'claude') { uninstallClaudeHook(); uninstallClaudeCommand(); }
    else if (args.uninstall === 'copilot') uninstallCopilotPlugin();
    else console.log('  Unknown target. Use: claude, copilot');
    process.exit(0);
  }

  if (args.reset) {
    resetScores();
    console.log('  Scores reset.');
    process.exit(0);
  }

  const options: StartGameOptions = {
    source: (args.trigger as 'claude' | 'copilot' | 'cli') ?? 'cli',
    reason: args.reason as string | undefined,
  };

  try {
    const result = await startGame(options);

    console.log(`\n  Score: ${result.score}  |  High Score: ${result.highScore}`);
    if (result.isNewHighScore) {
      console.log('  New high score!');
    }
    console.log();
  } catch (err) {
    console.error(`  Error: ${(err as Error).message}`);
    process.exit(1);
  }
  process.exit(0);
}

