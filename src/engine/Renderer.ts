const ESC = '\x1b';
const CSI = `${ESC}[`;

// ANSI 256-color codes
export const Color = {
  reset: `${CSI}0m`,
  // Foreground
  fg: (n: number) => `${CSI}38;5;${n}m`,
  // Background
  bg: (n: number) => `${CSI}48;5;${n}m`,
  // RGB foreground
  fgRgb: (r: number, g: number, b: number) => `${CSI}38;2;${r};${g};${b}m`,
  // RGB background
  bgRgb: (r: number, g: number, b: number) => `${CSI}48;2;${r};${g};${b}m`,
  bold: `${CSI}1m`,
  dim: `${CSI}2m`,
} as const;

interface Cell {
  char: string;
  fg: string;   // ANSI fg escape or ''
  bg: string;   // ANSI bg escape or ''
}

export class Renderer {
  private buffer: Cell[][] = [];
  private width = 0;
  private height = 0;
  private defaultBg = '';
  private defaultFg = '';

  constructor() {
    this.width = process.stdout.columns || 80;
    this.height = process.stdout.rows || 24;
    this.clearBuffer();

    // Enter alternate screen, clear it, hide cursor
    process.stdout.write(`${CSI}?1049h${CSI}2J${CSI}?25l`);

    process.stdout.on('resize', () => {
      this.width = process.stdout.columns || 80;
      this.height = process.stdout.rows || 24;
      this.clearBuffer();
    });
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  setDefaultColors(fg: string, bg: string): void {
    this.defaultFg = fg;
    this.defaultBg = bg;
  }

  clearBuffer(): void {
    this.buffer = [];
    for (let y = 0; y < this.height; y++) {
      this.buffer[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.buffer[y][x] = { char: ' ', fg: this.defaultFg, bg: this.defaultBg };
      }
    }
  }

  drawChar(x: number, y: number, ch: string, fg = '', bg = ''): void {
    const rx = Math.round(x);
    const ry = Math.round(y);
    if (ry >= 0 && ry < this.height && rx >= 0 && rx < this.width) {
      this.buffer[ry][rx] = { char: ch, fg: fg || this.defaultFg, bg: bg || this.defaultBg };
    }
  }

  drawSprite(x: number, y: number, sprite: string[], fg = '', bg = ''): void {
    for (let row = 0; row < sprite.length; row++) {
      const line = sprite[row];
      for (let col = 0; col < line.length; col++) {
        const ch = line[col];
        if (ch !== ' ') {
          this.drawChar(x + col, y + row, ch, fg, bg);
        }
      }
    }
  }

  drawText(x: number, y: number, text: string, fg = '', bg = ''): void {
    for (let i = 0; i < text.length; i++) {
      this.drawChar(x + i, y, text[i], fg, bg);
    }
  }

  // Fill a rectangular area with a background color
  fillRect(x: number, y: number, w: number, h: number, bg: string): void {
    for (let row = 0; row < h; row++) {
      for (let col = 0; col < w; col++) {
        const rx = Math.round(x + col);
        const ry = Math.round(y + row);
        if (ry >= 0 && ry < this.height && rx >= 0 && rx < this.width) {
          this.buffer[ry][rx].bg = bg;
        }
      }
    }
  }

  // Fill entire row with background color
  fillRow(y: number, bg: string): void {
    if (y >= 0 && y < this.height) {
      for (let x = 0; x < this.width; x++) {
        this.buffer[y][x].bg = bg;
      }
    }
  }

  present(): void {
    let out = '';
    for (let y = 0; y < this.height; y++) {
      out += `${CSI}${y + 1};1H`;
      let lastFg = '';
      let lastBg = '';
      for (let x = 0; x < this.width; x++) {
        const cell = this.buffer[y][x];
        // Only emit color codes when they change
        if (cell.fg !== lastFg || cell.bg !== lastBg) {
          out += Color.reset;
          if (cell.bg) out += cell.bg;
          if (cell.fg) out += cell.fg;
          lastFg = cell.fg;
          lastBg = cell.bg;
        }
        out += cell.char;
      }
      out += Color.reset;
    }
    process.stdout.write(out);
  }

  destroy(): void {
    // Reset colors, show cursor, leave alternate screen
    process.stdout.write(`${Color.reset}${CSI}?25h${CSI}?1049l`);
  }
}
