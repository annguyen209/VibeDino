import type { Entity } from '../entities/Entity.js';

export const GRAVITY = 0.35;
export const JUMP_VELOCITY = -3.5;
export const MAX_FALL_SPEED = 5.0;

export function applyGravity(entity: Entity, groundY: number): void {
  if (entity.grounded) return;

  entity.vy += GRAVITY;
  if (entity.vy > MAX_FALL_SPEED) {
    entity.vy = MAX_FALL_SPEED;
  }

  entity.y += entity.vy;

  if (entity.y >= groundY) {
    entity.y = groundY;
    entity.vy = 0;
    entity.grounded = true;
  }
}

export function jump(entity: Entity): void {
  if (!entity.grounded) return;
  entity.vy = JUMP_VELOCITY;
  entity.grounded = false;
}
