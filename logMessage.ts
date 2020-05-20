import { TwitchMessage, TwitchMessageEmote } from './tagsParser.ts';
import { image } from './images.ts';
import { highlight } from './colour.ts';

export async function logMessage(msg: TwitchMessage): Promise<void> {
  if (!msg.data.message) return;

  let characters: string[] = msg.data.message.split('');

  if (msg.data.emotes) {
    await Promise.all(
      Object.keys(msg.data.emotes).map((id: string) =>
        fetch(`http://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0`)
      )
    ).then(
      async (responses) =>
        await Promise.all(
          responses.map(async (res) => {
            if (!msg.data.emotes) return;
            const code = res.url.split('/')[5];
            msg.data.emotes[code].image = image(await res.arrayBuffer(), {
              height: 1,
              width: 'auto',
            });
          })
        )
    );

    Object.keys(msg.data.emotes).map((emote) => {
      const emoteData: TwitchMessageEmote | undefined =
        msg.data.emotes?.[emote];
      emoteData?.indices.map((indice: number[]) => {
        characters[indice[0]] = emoteData?.image || '';
        characters = characters.map((v, i) =>
          indice[0] < i && indice[1] + 1 > i ? '' : v
        );
      });
    });
  }

  msg.data.message = characters.join('');
  const time: string = `${msg.data.created_at?.getHours()}:${msg.data.created_at?.getMinutes()}:${msg.data.created_at?.getSeconds()}`;

  console.log(
    `[${time}]`,
    highlight(msg.data.color || '#BAD455', msg.data.display_name || ''),
    msg.data.message
  );
}
