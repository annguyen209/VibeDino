# 🦕 VibeDino

**A terminal T-Rex runner game for when your AI tools run out of tokens.**

Inspired by Chrome's offline dinosaur game — but themed for developers. When Claude Code or GitHub Copilot hits a rate limit, VibeDino gives you something fun to do while your tokens regenerate.

```
         ▄█████         ╔══════════╗
        ██░█ ██    ▄█▄  ║node_mods/║    ▄▀▀▄//TODO
     ▄  ██████    ▀███▀ ║ ▓▓▓▓▓▓▓▓ ║   ▀▄▄▀▀
     █▄█████▀      █    ╚══════════╝
      ▀████▀       █
       █▀▀▄
  ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
  HI 00350  00042
```

## Features

- 🎮 **Classic side-scroller** — jump over obstacles, duck under birds, survive!
- 🎨 **Full color** — sky gradient, green dino, colored obstacles, twinkling stars
- 🌵 **Dev-themed obstacles** — `node_modules` boulders, `// TODO` birds, HTTP 429 walls, merge conflicts
- 📊 **Score tracking** — persistent high scores saved locally
- 🔌 **AI tool integration** — hooks for Claude Code and GitHub Copilot CLI
- ⚡ **Zero dependencies** — pure Node.js, ANSI rendering, works in any modern terminal
- 📦 **Dual format** — ESM + CJS, CLI + programmatic API

## Install

```bash
npm install -g vibedino
```

Or run directly:

```bash
npx vibedino
```

## Gameplay

```
  Controls:
  ──────────────────────────
  SPACE / UP    Jump
  DOWN          Duck
  R             Restart (game over)
  Q / ESC       Quit
```

The game starts with a "Regenerating tokens..." progress bar, then throws increasingly difficult obstacles at you. Your score increases with time. Beat your high score!

## Screenshots

### Title Screen
```
  ┌──────────────────────────────────────────────────┐
  │                                                  │
  │            V I B E   D I N O                     │
  │       Token Exhaustion Entertainment             │
  │                                                  │
  │               ▄▄████▄▄                           │
  │             ▄██░░██▄████                         │
  │             ████████████                         │
  │     ▄▄    ████████▀▀                             │
  │     █████████████▀                               │
  │      ▀▀████████▀▀                               │
  │         ██▀▀██                                   │
  │  ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁  │
  │                                                  │
  │         No tokens? No problem!                   │
  │                                                  │
  │    ║████████████████░░░░░░░░░░░░░░║              │
  │         Regenerating tokens... 55%               │
  │                                                  │
  │    SPACE/UP: Jump | DOWN: Duck | Q: Quit         │
  └──────────────────────────────────────────────────┘
```

### Gameplay
```
  ┌──────────────────────────────────────────────────┐
  │  · ·  °                            HI 00350 00127│
  │     ▄▄▄▄                    ·                    │
  │   ▀▀▀▀▀▀▀▀                                      │
  │                     ▄▄▄                          │
  │        ▄█████     ▀▀▀▀▀                          │
  │       ██░█ ██                                    │
  │    ▄  ██████                                     │
  │    █▄█████▀    ▄█▄      ╔══════════╗  ▄▀▀▄//TODO│
  │     ▀████▀    ▀███▀     ║node_mods/║ ▀▄▄▀▀      │
  │      █▀▀▄      █        ║ ▓▓▓▓▓▓▓▓ ║             │
  │  ▁▁▁▁▁▁▁▁▁▁▁▁▁█▁▁▁▁▁▁▁╚══════════╝▁▁▁▁▁▁▁▁▁▁▁│
  │  · ∙    ·    ∙     ·   ∙    ·    ∙     ·   ∙    │
  └──────────────────────────────────────────────────┘
```

### Game Over
```
  ┌──────────────────────────────────────────────────┐
  │                                                  │
  │      ╔═════════════════════════╗                  │
  │      ║    G A M E   O V E R    ║                  │
  │      ╚═════════════════════════╝                  │
  │                                                  │
  │              ▄█████                              │
  │             ██X█X██                              │
  │          ▄  ██████                               │
  │          █▄█████▀                                │
  │           ▀████▀                                 │
  │            █▀ █▀                                 │
  │                                                  │
  │            Score  00127                           │
  │            Best   00350                           │
  │                                                  │
  │     Tokens still regenerating...                 │
  │                                                  │
  │        [R] Restart     [Q] Quit                  │
  └──────────────────────────────────────────────────┘
```

## AI Tool Integration

### Auto-Install (Recommended)

When you install VibeDino globally, it **auto-detects** Claude Code and Copilot CLI and installs hooks automatically:

```bash
npm install -g vibedino
# 🦕 VibeDino hooks installed! Play when your AI hits a token limit.
```

No config editing needed. If you install later or want manual control, use the commands below.

### Claude Code

```bash
vibedino --install claude
```

This adds a hook to `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUseFailure": [{
      "matcher": "rate_limit|token_limit|quota_exceeded|overloaded",
      "command": "npx vibedino --trigger claude",
      "timeout": 300000
    }]
  }
}
```

### GitHub Copilot CLI

```bash
vibedino --install copilot
```

Installs a plugin at `~/.copilot/plugins/vibedino/plugin.json`.

### Remove integrations

```bash
vibedino --uninstall claude
vibedino --uninstall copilot
```

## Programmatic API

```typescript
import { startGame } from 'vibedino';

const result = await startGame({
  source: 'api',
  reason: 'rate_limit',
});

console.log(result);
// { score: 127, highScore: 350, isNewHighScore: false, duration: 45000 }
```

## CLI Reference

```
vibedino                    Launch the game
vibedino --trigger claude   Launch with Claude-themed messages
vibedino --trigger copilot  Launch with Copilot-themed messages
vibedino --install claude   Install Claude Code hook
vibedino --install copilot  Install Copilot CLI plugin
vibedino --uninstall claude Remove Claude Code hook
vibedino --uninstall copilot Remove Copilot CLI plugin
vibedino --scores           Show high scores
vibedino --reset            Reset high scores
vibedino --help             Show help
vibedino --version          Show version
```

## How it works

VibeDino is a pure Node.js terminal game with:
- **ANSI escape codes** for rendering (no dependencies)
- **Half-block pixel art** (`▀▄█`) for 2x vertical resolution sprites
- **24-bit RGB colors** for sky gradient, themed obstacles, and UI
- **Fixed 30fps game loop** with deterministic physics
- **Persistent scores** saved to `~/.vibedino/scores.json`

## Development

```bash
git clone https://github.com/annguyen209/VibeDino.git
cd VibeDino
npm install
npm run dev        # Run with tsx (hot reload)
npm run build      # Build for distribution
npm run typecheck  # Type check
```

## License

MIT

---

*Made with vibes. No tokens were harmed in the making of this game.*
