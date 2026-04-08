import type { Scene } from './Scene.js';
import type { Renderer } from '../engine/Renderer.js';
import { Action } from '../engine/Input.js';
import { TITLE_DINO, GROUND_CHARS } from '../assets/sprites.js';
import { getTitleMessage } from '../ui/Messages.js';
import {
  TITLE_FG, DINO_FG, PROMPT_FG, QUIP_FG, GROUND_FG, GROUND_BG,
  getSkyBg, SCORE_FG,
} from '../assets/theme.js';
import { Color } from '../engine/Renderer.js';

export class TitleScene implements Scene {
  private message: string;
  private progressTick = 0;
  private readonly progressTotal = 75;
  private ready = false;
  private onStart: () => void;
  private blinkTick = 0;

  constructor(source: string | undefined, onStart: () => void) {
    this.message = getTitleMessage(source);
    this.onStart = onStart;
  }

  update(_dt: number): void {
    this.blinkTick++;
    if (!this.ready) {
      this.progressTick++;
      if (this.progressTick >= this.progressTotal) {
        this.ready = true;
      }
    }
  }

  render(renderer: Renderer): void {
    renderer.clearBuffer();
    const w = renderer.getWidth();
    const h = renderer.getHeight();

    // Sky background
    for (let y = 0; y < h; y++) {
      renderer.fillRow(y, getSkyBg(y, h));
    }

    // Title
    const titleY = Math.floor(h * 0.12);
    const titleStr = 'V I B E   D I N O';
    renderer.drawText(Math.floor(w / 2) - Math.floor(titleStr.length / 2), titleY, titleStr, TITLE_FG);

    // Subtitle
    const sub = 'Token Exhaustion Entertainment';
    renderer.drawText(Math.floor(w / 2) - Math.floor(sub.length / 2), titleY + 2, sub, QUIP_FG);

    // Dino
    const dinoY = titleY + 5;
    const dinoX = Math.floor(w / 2) - Math.floor(TITLE_DINO[0].length / 2);
    renderer.drawSprite(dinoX, dinoY, TITLE_DINO, DINO_FG);

    // Ground
    const groundY = dinoY + TITLE_DINO.length;
    renderer.fillRow(groundY, GROUND_BG);
    renderer.drawText(0, groundY, GROUND_CHARS.slice(0, w), GROUND_FG, GROUND_BG);

    // Message
    const msgY = groundY + 2;
    renderer.drawText(Math.floor(w / 2) - Math.floor(this.message.length / 2), msgY, this.message, SCORE_FG);

    // Progress bar or start prompt
    const barY = msgY + 2;
    if (!this.ready) {
      const barWidth = 32;
      const filled = Math.floor((this.progressTick / this.progressTotal) * barWidth);
      const barFull = '█'.repeat(filled);
      const barEmpty = '░'.repeat(barWidth - filled);
      const pct = Math.floor((this.progressTick / this.progressTotal) * 100);

      renderer.drawText(Math.floor(w / 2) - Math.floor(barWidth / 2) - 1, barY, '║', QUIP_FG);
      renderer.drawText(Math.floor(w / 2) - Math.floor(barWidth / 2), barY, barFull, Color.fgRgb(80, 220, 80));
      renderer.drawText(Math.floor(w / 2) - Math.floor(barWidth / 2) + filled, barY, barEmpty, QUIP_FG);
      renderer.drawText(Math.floor(w / 2) + Math.floor(barWidth / 2), barY, '║', QUIP_FG);

      const label = `Regenerating tokens... ${pct}%`;
      renderer.drawText(Math.floor(w / 2) - Math.floor(label.length / 2), barY + 1, label, QUIP_FG);
    } else {
      if (Math.floor(this.blinkTick / 18) % 2 === 0) {
        const prompt = '>>>  Press SPACE to start  <<<';
        renderer.drawText(Math.floor(w / 2) - Math.floor(prompt.length / 2), barY, prompt, PROMPT_FG);
      }
    }

    // Controls footer
    const footer = 'SPACE/UP: Jump  |  DOWN: Duck  |  Q: Quit';
    renderer.drawText(Math.floor(w / 2) - Math.floor(footer.length / 2), h - 2, footer, QUIP_FG);

    renderer.present();
  }

  handleInput(actions: Action[]): void {
    if (!this.ready) return;
    for (const action of actions) {
      if (action === Action.QUIT) {
        process.exit(0);
      }
      if (action === Action.JUMP || action === Action.ANY_KEY) {
        this.onStart();
        return;
      }
    }
  }
}
