import { Buffer } from './buffer.ts';
import { Line } from './bufferLine.ts';
import { getTermSize } from './getTermSize.ts';
import { bgBlue, black, bgRgb24 } from 'https://deno.land/std/fmt/colors.ts';

let scroll = 0;
let renderTimer: number = -1;
let buffer: Buffer | undefined;

async function renderFrame(): Promise<void> {
  const { lines, columns } = await getTermSize();

  buffer = new Buffer(columns, lines, scroll);

  const time = new Line();
  time.text = black(bgBlue(` ${new Date().toString()} `));
  time.fillColour((str: string) => bgRgb24(str, { r: 44, g: 49, b: 58 }));
  time.commit(buffer);

  for (var i = 1; i <= 40; i++) {
    const line = new Line();
    line.text = `Sup, I know how to count to ${i.toString()}`;
    line.commit(buffer);
  }

  buffer.render();
  renderTimer = setTimeout(renderFrame, 1000);
}

Deno.setRaw(0, true); // requires --unstable
async function cli() {
  let input: string = '';
  while (true) {
    const stdBuffer = new Uint8Array(6);
    const read = await Deno.stdin.read(stdBuffer);
    if (read == null) continue;

    const char = new TextDecoder().decode(stdBuffer.subarray(0, read));

    switch (char) {
      // Exit with Ctrl+C
      case '\u0003':
      case 'q':
        Deno.stdout.writeSync(new TextEncoder().encode(`\x1B[2J`));
        console.log('\nGoodbye\n');
        // TODO(timothycole): Don't leave this, gracefully clean-up instead
        Deno.exit(0);
      // Up arrow
      case '\u001b[A':
      case 'k':
        if (scroll < (buffer?.lineHight || 0)) scroll += 1;
        clearTimeout(renderTimer);
        renderFrame();
        break;
      // Down arrow
      case '\u001b[B':
      case 'j':
        if (scroll > 0) scroll -= 1;
        clearTimeout(renderTimer);
        renderFrame();
        break;
      default:
        input += char;
    }
  }
}

renderFrame();
await cli();
clearTimeout(renderTimer);
