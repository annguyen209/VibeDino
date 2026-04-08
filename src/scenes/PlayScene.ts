import type { Scene } from './Scene.js';
import type { Renderer } from '../engine/Renderer.js';
import { Action } from '../engine/Input.js';
import { Dino, DinoState } from '../entities/Dino.js';
import { Ground } from '../entities/Ground.js';
import { Cloud } from '../entities/Cloud.js';
import { Obstacle } from '../entities/obstacles/Obstacle.js';
import { SpawnSystem } from '../systems/SpawnSystem.js';
import { DifficultySystem } from '../systems/DifficultySystem.js';
import { ScoreSystem } from '../systems/ScoreSystem.js';
import { HUD } from '../ui/HUD.js';
import { applyGravity, jump } from '../engine/Physics.js';
import { checkCollision } from '../engine/Collision.js';
import { STAR_CHARS } from '../assets/sprites.js';
import { Color } from '../engine/Renderer.js';
import {
  DINO_FG, CLOUD_FG, GROUND_FG, GROUND_BG, GROUND_DEEP,
  getSkyBg, getObstacleColor, GAMEOVER_FG,
} from '../assets/theme.js';

export class PlayScene implements Scene {
  private dino: Dino;
  private ground: Ground;
  private obstacles: Obstacle[] = [];
  private clouds: Cloud[] = [];
  private spawnSystem = new SpawnSystem();
  private difficulty = new DifficultySystem();
  private scoreSystem = new ScoreSystem();
  private hud = new HUD();
  private groundY: number;
  private screenWidth: number;
  private screenHeight: number;
  private dead = false;
  private highScoreDisplay: string;
  private onGameOver: (score: number) => void;
  private cloudSpawnTick = 0;
  private stars: { x: number; y: number; char: string; bright: number }[] = [];

  constructor(
    screenWidth: number,
    screenHeight: number,
    highScore: number,
    onGameOver: (score: number) => void
  ) {
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.groundY = screenHeight - 3;
    this.dino = new Dino(6, this.groundY - 6);
    this.dino.setState(DinoState.RUNNING);
    this.ground = new Ground();
    this.highScoreDisplay = String(highScore).padStart(5, '0');
    this.onGameOver = onGameOver;

    // Generate stars
    for (let i = 0; i < 25; i++) {
      this.stars.push({
        x: Math.floor(Math.random() * screenWidth),
        y: Math.floor(Math.random() * (this.groundY - 2)),
        char: STAR_CHARS[Math.floor(Math.random() * STAR_CHARS.length)],
        bright: 40 + Math.floor(Math.random() * 80),
      });
    }
  }

  update(dt: number): void {
    if (this.dead) return;

    this.difficulty.update();
    this.scoreSystem.update();

    applyGravity(this.dino, this.groundY - 6);
    this.dino.update(dt);

    this.ground.update(Math.abs(this.difficulty.speed));

    this.spawnSystem.update(
      this.obstacles,
      this.screenWidth,
      this.groundY,
      this.difficulty.speed,
      this.difficulty.difficulty
    );

    for (const obs of this.obstacles) {
      obs.vx = this.difficulty.speed;
      obs.update(dt);
    }

    this.obstacles = this.obstacles.filter(o => o.x + 20 > 0);

    // Clouds
    this.cloudSpawnTick++;
    if (this.cloudSpawnTick > 60 + Math.random() * 120) {
      this.cloudSpawnTick = 0;
      if (this.clouds.length < 5) {
        this.clouds.push(new Cloud(this.screenWidth + 5, 1 + Math.floor(Math.random() * 5)));
      }
    }
    for (const cloud of this.clouds) cloud.update(dt);
    this.clouds = this.clouds.filter(c => c.x + 12 > 0);

    // Collision
    const dinoBox = this.dino.getHitbox();
    for (const obs of this.obstacles) {
      if (checkCollision(dinoBox, obs.getHitbox())) {
        this.dead = true;
        this.dino.setState(DinoState.DEAD);
        this.onGameOver(this.scoreSystem.score);
        return;
      }
    }
  }

  render(renderer: Renderer): void {
    renderer.clearBuffer();

    // Sky gradient background
    for (let y = 0; y < this.groundY; y++) {
      renderer.fillRow(y, getSkyBg(y, this.groundY));
    }

    // Stars
    for (const star of this.stars) {
      renderer.drawChar(star.x, star.y, star.char,
        Color.fgRgb(star.bright, star.bright, star.bright + 30));
    }

    // Ground rows
    for (let y = this.groundY; y < this.screenHeight; y++) {
      renderer.fillRow(y, y === this.groundY ? GROUND_BG : GROUND_DEEP);
    }

    // Ground detail (pebbles)
    for (let y = this.groundY + 1; y < this.screenHeight; y++) {
      const offset = Math.floor(this.ground.getOffset() * 0.5) % this.screenWidth;
      for (let x = 0; x < this.screenWidth; x++) {
        if ((x + offset + y * 7) % 13 === 0) {
          renderer.drawChar(x, y, '·', Color.fgRgb(80, 65, 40), GROUND_DEEP);
        }
        if ((x + offset + y * 11) % 19 === 0) {
          renderer.drawChar(x, y, '∙', Color.fgRgb(70, 55, 35), GROUND_DEEP);
        }
      }
    }

    // Clouds
    for (const cloud of this.clouds) {
      renderer.drawSprite(Math.round(cloud.x), Math.round(cloud.y), cloud.sprite, CLOUD_FG);
    }

    // Ground surface texture
    const groundLine = this.ground.getLine(this.screenWidth);
    renderer.drawText(0, this.groundY, groundLine, GROUND_FG, GROUND_BG);

    // Obstacles
    for (const obs of this.obstacles) {
      const color = getObstacleColor(obs.type);
      renderer.drawSprite(Math.round(obs.x), Math.round(obs.y), obs.sprite, color);
    }

    // Dino
    const dinoColor = this.dead ? GAMEOVER_FG : DINO_FG;
    renderer.drawSprite(
      Math.round(this.dino.x),
      Math.round(this.dino.y),
      this.dino.sprite,
      dinoColor
    );

    // HUD
    this.hud.render(renderer, this.scoreSystem.getDisplay(), this.highScoreDisplay);

    // Milestone flash
    if (this.scoreSystem.milestone) {
      const msg = `+${this.scoreSystem.score}!`;
      renderer.drawText(
        Math.floor(this.screenWidth / 2) - Math.floor(msg.length / 2),
        2, msg, GAMEOVER_FG
      );
    }

    renderer.present();
  }

  handleInput(actions: Action[]): void {
    if (this.dead) return;

    for (const action of actions) {
      switch (action) {
        case Action.JUMP:
          if (this.dino.state === DinoState.DUCKING) {
            this.dino.setState(DinoState.RUNNING);
          }
          jump(this.dino);
          if (!this.dino.grounded) {
            this.dino.setState(DinoState.JUMPING);
          }
          break;
        case Action.DUCK:
          if (this.dino.grounded) {
            this.dino.setState(DinoState.DUCKING);
          }
          break;
        case Action.DUCK_RELEASE:
          if (this.dino.state === DinoState.DUCKING) {
            this.dino.setState(DinoState.RUNNING);
          }
          break;
        case Action.QUIT:
          this.dead = true;
          this.onGameOver(this.scoreSystem.score);
          break;
      }
    }
  }
}
