// Half-block pixel art: ▀ = top pixel, ▄ = bottom pixel, █ = both pixels
// Each row = 2 pixel rows. Effectively 2x vertical resolution.

// === DINO (12 wide x 6 tall = 12x12 pixel equivalent) ===

export const DINO_RUN_1: string[] = [
  '      ▄█████',
  '     ██░█ ██',
  '  ▄  ██████ ',
  '  █▄█████▀  ',
  '   ▀████▀   ',
  '    █▀▀▄    ',
];

export const DINO_RUN_2: string[] = [
  '      ▄█████',
  '     ██░█ ██',
  '  ▄  ██████ ',
  '  █▄█████▀  ',
  '   ▀████▀   ',
  '    ▄▀ █▀   ',
];

export const DINO_JUMP: string[] = [
  '      ▄█████',
  '     ██░█ ██',
  '  ▄  ██████ ',
  '  █▄█████▀  ',
  '   ▀████▀   ',
  '    █▀ █▀   ',
];

export const DINO_DUCK_1: string[] = [
  '            ',
  '            ',
  '            ',
  '  ▄██████▄██',
  '  █████░████',
  '   ▀▀ ▀▀   ',
];

export const DINO_DUCK_2: string[] = [
  '            ',
  '            ',
  '            ',
  '  ▄██████▄██',
  '  █████░████',
  '    ▀▀▀▀   ',
];

export const DINO_DEAD: string[] = [
  '      ▄█████',
  '     ██X█X██',
  '  ▄  ██████ ',
  '  █▄█████▀  ',
  '   ▀████▀   ',
  '    █▀ █▀   ',
];

// === OBSTACLES ===

export const CACTUS_SMALL: string[] = [
  ' ▄█▄ ',
  '▀███▀',
  '  █  ',
  '  █  ',
];

export const CACTUS_LARGE: string[] = [
  '  █  ▄ ',
  ' ▄█▄██ ',
  '▀████▀ ',
  '  █▀   ',
  '  █    ',
];

export const CACTUS_GROUP: string[] = [
  ' ▄█▄ ▄█▄ ',
  '▀███▀████▀',
  '  █   █   ',
  '  █   █   ',
];

export const NODE_MODULES: string[] = [
  '╔══════════╗',
  '║node_mods/║',
  '║ ▓▓▓▓▓▓▓▓ ║',
  '╚══════════╝',
];

export const NODE_MODULES_SMALL: string[] = [
  '╔══════╗',
  '║n_mod/║',
  '╚══════╝',
];

export const TODO_BIRD_1: string[] = [
  ' ▄▀▀▄//TODO',
  '▀▄▄▀▀      ',
];

export const TODO_BIRD_2: string[] = [
  '▄▀▀▄▄      ',
  ' ▀▄▄▀//TODO',
];

export const RATE_LIMIT: string[] = [
  '╔═════╗',
  '║ 429 ║',
  '║LIMIT║',
  '╚═════╝',
];

export const MERGE_CONFLICT: string[] = [
  '◄◄◄HEAD',
  '═══════',
  '►►►main',
];

// === GROUND ===

export const GROUND_CHARS = '▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁';

// === CLOUDS ===

export const CLOUD_1: string[] = [
  '  ▄▄▄▄   ',
  '▀▀▀▀▀▀▀▀ ',
];

export const CLOUD_2: string[] = [
  ' ▄▄▄  ',
  '▀▀▀▀▀ ',
];

// === STARS ===

export const STAR_CHARS = ['·', '∙', '•', '°'];

// === UI ===

export const GAME_OVER_TEXT: string[] = [
  '╔═════════════════════════╗',
  '║    G A M E   O V E R    ║',
  '╚═════════════════════════╝',
];

export const TITLE_DINO: string[] = [
  '            ▄▄████▄▄       ',
  '          ▄██░░██▄████     ',
  '          ████████████     ',
  '  ▄▄    ████████▀▀         ',
  '  █████████████▀           ',
  '   ▀▀████████▀▀            ',
  '      ██▀▀██               ',
  '      █    █               ',
];
