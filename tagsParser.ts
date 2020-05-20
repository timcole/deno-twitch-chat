export interface TwitchMessage {
  raw: string;
  prefix?: string;
  command?: string;
  params?: string[];
  trailing?: string;
  data: TwitchMessageData;
}

export interface TwitchMessageData {
  // PRIVMSG
  display_name?: string;
  user_id?: string;
  streamer_name?: string;
  streamer_id?: string;
  user_type?: TwitchMessageUserType;
  created_at?: Date;
  bits?: number;
  message?: string;
  arguments?: string[];
  color?: string;
  badges?: string[];
  emotes?: TwitchMessageEmotes;

  // USERNOTICE
  notice_type?: string;
  system_message?: string;
}

export interface TwitchMessageUserType {
  broadcaster?: boolean;
  moderator?: boolean;
  staff?: boolean;
  subscriber?: boolean;
}

export interface TwitchMessageEmotes {
  [emote_id: string]: TwitchMessageEmote;
}

export interface TwitchMessageEmote {
  indices: number[][];
  image?: string;
}

export function tagsParser(raw: string): TwitchMessage {
  raw = raw.trim();
  let msg: TwitchMessage = {
    raw,
    data: {},
  };

  let parts: string[] = raw.split(' :');
  if (parts.length >= 2) {
    msg.prefix = parts[1].substr(0);
  }

  // System message
  if (raw.startsWith(':')) {
    parts = raw.split(' ', 2);
    msg.prefix = parts[0].substr(0);
    raw = parts[1];
  }

  parts = raw.split(' ');
  parts = [parts[0], parts[1], parts[2], parts.slice(3).join(' ')];
  msg.command = parts[0];

  raw = parts.slice(0).join(' ');
  if (msg.command.startsWith('@')) {
    msg.command = parts[2];
    raw = parts.slice(1).join(' ');

    msg.data.streamer_name = parts[3].substr(1);
    msg.data.user_type = {
      broadcaster: msg.data.streamer_name === msg?.prefix?.split('!', 2)[0],
    };

    for (const tag of parts[0].slice(1).split(';')) {
      const tagKV: any[] = tag.split('=', 2);
      var skipSet: boolean = false;

      switch (tagKV[0]) {
        // if no display name set it to the nick.
        // display names are optional on twitch so this makes it easier
        case 'display-name':
          tagKV[1] = tagKV[1] || msg?.prefix?.split('!', 2)[0] || '';
          break;

        // Parse user types
        case 'user-type':
          var { skipSet, userType } = parseUserType('staff', tagKV[1], 'staff');
          break;
        case 'mod':
          var { skipSet, userType } = parseUserType('moderator', tagKV[1], '1');
          break;
        case 'subscriber':
          var { skipSet, userType } = parseUserType(
            'subscriber',
            tagKV[1],
            '1'
          );
          break;

        case 'tmi-sent-ts':
          tagKV[0] = 'created_at';
          tagKV[1] = new Date(Number(tagKV[1]));
          break;

        case 'room-id':
          tagKV[0] = 'streamer_name';
          break;

        case 'badges':
          tagKV[1] = tagKV[1].split(',');
          break;
        case 'emotes':
          if (!tagKV[1]) break;
          let emotes: TwitchMessageEmotes = {};
          tagKV[1].split('/').map((emote: string) => {
            const emoteData = emote.split(':');
            const code = emoteData[0];
            const indices = emoteData[1].split(',');
            const startEnd = indices.map((indice) =>
              indice.split('-').map((s) => Number(s))
            );
            emotes[code] = { indices: startEnd };
          });
          tagKV[1] = emotes;
          break;
      }

      // Update Data
      if (skipSet && userType)
        msg.data.user_type = { ...msg.data.user_type, ...userType };
      else if (!skipSet)
        msg.data = { ...msg.data, [tagKV[0].replace(/-/g, '_')]: tagKV[1] };
    }
  }

  if (!msg.raw.startsWith(':')) {
    parts = raw.split(' :');
    msg.params = parts[0].split(' ');
    if (parts.length === 2) {
      raw = parts[1];
      msg.data.message = parts[1];
      msg.data.arguments = parts[1].split(' ');
    }
  }

  if (raw.length > 0) {
    if (raw.startsWith(':')) raw = raw.substr(1);
    msg.trailing = raw.trim();
  }

  return msg;
}

function parseUserType(
  key: string,
  value: string,
  expected: any
): { skipSet: boolean; userType: TwitchMessageUserType } {
  return {
    skipSet: true,
    userType: {
      [key]: value === expected,
    },
  };
}
