import { useContext } from "react";
import { CountContext } from "./CountContext";

type PlayerProps = {
  count: number;
  // Add more prop-type pairs here, and just add the prop identifier to {} in function arguments
};

const songInfos = [
  {
    title: "Hello world",
  },
  {
    title: "Goodbye world",
  },
];

export function Player({ count }: PlayerProps) {
  return (
    <div>
      <CountContext value={count}>
        {count}th song playing
        <SongInfo />
      </CountContext>
    </div>
  );
}

type SongInfoProps = {
  count: number;
  // Add more prop-type pairs here, and just add the prop identifier to {} in function arguments
};
function SongInfo() {
  const count = useContext(CountContext);
  return (
    <div>
      {/* Will need a forEach or something for each piece of info */}
      Title: {songInfos[count].title}
    </div>
  );
}

// function
