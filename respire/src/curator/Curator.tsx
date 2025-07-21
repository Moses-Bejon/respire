import {FileInput} from "./fileInput.tsx";
import {controller} from "../controller.ts";
import {SongsList} from "./songsList.tsx";
import type {Song} from "../customTypes.ts";
import {useState,useEffect} from "react";

export function Curator() {

    const [songList,setSongList] = useState<Song[]>([]);

    useEffect(() => {
        return controller.subscribeToAllSongs(setSongList);
    }, []);

    return (
        <>
            <SongsList songArray={songList} />
            <FileInput
                uploadName="audio file"
                fileUploadCallback={controller.uploadNewSong.bind(controller)}
                accept="audio/*"
            />
        </>
    )
}