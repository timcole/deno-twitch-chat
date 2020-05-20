import { TextProtoReader, BufReader, WebSocket } from './deps.ts';

export async function cli(socket: WebSocket): Promise<void> {
  const tpr = new TextProtoReader(new BufReader(Deno.stdin));
  while (true) {
    let line = await tpr.readLine();
    if (line === null || line === '/quit' || line.startsWith(':q')) {
      break;
    }
    if (line.startsWith('/join ')) {
      line = `JOIN #${line
        .replace(/\/join #?/g, '')
        .trim()
        .toLowerCase()}`;
    }
    await socket.send(line);
  }
}
