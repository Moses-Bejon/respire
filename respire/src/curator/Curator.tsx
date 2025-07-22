import {controller} from "../controller.ts";
import {SongsList} from "./songsList.tsx";
import type {Song} from "../customTypes.ts";
import {useState,useEffect} from "react";
import {SongInput} from "./songInput.tsx";

export function Curator() {

    const [songList,setSongList] = useState<Song[]>([]);

    useEffect(() => {
        return controller.subscribeToAllSongs(setSongList);
    }, []);

    return (
        <>
            <h1>Upload a song:</h1>
            <SongInput />
            <h1>Songs already uploaded:</h1>
            <SongsList songArray={songList} />
        </>
    )
}