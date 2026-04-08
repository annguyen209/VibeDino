import type { Renderer } from '../engine/Renderer.js';
import { SCORE_FG, HI_SCORE_FG } from '../assets/theme.js';

export class HUD {
  render(renderer: Renderer, score: string, highScore: string): void {
    const w = renderer.getWidth();
    renderer.drawText(w - 7, 1, score, SCORE_FG);
    renderer.drawText(w - 16, 1, 'HI', HI_SCORE_FG);
    renderer.drawText(w - 13, 1, highScore, HI_SCORE_FG);
  }
}
