import { WebSocket, isWebSocketCloseEvent } from './deps.ts';
import { highlight, colours } from './colour.ts';
import { TwitchMessage, tagsParser } from './tagsParser.ts';
import { logMessage } from './logMessage.ts';

export async function handleMessages(socket: WebSocket): Promise<void> {
  for await (const msg of socket) {
    switch (true) {
      case msg.toString().trim() === 'PING :tmi.twitch.tv':
        console.log(highlight(colours.cyan, 'ping'));
        await socket.send('PONG :tmi.twitch.tv');
        console.log(highlight(colours.green, 'pong'));
        break;
      case isWebSocketCloseEvent(msg):
        console.log(highlight(colours.red, `closed`));
        return;
      default:
        const tMsg: TwitchMessage = tagsParser(msg.toString());
        if (tMsg.command === 'PRIVMSG') logMessage(tMsg);
        else console.log(tMsg.raw);
    }
  }
}
