export interface TriggerContext {
  source: 'cli' | 'claude' | 'copilot' | 'api';
  reason?: string;
  metadata?: Record<string, string>;
}

export interface GameResult {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  duration: number;
  trigger: TriggerContext;
}

export interface StartGameOptions extends Partial<TriggerContext> {}
