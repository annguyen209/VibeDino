export class GameLoop {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private running = false;
  private readonly tickMs: number;

  constructor(
    private onUpdate: (dt: number) => void,
    private onRender: () => void,
    fps = 30
  ) {
    this.tickMs = Math.floor(1000 / fps);
  }

  start(): void {
    if (this.running) return;
    this.running = true;

    this.intervalId = setInterval(() => {
      if (!this.running) return;
      this.onUpdate(1); // fixed timestep: 1 tick
      this.onRender();
    }, this.tickMs);
  }

  stop(): void {
    this.running = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  isRunning(): boolean {
    return this.running;
  }
}
