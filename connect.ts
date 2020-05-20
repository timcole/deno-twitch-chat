import { connectWebSocket, WebSocket } from './deps.ts';
import { highlight, colours } from './colour.ts';

const endpoint: string = 'wss://irc-ws.chat.twitch.tv:443';

export async function connect(): Promise<WebSocket> {
  let socket: WebSocket;
  try {
    socket = await connectWebSocket(endpoint);
    console.log(highlight(colours.green, 'Successfully connected'), endpoint);

    socket.send('PASS 123');
    socket.send('NICK justinfan123');
    socket.send('JOIN #modesttim');
    socket.send('CAP REQ :twitch.tv/tags');
    socket.send('CAP REQ :twitch.tv/commands');
  } catch (err) {
    console.error(
      highlight(colours.red, `Could not connect to Websocket: '${err}'`)
    );
    Deno.exit(20);
  }
  return socket;
}
