import {type Song} from "../customTypes.ts";

export function SongsList({songArray}:{songArray:Song[]}){
    return (
        <ol>
            {songArray.map((song, index) => (
                <li key={index}>
                    {song.title}
                </li>
            ))}
        </ol>
    );
}