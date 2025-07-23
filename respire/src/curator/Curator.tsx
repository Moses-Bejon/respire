import {controller} from "../controller.ts";
import {SongsList} from "./songsList.tsx";
import type {Song} from "../customTypes.ts";
import {useState,useEffect} from "react";
import {SongInput} from "./songInput.tsx";
import "./curator.css";

export function Curator() {

    const [songList,setSongList] = useState<Song[]>([]);

    useEffect(() => {
        return controller.subscribeToAllSongs(setSongList);
    }, []);

    return (
        <div className={"curator"}>
            <h1>Songs to upload:</h1>
            <SongInput />
            <h1>Songs uploaded:</h1>
            <SongsList
                songArray={songList}
                deleteSongIndex={controller.deleteSongIndex.bind(controller)}
                updateSongAtIndex={controller.updateSongAtIndex.bind(controller)}
            />
        </div>
    )
}