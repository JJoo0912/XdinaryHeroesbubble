# Fan Bubble Archive

GitHub Pages-friendly static site that mimics the Bubble app style for archiving idol chats.

## How to use
1. Replace profile / background images in **images/** with your own. Use the naming:
   - Gunil_profile.jpg
   - Gunil_background.jpg
   - (repeat for each member)
2. Edit chat JSON in **data/{Member}.json**. Format:

```json
[
  {"from":"artist","text":"메시지","time":"15:21","date":"2025-07-01"},
  {"from":"fan","text":"답장!","time":"15:22","date":"2025-07-01"}
]
```

- `from` = "artist" or "fan"
- `text` = message text
- optional `time` (string)
- optional `date` (YYYY-MM-DD) to insert date separator

3. Upload everything to your GitHub repo root. Enable GitHub Pages (Settings > Pages > Deploy from branch > main /root).

Open: https://USERNAME.github.io/REPONAME/

Enjoy!
