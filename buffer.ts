import { Line } from './bufferLine.ts';

export interface BufferCoords {
  x: number;
  y: number;
}

export class Buffer {
  private lines: string[] = [];
  private scroll: number = 0;
  private coords: BufferCoords;

  private size: { width: number; height: number };

  constructor(
    width: number,
    height: number,
    scroll: number = 0,
    coords: BufferCoords = {
      x: 0,
      y: 0,
    }
  ) {
    this.coords = coords;
    this.scroll = scroll;
    this.size = { width, height };
    this.lines.push(' '.repeat(this.width()));
  }

  public get lineHight(): number {
    return this.lines.length;
  }

  public height(): number {
    return this.size.height;
  }

  public width(): number {
    return this.size.width;
  }

  public append(line: Line): Buffer {
    this.lines.push(line.text);
    return this;
  }

  // Check to see if the vertical space is full.
  // If not fill it up!
  public async fill(): Promise<Buffer> {
    var fillHeight = this.height() - this.lines.length;
    if (fillHeight > 0)
      for await (const _ of new Array(fillHeight))
        this.lines.push(' '.repeat(this.width()));
    return this;
  }

  public async render(): Promise<void> {
    // fill the remaining space with whitespace
    await this.fill();

    if (this.scroll >= this.height()) this.scroll = this.height();
    let start = this.lines.length - this.height() - this.scroll;
    if (start < 0) start = 0;
    let scrollBuffer: string[] = this.lines.splice(start, this.height());

    // Clear screen
    Deno.stdout.writeSync(new TextEncoder().encode(`\x1B[2J`));

    // Write buffer
    scrollBuffer.map((line) => {
      Deno.stdout.writeSync(
        new TextEncoder().encode(
          `\x1B[${this.coords.y};${this.coords.x}H${line}\n`
        )
      );
      this.coords.y++;
    });

    Deno.stdout.writeSync(
      new TextEncoder().encode(`\x1B[${this.coords.y - 1};${this.coords.x}H`)
    );
  }
}
