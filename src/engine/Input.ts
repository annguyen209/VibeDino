import * as readline from 'readline';

export enum Action {
  JUMP,
  DUCK,
  DUCK_RELEASE,
  RESTART,
  QUIT,
  ANY_KEY,
}

export class Input {
  private actionQueue: Action[] = [];
  private ducking = false;
  private rl: readline.Interface | null = null;

  bind(): void {
    // Enable raw mode for immediate keypress reading
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', (key: string) => {
      // Ctrl+C
      if (key === '\x03') {
        this.actionQueue.push(Action.QUIT);
        return;
      }

      // Escape sequences for arrow keys
      if (key === '\x1b[A' || key === ' ') {
        // Up arrow or space = jump
        if (this.ducking) {
          this.ducking = false;
          this.actionQueue.push(Action.DUCK_RELEASE);
        }
        this.actionQueue.push(Action.JUMP);
        return;
      }

      if (key === '\x1b[B') {
        // Down arrow = duck
        if (!this.ducking) {
          this.ducking = true;
          this.actionQueue.push(Action.DUCK);
        }
        return;
      }

      if (key === '\x1b' || key === 'q' || key === 'Q') {
        this.actionQueue.push(Action.QUIT);
        return;
      }

      if (key === 'r' || key === 'R') {
        this.actionQueue.push(Action.RESTART);
        return;
      }

      // Any other key
      this.actionQueue.push(Action.ANY_KEY);
    });
  }

  poll(): Action[] {
    const actions = [...this.actionQueue];
    this.actionQueue = [];
    return actions;
  }

  releaseDuck(): void {
    this.ducking = false;
  }

  clear(): void {
    this.actionQueue = [];
  }

  destroy(): void {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
    process.stdin.pause();
  }
}
