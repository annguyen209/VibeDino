export class Animation {
  private frames: string[][];
  private frameDuration: number;
  private currentFrame = 0;
  private tickCounter = 0;
  private loop: boolean;

  constructor(frames: string[][], frameDuration: number, loop = true) {
    this.frames = frames;
    this.frameDuration = frameDuration;
    this.loop = loop;
  }

  update(): void {
    this.tickCounter++;
    if (this.tickCounter >= this.frameDuration) {
      this.tickCounter = 0;
      if (this.loop) {
        this.currentFrame = (this.currentFrame + 1) % this.frames.length;
      } else if (this.currentFrame < this.frames.length - 1) {
        this.currentFrame++;
      }
    }
  }

  getCurrentFrame(): string[] {
    return this.frames[this.currentFrame];
  }

  reset(): void {
    this.currentFrame = 0;
    this.tickCounter = 0;
  }
}
