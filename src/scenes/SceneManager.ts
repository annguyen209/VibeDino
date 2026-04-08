import type { Scene } from './Scene.js';
import type { Renderer } from '../engine/Renderer.js';
import type { Action } from '../engine/Input.js';

export class SceneManager {
  private current: Scene | null = null;

  set(scene: Scene): void {
    this.current = scene;
  }

  update(dt: number): void {
    this.current?.update(dt);
  }

  render(renderer: Renderer): void {
    this.current?.render(renderer);
  }

  handleInput(actions: Action[]): void {
    this.current?.handleInput(actions);
  }
}
