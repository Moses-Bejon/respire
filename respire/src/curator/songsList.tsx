import {type Song} from "../customTypes.ts";
import {SongEntry} from "./songEntry.tsx";

export function SongsList({songArray, deleteSongIndex, updateSongAtIndex}:
                          {
                              songArray:Song[],
                              deleteSongIndex: (index:number) => void,
                              updateSongAtIndex: <K extends keyof Song>(index:number,attribute:K,value:Song[K]) => void
                          }){

    return (
        <ol>
            {songArray.map((song, index) => (
                <li key={index}>
                    <SongEntry
                        song={song}
                        deleteCallback={() => {deleteSongIndex(index);}}
                        updateAttributeCallback={
                        <K extends keyof Song>(attribute:K, value:Song[K]) => {updateSongAtIndex(index,attribute,value);}}
                    />
                </li>
            ))}
        </ol>
    );
}