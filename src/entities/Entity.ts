export interface HitboxDef {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}

export class Entity {
  x: number;
  y: number;
  vx = 0;
  vy = 0;
  grounded = false;
  active = true;
  sprite: string[] = [];
  hitboxDef: HitboxDef = { offsetX: 0, offsetY: 0, width: 0, height: 0 };

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getHitbox() {
    return {
      x: this.x + this.hitboxDef.offsetX,
      y: this.y + this.hitboxDef.offsetY,
      width: this.hitboxDef.width,
      height: this.hitboxDef.height,
    };
  }

  update(_dt: number): void {}
}
