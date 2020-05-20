// running stty is needed because lines/cols isn't available in Deno yet.
// More information via https://github.com/denoland/deno/issues/3456
export const getTermSize: () => Promise<TermSize> = async () => {
  // Start running stty
  const callStty = Deno.run({
    cmd: ['stty', 'size'],
    stdout: 'piped',
  });

  // preset term size to 0x0 incase it fails
  let [lines, columns] = new Array(2).fill(0);
  try {
    [lines, columns] = new TextDecoder()
      .decode(await callStty.output())
      .split(' ');
  } catch (e) {}
  // close the process
  callStty.close();

  return { lines: Number(lines), columns: Number(columns) };
};

export interface TermSize {
  lines: number;
  columns: number;
}
