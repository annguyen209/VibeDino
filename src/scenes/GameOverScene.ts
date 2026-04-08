import type { Scene } from './Scene.js';
import type { Renderer } from '../engine/Renderer.js';
import { Action } from '../engine/Input.js';
import { GAME_OVER_TEXT, DINO_DEAD } from '../assets/sprites.js';
import { getGameOverQuip } from '../ui/Messages.js';
import {
  GAMEOVER_FG, SCORE_FG, HI_SCORE_FG, PROMPT_FG, QUIP_FG,
  getSkyBg, DINO_FG,
} from '../assets/theme.js';
import { Color } from '../engine/Renderer.js';

export class GameOverScene implements Scene {
  private score: number;
  private highScore: number;
  private isNewHighScore: boolean;
  private quip: string;
  private onRestart: () => void;
  private onQuit: () => void;
  private blinkTick = 0;

  constructor(
    score: number,
    highScore: number,
    isNewHighScore: boolean,
    onRestart: () => void,
    onQuit: () => void
  ) {
    this.score = score;
    this.highScore = highScore;
    this.isNewHighScore = isNewHighScore;
    this.quip = getGameOverQuip();
    this.onRestart = onRestart;
    this.onQuit = onQuit;
  }

  update(_dt: number): void {
    this.blinkTick++;
  }

  render(renderer: Renderer): void {
    renderer.clearBuffer();
    const w = renderer.getWidth();
    const h = renderer.getHeight();

    // Dark sky background
    for (let y = 0; y < h; y++) {
      renderer.fillRow(y, Color.bgRgb(20, 15, 30));
    }

    const centerY = Math.floor(h / 2) - 6;

    // Game Over banner
    const bannerX = Math.floor(w / 2) - Math.floor(GAME_OVER_TEXT[0].length / 2);
    renderer.drawSprite(bannerX, centerY, GAME_OVER_TEXT, GAMEOVER_FG);

    // Dead dino
    const dinoX = Math.floor(w / 2) - Math.floor(DINO_DEAD[0].length / 2);
    renderer.drawSprite(dinoX, centerY + 4, DINO_DEAD, Color.fgRgb(100, 100, 100));

    // Score
    const scoreY = centerY + 4 + DINO_DEAD.length + 1;
    const scoreText = `Score  ${String(this.score).padStart(5, '0')}`;
    renderer.drawText(Math.floor(w / 2) - Math.floor(scoreText.length / 2), scoreY, scoreText, SCORE_FG);

    // High score
    const hiY = scoreY + 2;
    if (this.isNewHighScore) {
      const hiText = '* * *  NEW HIGH SCORE!  * * *';
      if (Math.floor(this.blinkTick / 8) % 2 === 0) {
        renderer.drawText(Math.floor(w / 2) - Math.floor(hiText.length / 2), hiY, hiText, HI_SCORE_FG);
      }
    } else {
      const hiText = `Best   ${String(this.highScore).padStart(5, '0')}`;
      renderer.drawText(Math.floor(w / 2) - Math.floor(hiText.length / 2), hiY, hiText, HI_SCORE_FG);
    }

    // Quip
    renderer.drawText(Math.floor(w / 2) - Math.floor(this.quip.length / 2), hiY + 2, this.quip, QUIP_FG);

    // Prompt
    if (Math.floor(this.blinkTick / 18) % 2 === 0) {
      const prompt = '[R] Restart     [Q] Quit';
      renderer.drawText(Math.floor(w / 2) - Math.floor(prompt.length / 2), hiY + 4, prompt, PROMPT_FG);
    }

    renderer.present();
  }

  handleInput(actions: Action[]): void {
    for (const action of actions) {
      if (action === Action.RESTART) {
        this.onRestart();
        return;
      }
      if (action === Action.QUIT) {
        this.onQuit();
        return;
      }
    }
  }
}
