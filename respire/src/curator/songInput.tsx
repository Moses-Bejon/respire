import {useState} from 'react';
import {FileInput} from './fileInput';
import type {Song} from '../customTypes.ts';
import {SongsList} from "./songsList.tsx";
import {getUniqueStringWithPrefix} from "../lib/strings.ts";
import {controller} from "../controller.ts";

export function SongInput() {
    const [selectedSource, setSelectedSource] = useState<'local' | 'youtube' | 'spotify'>('local');
    const [uploads, setUploads] = useState<Song[]>([]);

    const uploadLocal = (source: File, title?: string):void => {

        if (!title){
            // if no specific title given, use file name without the .mp3/.wav etc. bit
            title = source.name.slice(0,source.name.lastIndexOf('.'));
        }

        const reader = new FileReader();

        reader.onload = () => {
            setUploads(prevState => {
                const newSong: Song = {
                    title: getUniqueStringWithPrefix(title,prevState.map((song) => song.title)),
                    sourceFormat: "local",
                    source: reader.result as string
                };

                return [...prevState, newSong];
            })
        }

        reader.readAsDataURL(source);
    }

    const deleteSongIndex = (index:number):void => {
        setUploads((prevState) => {
            const newSongs = [...prevState];
            newSongs.splice(index,1);
            return newSongs;
        })
    }

    const updateSongAtIndex = <K extends keyof Song>(index:number,attribute:K,value:Song[K]):void => {
        setUploads((prevState) => {
            const newSongs = [...prevState];
            newSongs[index][attribute] = value;
            return newSongs;
        })
    }

    const sendToController = ():void => {
        for (const song of uploads){
            controller.uploadNewSong(song);
        }

        setUploads([]);
    }

    return (
        <div className="songInput">
            <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value as 'local' | 'youtube' | 'spotify')}
            >
                <option value="local">Upload from Computer</option>
                <option value="youtube">Upload from YouTube</option>
                <option value="spotify">Upload from Spotify</option>
            </select>

            {selectedSource === 'local' && (
                <FileInput
                    uploadName="audio file"
                    fileUploadCallback={uploadLocal}
                    accept="audio/*"
                />
            )}
            {selectedSource === 'youtube' && (
                <p>YouTube upload option - Coming soon</p>
            )}
            {selectedSource === 'spotify' && (
                <p>Spotify upload option - Coming soon</p>
            )}

            <SongsList songArray={uploads} deleteSongIndex={deleteSongIndex} updateSongAtIndex={updateSongAtIndex}/>

            <button onClick={sendToController}>Upload</button>

        </div>
    )
}