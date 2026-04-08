import { Color } from '../engine/Renderer.js';

// === COLOR PALETTE ===
// Using RGB for precise control in modern terminals (Windows Terminal, iTerm2, etc.)

export const SKY = {
  top:    Color.bgRgb(25, 25, 50),     // dark blue-black
  mid:    Color.bgRgb(35, 35, 65),     // slightly lighter
  bottom: Color.bgRgb(50, 45, 75),     // dusk purple
};

export const GROUND_BG = Color.bgRgb(60, 50, 30);    // earthy brown
export const GROUND_DEEP = Color.bgRgb(45, 38, 22);  // darker brown

export const DINO_FG = Color.fgRgb(80, 200, 80);     // green dino
export const DINO_EYE = Color.fgRgb(255, 255, 255);  // white eye

export const CACTUS_FG = Color.fgRgb(50, 160, 50);   // dark green
export const OBSTACLE_FG = Color.fgRgb(200, 160, 60); // golden/warning color
export const BIRD_FG = Color.fgRgb(180, 100, 200);    // purple bird

export const CLOUD_FG = Color.fgRgb(120, 120, 160);   // dim blue-grey
export const GROUND_FG = Color.fgRgb(140, 110, 60);   // tan

export const SCORE_FG = Color.fgRgb(255, 255, 200);   // warm white
export const TITLE_FG = Color.fgRgb(100, 220, 100);   // bright green
export const GAMEOVER_FG = Color.fgRgb(255, 80, 80);  // red
export const PROMPT_FG = Color.fgRgb(255, 255, 100);  // yellow
export const HI_SCORE_FG = Color.fgRgb(255, 200, 50); // gold
export const QUIP_FG = Color.fgRgb(150, 150, 170);    // muted

// Map obstacle types to colors
export function getObstacleColor(type: string): string {
  switch (type) {
    case 'cactus_small':
    case 'cactus_large':
    case 'cactus_group':
      return CACTUS_FG;
    case 'todo_bird':
      return BIRD_FG;
    case 'node_modules':
    case 'node_modules_small':
    case 'rate_limit':
    case 'merge_conflict':
      return OBSTACLE_FG;
    default:
      return '';
  }
}

// Compute sky bg color for a given row (gradient)
export function getSkyBg(y: number, height: number): string {
  const t = y / height; // 0 at top, 1 at bottom
  const r = Math.round(25 + t * 35);
  const g = Math.round(25 + t * 25);
  const b = Math.round(50 + t * 30);
  return Color.bgRgb(r, g, b);
}
