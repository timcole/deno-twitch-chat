# Deno Twitch Chat Console Client

---

### Information and Disclaimer
This is a Twitch chat client that was created to play around with Deno 1.0.  
Being developed in iTerm2 without being tested in other terminals.  
This project utilizes true-colours and inline images to show username colours as well as twitch emotes.  
Currently only supports native Twitch Emotes  

*This is in heavy development*

### Plans to add/change
- [ ] FFZ Emotes
- [ ] BTTV Emotes
- [ ] settings support for things like turning off emote and/or colour support.
- [ ] login support (currently just uses anon user *justinfan123*)
- [ ] channel buffers to have tabbed chats
- [ ] state saver so we can reopen last opened chats
- [ ] Vim like status line w/ commands (currently only `:q` to quit)

### Run
```
deno run --allow-net --allow-run=stty main.ts
```

---

### Screenshots

[![Screenshot in jinnytty's chats. Shows actual colours and emotes](https://i.imgur.com/TpaJ33I.png)](https://twitter.com/ModestTim/status/1262793348554698753/photo/1)
