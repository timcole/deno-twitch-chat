import { Buffer } from './buffer.ts';

// https://github.com/chalk/ansi-regex/blob/master/license
const ansiRegex = new RegExp(
  [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))',
  ].join('|'),
  'g'
);

export class Line {
  private content: string = '';
  private colour: (str: string) => string = (str: string) => str;

  constructor() {}

  public set text(text: string) {
    this.content += text;
  }

  public get text(): string {
    return this.content;
  }

  public padding(width: number): Line {
    this.content += new Array(width + 1).join(this.colour(' '));
    return this;
  }

  private fill(buffer: Buffer): Line {
    var fillWidth = buffer.width() - this.content.replace(ansiRegex, '').length;
    if (fillWidth > 0) this.padding(fillWidth);
    return this;
  }

  public fillColour(colour: (str: string) => string): Line {
    this.colour = colour;
    return this;
  }

  public commit(buffer: Buffer): Line {
    this.fill(buffer);
    buffer.append(this);
    return this;
  }
}
