export interface TerminalCaps {
  width: number;
  height: number;
  colorSupport: boolean;
  unicode: boolean;
  interactive: boolean;
}

export function detectTerminal(): TerminalCaps {
  return {
    width: process.stdout.columns ?? 80,
    height: process.stdout.rows ?? 24,
    colorSupport: !!process.stdout.isTTY && process.env.TERM !== 'dumb',
    unicode: process.env.LANG?.includes('UTF') ?? false,
    interactive: !!process.stdout.isTTY && !!process.stdin.isTTY,
  };
}
