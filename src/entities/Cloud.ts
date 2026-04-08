import { Entity } from './Entity.js';
import { CLOUD_1, CLOUD_2 } from '../assets/sprites.js';

export class Cloud extends Entity {
  constructor(x: number, y: number) {
    super(x, y);
    this.sprite = Math.random() > 0.5 ? CLOUD_1 : CLOUD_2;
    this.vx = -(0.2 + Math.random() * 0.3); // Clouds drift slower than ground
  }

  override update(_dt: number): void {
    this.x += this.vx;
  }
}
