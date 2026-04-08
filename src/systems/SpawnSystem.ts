import { Obstacle, ObstacleType } from '../entities/obstacles/Obstacle.js';
import {
  CACTUS_SMALL, CACTUS_LARGE, CACTUS_GROUP,
  NODE_MODULES, NODE_MODULES_SMALL, TODO_BIRD_1,
  RATE_LIMIT, MERGE_CONFLICT,
} from '../assets/sprites.js';

interface ObstacleDef {
  type: ObstacleType;
  sprite: string[];
  isFlying: boolean;
  minDifficulty: number;
}

const OBSTACLE_DEFS: ObstacleDef[] = [
  { type: 'cactus_small', sprite: CACTUS_SMALL, isFlying: false, minDifficulty: 0 },
  { type: 'cactus_large', sprite: CACTUS_LARGE, isFlying: false, minDifficulty: 0.05 },
  { type: 'cactus_group', sprite: CACTUS_GROUP, isFlying: false, minDifficulty: 0.1 },
  { type: 'node_modules_small', sprite: NODE_MODULES_SMALL, isFlying: false, minDifficulty: 0.15 },
  { type: 'node_modules', sprite: NODE_MODULES, isFlying: false, minDifficulty: 0.25 },
  { type: 'merge_conflict', sprite: MERGE_CONFLICT, isFlying: false, minDifficulty: 0.3 },
  { type: 'rate_limit', sprite: RATE_LIMIT, isFlying: false, minDifficulty: 0.35 },
  { type: 'todo_bird', sprite: TODO_BIRD_1, isFlying: true, minDifficulty: 0.4 },
];

export class SpawnSystem {
  private ticksSinceSpawn = 0;
  private minGapTicks = 45;
  private maxGapTicks = 90;
  private nextSpawnAt: number;

  constructor() {
    this.nextSpawnAt = this.randomGap();
  }

  update(
    obstacles: Obstacle[],
    screenWidth: number,
    groundY: number,
    speed: number,
    difficulty: number
  ): void {
    this.ticksSinceSpawn++;

    // Tighten gaps as difficulty increases
    this.minGapTicks = Math.max(25, 45 - difficulty * 20);
    this.maxGapTicks = Math.max(50, 90 - difficulty * 30);

    if (this.ticksSinceSpawn >= this.nextSpawnAt) {
      const available = OBSTACLE_DEFS.filter(d => d.minDifficulty <= difficulty);
      const def = available[Math.floor(Math.random() * available.length)];

      const spriteH = def.sprite.length;
      const yPos = def.isFlying
        ? groundY - spriteH - 3 - Math.floor(Math.random() * 3)
        : groundY - spriteH;

      const obs = new Obstacle(screenWidth + 2, yPos, def.type, def.sprite, def.isFlying);
      obs.vx = speed;
      obstacles.push(obs);

      this.ticksSinceSpawn = 0;
      this.nextSpawnAt = this.randomGap();
    }
  }

  private randomGap(): number {
    return this.minGapTicks + Math.floor(Math.random() * (this.maxGapTicks - this.minGapTicks));
  }

  reset(): void {
    this.ticksSinceSpawn = 0;
    this.nextSpawnAt = this.randomGap();
  }
}
