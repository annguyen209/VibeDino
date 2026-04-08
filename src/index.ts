import { GameLoop } from './engine/GameLoop.js';
import { Renderer } from './engine/Renderer.js';
import { Input } from './engine/Input.js';
import { SceneManager } from './scenes/SceneManager.js';
import { TitleScene } from './scenes/TitleScene.js';
import { PlayScene } from './scenes/PlayScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { getHighScore, saveScore } from './storage/ScoreStore.js';
import type { StartGameOptions, GameResult, TriggerContext } from './integrations/types.js';

export type { GameResult, TriggerContext, StartGameOptions };

export function startGame(options: StartGameOptions = {}): Promise<GameResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const trigger: TriggerContext = {
      source: options.source ?? 'cli',
      reason: options.reason,
      metadata: options.metadata,
    };

    const renderer = new Renderer();
    const input = new Input();
    const sceneManager = new SceneManager();

    input.bind();

    let finalResult: GameResult | null = null;

    const cleanup = () => {
      loop.stop();
      input.destroy();
      renderer.destroy();
      if (finalResult) resolve(finalResult);
    };

    const startPlay = () => {
      const highScore = getHighScore();
      const scene = new PlayScene(
        renderer.getWidth(),
        renderer.getHeight(),
        highScore,
        (score: number) => {
          const { highScore: newHigh, isNew } = saveScore(score);
          finalResult = {
            score,
            highScore: newHigh,
            isNewHighScore: isNew,
            duration: Date.now() - startTime,
            trigger,
          };
          sceneManager.set(new GameOverScene(
            score,
            newHigh,
            isNew,
            () => {
              // Restart
              input.clear();
              startPlay();
            },
            () => {
              // Quit
              cleanup();
            }
          ));
        }
      );
      sceneManager.set(scene);
    };

    // Start with title scene
    const titleScene = new TitleScene(trigger.source, () => {
      input.clear();
      startPlay();
    });
    sceneManager.set(titleScene);

    const loop = new GameLoop(
      (dt) => {
        const actions = input.poll();
        sceneManager.handleInput(actions);
        sceneManager.update(dt);
      },
      () => {
        sceneManager.render(renderer);
      }
    );

    loop.start();

    // Graceful cleanup on signals
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
  });
}
