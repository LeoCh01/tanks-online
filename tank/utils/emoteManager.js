import { PP, ctx } from "../config.js";

export default class EmoteManager {
  static emotes = {
    1: { imagePath: "./res/emote1.png", audioPath: "./res/emote1.mp3" },
    2: { imagePath: "./res/emote2.png", audioPath: "./res/emote2.mp3" },
  };

  constructor() {
    this.emote = 0;
    this.count = 0;
    this.pos = { x: 0, y: 0 };
    this.image = new Image();
  }

  draw() {
    if (this.emote !== 0) {
      const emoteSize = PP(0.05);
      const emoteScale = Math.sin(Date.now() / 100) + PP(0.1);
      const emoteX = (-emoteSize / 2) * emoteScale + PP(this.pos.x);
      const emoteY = (-emoteSize / 2) * emoteScale + PP(this.pos.y);
      const emoteWidth = emoteSize * emoteScale;
      const emoteHeight = emoteSize * emoteScale;
      this.image.src = EmoteManager.emotes[this.emote].imagePath;

      ctx.drawImage(this.image, emoteX, emoteY, emoteWidth, emoteHeight);
    }
  }

  update(data) {
    this.emote = data.emote;
    this.count = data.count;
    this.pos = data.pos;
    this.playEmote(this.emote);
  }

  playEmote() {
    if (this.count === 99) {
      if (this.emote !== 0 && this.audio) {
        this.audio.pause();
        this.audio.currentTime = 0;
      }

      this.audio = new Audio(EmoteManager.emotes[this.emote].audioPath);
      this.audio.play();
    }
  }
}
