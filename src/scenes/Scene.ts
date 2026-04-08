import type { Renderer } from '../engine/Renderer.js';
import type { Action } from '../engine/Input.js';

export interface Scene {
  update(dt: number): void;
  render(renderer: Renderer): void;
  handleInput(actions: Action[]): void;
}
