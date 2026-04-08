import { Entity } from '../Entity.js';

export type ObstacleType = 'cactus_small' | 'cactus_large' | 'cactus_group' | 'node_modules' | 'node_modules_small' | 'todo_bird' | 'rate_limit' | 'merge_conflict';

export class Obstacle extends Entity {
  type: ObstacleType;
  isFlying: boolean;

  constructor(x: number, y: number, type: ObstacleType, sprite: string[], isFlying = false) {
    super(x, y);
    this.type = type;
    this.sprite = sprite;
    this.isFlying = isFlying;
    this.grounded = !isFlying;

    // Set hitbox slightly smaller than sprite for generous collision
    const spriteWidth = Math.max(...sprite.map(l => l.length));
    const spriteHeight = sprite.length;
    this.hitboxDef = {
      offsetX: 1,
      offsetY: 1,
      width: Math.max(1, spriteWidth - 2),
      height: Math.max(1, spriteHeight - 1),
    };
  }

  override update(_dt: number): void {
    this.x += this.vx;
  }
}
