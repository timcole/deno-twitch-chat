import { Buffer } from './buffer.ts';
import { Line } from './bufferLine.ts';
import { getTermSize } from './getTermSize.ts';
import { bgBlue, black, bgRgb24 } from 'https://deno.land/std/fmt/colors.ts';

async function renderFrame(): Promise<void> {
  const { lines, columns } = await getTermSize();

  const buffer = new Buffer(columns, lines);

  const time = new Line();
  time.text = black(bgBlue(` ${new Date().toString()} `));
  time.fillColour((str: string) => bgRgb24(str, { r: 44, g: 49, b: 58 }));
  time.commit(buffer);

  for (var i = 1; i <= 30; i++) {
    const line = new Line();
    line.text = `Sup, I know how to count to ${i.toString()}`;
    line.commit(buffer);
  }

  buffer.render();
  setTimeout(renderFrame, 1000);
}

renderFrame();
