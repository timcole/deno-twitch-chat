import { WebSocket } from './deps.ts';
import { connect } from './connect.ts';
import { cli } from './stdin.ts';
import { handleMessages } from './handleMessages.ts';

const socket: WebSocket = await connect();

await Promise.race([handleMessages(socket), cli(socket)]).catch(console.error);
Deno.exit(0);
