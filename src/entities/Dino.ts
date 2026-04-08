import { Entity } from './Entity.js';
import { DINO_RUN_1, DINO_RUN_2, DINO_JUMP, DINO_DUCK_1, DINO_DUCK_2, DINO_DEAD } from '../assets/sprites.js';

export enum DinoState {
  IDLE,
  RUNNING,
  JUMPING,
  DUCKING,
  DEAD,
}

export class Dino extends Entity {
  state = DinoState.IDLE;
  private animFrame = 0;
  private animTick = 0;
  private readonly animSpeed = 4; // ticks per frame swap

  constructor(x: number, groundY: number) {
    super(x, groundY);
    this.grounded = true;
    this.updateSprite();
    this.updateHitbox();
  }

  setState(state: DinoState): void {
    if (this.state === state) return;
    this.state = state;
    this.animFrame = 0;
    this.animTick = 0;
    this.updateSprite();
    this.updateHitbox();
  }

  override update(_dt: number): void {
    this.animTick++;
    if (this.animTick >= this.animSpeed) {
      this.animTick = 0;
      this.animFrame = (this.animFrame + 1) % 2;
      this.updateSprite();
    }

    if (this.state === DinoState.JUMPING && this.grounded) {
      this.setState(DinoState.RUNNING);
    }
  }

  private updateSprite(): void {
    switch (this.state) {
      case DinoState.IDLE:
      case DinoState.RUNNING:
        this.sprite = this.animFrame === 0 ? DINO_RUN_1 : DINO_RUN_2;
        break;
      case DinoState.JUMPING:
        this.sprite = DINO_JUMP;
        break;
      case DinoState.DUCKING:
        this.sprite = this.animFrame === 0 ? DINO_DUCK_1 : DINO_DUCK_2;
        break;
      case DinoState.DEAD:
        this.sprite = DINO_DEAD;
        break;
    }
  }

  private updateHitbox(): void {
    if (this.state === DinoState.DUCKING) {
      this.hitboxDef = { offsetX: 2, offsetY: 3, width: 9, height: 3 };
    } else {
      this.hitboxDef = { offsetX: 3, offsetY: 0, width: 8, height: 5 };
    }
  }
}
