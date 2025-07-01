import { useState } from "react";
import "./countApp.css";

import { controller } from "./controller.ts";
import { Player } from "./Player.tsx";
import { View } from "./view.ts";

export class PlayerView extends View {
  private readonly currentCount: number;

  constructor() {
    super();
    this.currentCount = controller.subscribeToCount(this);
  }

  public App() {
    const [count, setCount] = useState(this.currentCount);

    this.useNewSetter("count", setCount);

    return (
      <>
        <p>Counter to increase song being played:</p>
        <button onClick={() => controller.increment()}>
          {" "}
          count is {count}
        </button>
        <Player count={count} />
      </>
    );
  }

  public newCount(count: number) {
    this.setState("count", count);
  }
}
