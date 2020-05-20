interface ImageOptions {
  // Defaults to "Unnamed file".
  name?: string;
  // File size in bytes. The file transfer will be canceled if this size is exceeded.
  size?: number;
  width?: number | string | 'auto';
  height?: number | string | 'auto';
  preserveAspectRatio?: boolean;
  inline?: boolean;
}

export function image(buffer: ArrayBuffer, options: ImageOptions): string {
  let args = `inline=${options.inline === false ? 0 : 1}`;
  if (options.name) args += `;name=${btoa(options.name)}`;
  if (options.size) args += `;name=${options.size}`;
  if (options.width) args += `;width=${options.width}`;
  if (options.height) args += `;height=${options.height}`;
  if (!options.preserveAspectRatio) args += ';preserveAspectRatio=0';

  let binary: string = '';
  var bytes: number[] = [].slice.call(new Uint8Array(buffer));
  bytes.forEach((b) => (binary += String.fromCharCode(b)));

  return `\u001B]1337;File=${args}:${btoa(binary)}\u0007`;
}

if (import.meta.main) {
  const ffzEmotes = await fetch(
    `https://api.frankerfacez.com/v1/room/modesttim`
  ).then((data) => data.json());

  for await (const emote of ffzEmotes.sets['37097'].emoticons) {
    const imageBuffer = await fetch(`https:${emote.urls['1']}`).then((data) =>
      data.arrayBuffer()
    );

    console.log(emote.name, image(imageBuffer, { height: 1 }), emote.id);
  }
}
