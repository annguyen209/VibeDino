const TITLE_MESSAGES: Record<string, string[]> = {
  claude: [
    'Claude ran out of tokens!',
    'Token limit reached. Time to play!',
    'Rate limited by Claude. Quick, run!',
  ],
  copilot: [
    'Copilot hit its limit!',
    'Copilot needs a break. You play!',
    'Rate limited. Copilot is resting.',
  ],
  default: [
    'No tokens? No problem!',
    'Token drought detected!',
    'AI is resting. Dino is not.',
  ],
};

const GAME_OVER_QUIPS = [
  'Tokens still regenerating...',
  'Your AI will be back soon.',
  'That was fun! Press R to retry.',
  'node_modules got you!',
  'Even dinos get merge conflicts.',
  'HTTP 429: Too Many Jumps',
];

export function getTitleMessage(source?: string): string {
  const pool = TITLE_MESSAGES[source ?? 'default'] ?? TITLE_MESSAGES.default;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getGameOverQuip(): string {
  return GAME_OVER_QUIPS[Math.floor(Math.random() * GAME_OVER_QUIPS.length)];
}
