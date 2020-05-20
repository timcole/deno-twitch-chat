// \x1b[38;2;25;188;165;mtimcole.me\x1b[39m

export const colours: {
  [name: string]: string;
} = {
  red: 'e06b75',
  green: '98c379',
  blue: '60afef',
  cyan: '65c1cd',
  magenta: 'c376db',
  yellow: 'e5c07a',
};

export function highlight(hex: string, text: string): string {
  const parsed = parseInt(hex.replace(/[^0-9A-F]/gi, ''), 16);
  const r = (parsed >> 16) & 255,
    g = (parsed >> 8) & 255,
    b = parsed & 255;

  return `\x1b[38;2;${r};${g};${b};m${text}\x1b[39m`;
}

if (import.meta.main) console.log(highlight('#BAD455', `Hello World`));
