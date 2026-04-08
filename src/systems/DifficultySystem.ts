export class DifficultySystem {
  private ticks = 0;
  private readonly maxSpeedMultiplier = 2.5;
  private readonly rampDurationTicks = 30 * 120; // ~120 seconds at 30fps to reach max

  /** Current difficulty 0..1 */
  difficulty = 0;

  /** Current game scroll speed (negative = moving left) */
  speed = -1.2;

  private readonly baseSpeed = -1.2;

  update(): void {
    this.ticks++;
    this.difficulty = Math.min(1, this.ticks / this.rampDurationTicks);
    this.speed = this.baseSpeed * (1 + this.difficulty * (this.maxSpeedMultiplier - 1));
  }

  reset(): void {
    this.ticks = 0;
    this.difficulty = 0;
    this.speed = this.baseSpeed;
  }
}
