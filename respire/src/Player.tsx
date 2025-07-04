import { useContext } from "react";
import { TitleContext } from "./TitleContext.ts";

type PlayerProps = {
  title: string;
  // Add more prop-type pairs here, and just add the prop identifier to {} in function arguments
};

export function Player({ title }: PlayerProps) {
  return (
    <div>
      <TitleContext value={title}>
        {title} is playing
        <SongInfo />
      </TitleContext>
    </div>
  );
}

function SongInfo() {
  const title = useContext(TitleContext);
  return (
    <div>
      {/* Will need a forEach or something for each piece of info */}
      Title: {title}
    </div>
  );
}

// function
