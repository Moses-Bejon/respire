import {controller} from "../controller.ts";
import {SongsList} from "./songsList.tsx";
import type {Song, SongsFile} from "../customTypes.ts";
import {useState,useEffect} from "react";
import {SongInput} from "./songInput.tsx";
import "./curator.css";
import {FILE_PLACEHOLDER} from "../globalConstants.ts";

export function Curator() {

    const [songList,setSongList] = useState<Song[]>([]);

    useEffect(() => {
        return controller.subscribeToAllSongs(setSongList);
    }, []);

    const [currentFile,setCurrentFile] = useState(
        FILE_PLACEHOLDER as SongsFile
    );

    useEffect(() => {
        return controller.subscribeToCurrentFile(setCurrentFile);
    }, []);

    return (
        <div className="curator view">
            <h1>Songs to upload:</h1>
            <SongInput />
            <h1>Songs uploaded to {currentFile.name}:</h1>
            <SongsList
                songArray={songList}
                deleteSongIndex={controller.deleteSongIndex.bind(controller)}
                updateSongAtIndex={controller.updateSongAtIndex.bind(controller)}
                connectedToController={true}
            />
        </div>
    )
}