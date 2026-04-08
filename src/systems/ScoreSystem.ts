export class ScoreSystem {
  score = 0;
  private tickAccumulator = 0;
  private readonly pointsPerSecond = 10;
  private readonly ticksPerPoint: number;
  milestone = false; // true on the tick a milestone is hit

  constructor(fps = 30) {
    this.ticksPerPoint = Math.floor(fps / this.pointsPerSecond);
  }

  update(): void {
    this.milestone = false;
    this.tickAccumulator++;
    if (this.tickAccumulator >= this.ticksPerPoint) {
      this.tickAccumulator = 0;
      this.score++;
      if (this.score > 0 && this.score % 100 === 0) {
        this.milestone = true;
      }
    }
  }

  getDisplay(): string {
    return String(this.score).padStart(5, '0');
  }

  reset(): void {
    this.score = 0;
    this.tickAccumulator = 0;
    this.milestone = false;
  }
}
