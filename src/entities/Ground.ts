import { GROUND_CHARS } from '../assets/sprites.js';

export class Ground {
  private offset = 0;
  private readonly pattern: string;

  constructor() {
    // Double the pattern for seamless scrolling
    this.pattern = GROUND_CHARS + GROUND_CHARS;
  }

  update(speed: number): void {
    this.offset = (this.offset + speed) % GROUND_CHARS.length;
  }

  getOffset(): number {
    return this.offset;
  }

  getLine(width: number): string {
    const start = Math.floor(this.offset);
    return this.pattern.slice(start, start + width);
  }
}
