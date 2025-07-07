import {useState} from "react";

import "./app.css";
import { controller } from "./controller.ts";
import { Player } from "./Player.tsx";
import { View } from "./view.ts";
import type {Song} from "./customTypes.ts";

export class PlayerView extends View {
  private readonly currentSong: Song;

  constructor() {
    super();
    this.currentSong = controller.subscribeToCurrentSong(this);
  }

  public App() {
    const currentTitle = this.currentSong.title;

    const [title, setTitle] = useState(currentTitle);

    this.useNewSetter("title", setTitle);

    return (
      <>
        <p>Press to go to next song:</p>
        <button onClick={() => controller.requestNewSong()}>
          {" "}
          title is {title}
        </button>
        <br />
        <br />
        <br />
        <Player title={title} />
      </>
    );
  }

  public newSong(song:Song){
      this.setState("title",song.title);
  }
}
