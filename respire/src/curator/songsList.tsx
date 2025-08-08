import {type Song} from "../customTypes.ts";
import {EntryList} from "../components/entryList.tsx";
import {controller} from "../controller.ts";
import {useState,useEffect} from "react";
import {SONG_PLACEHOLDER} from "../globalConstants.ts";

export function SongsList({songArray, deleteSongIndex, updateSongAtIndex, connectedToController = false}:
                          {
                              songArray:Song[],
                              deleteSongIndex: (index:number) => void,
                              updateSongAtIndex: <K extends keyof Song>(index:number,attribute:K,value:Song[K]) => void,
                              connectedToController?:boolean;
                          }){
    
    const [currentSong,setCurrentSong] = useState(SONG_PLACEHOLDER);
    useEffect(() => {
        return controller.subscribeToCurrentSong(setCurrentSong);
    },[])

    return (
        <EntryList
            entries={songArray.map((song:Song) => {return [song.title]})}
            deleteEntryAtIndex={deleteSongIndex}
            updateEntryAtIndex={(index:number,attribute:number,newValue:string) => {

                if (attribute !== 0){
                    throw new Error("attribute must be 0, as only one attribute is passed in");
                }

                updateSongAtIndex(index,"title",newValue);
            }}

            {...(connectedToController && {
                playEntryAtIndex: controller.playSongAtIndex.bind(controller),
                indexPlaying: songArray.findIndex((song) => song.title === currentSong.title)
            })}
        />
    );
}