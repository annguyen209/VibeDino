import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const STORE_DIR = join(homedir(), '.vibedino');
const SCORES_FILE = join(STORE_DIR, 'scores.json');

interface ScoreData {
  highScore: number;
  scores: { score: number; date: string }[];
}

function ensureDir(): void {
  if (!existsSync(STORE_DIR)) {
    mkdirSync(STORE_DIR, { recursive: true });
  }
}

function load(): ScoreData {
  try {
    const raw = readFileSync(SCORES_FILE, 'utf-8');
    return JSON.parse(raw) as ScoreData;
  } catch {
    return { highScore: 0, scores: [] };
  }
}

function save(data: ScoreData): void {
  ensureDir();
  writeFileSync(SCORES_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function getHighScore(): number {
  return load().highScore;
}

export function saveScore(score: number): { highScore: number; isNew: boolean } {
  const data = load();
  const isNew = score > data.highScore;
  if (isNew) {
    data.highScore = score;
  }
  data.scores.push({ score, date: new Date().toISOString() });
  // Keep top 10
  data.scores.sort((a, b) => b.score - a.score);
  data.scores = data.scores.slice(0, 10);
  save(data);
  return { highScore: data.highScore, isNew };
}

export function getTopScores(): { score: number; date: string }[] {
  return load().scores;
}

export function resetScores(): void {
  save({ highScore: 0, scores: [] });
}
