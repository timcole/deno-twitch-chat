import { Line } from './bufferLine.ts';

export interface BufferOptions {
  x: number;
  y: number;
  scroll: number;
}

export class Buffer {
  private lines: string[] = [];
  private options: BufferOptions;

  private size: { width: number; height: number };

  constructor(
    width: number,
    height: number,
    options: BufferOptions = {
      x: 0,
      y: 0,
      scroll: 0,
    }
  ) {
    this.options = options;
    this.size = { width, height };
    this.lines.push(' '.repeat(this.width()));
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
    await this.fill();
    // Clear screen
    Deno.stdout.writeSync(new TextEncoder().encode(`\x1B[2J`));

    // Write buffer
    this.lines.map((line) => {
      Deno.stdout.writeSync(
        new TextEncoder().encode(
          `\x1B[${this.options.y};${this.options.x}H${line}\n`
        )
      );
      this.options.y++;
    });

    Deno.stdout.writeSync(
      new TextEncoder().encode(`\x1B[${this.options.y - 1};${this.options.x}H`)
    );
  }
}
