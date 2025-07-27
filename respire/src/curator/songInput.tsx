import {useState,useEffect,useRef} from 'react';
import {FileInput} from './fileInput';
import type {Song} from '../customTypes.ts';
import {SongsList} from "./songsList.tsx";
import {getUniqueStringWithPrefix} from "../lib/strings.ts";
import {controller} from "../controller.ts";
import "./songInput.css";

export function SongInput() {
    const [selectedSource, setSelectedSource] = useState<'local' | 'youtube' | 'spotify'>('local');
    const [uploads, setUploads] = useState<Song[]>([]);
    const uploadsRef = useRef(uploads);

    useEffect(() => {
        uploadsRef.current = uploads;
    },[uploads]);

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

    const [youtubeUrl,setYoutubeUrl] = useState<string>('');
    const lastSource = useRef<string>('');

    const uploadYoutube = ():void => {

        let source: string;
        try {
            source = new URL(youtubeUrl).searchParams.get("v") as string
        } catch (error) {
            console.error("Could not parse URL: ",youtubeUrl);
            window.alert("Could not parse URL, check the URL entered matches the example: https://www.youtube.com/watch?v=dQw4w9WgXcQ.");
            return;
        }

        if (source === null){
            console.error("Could not find video ID in URL: ",youtubeUrl);
            window.alert("Could not find video ID in URL, we do not support youtube shorts. Check the URL entered matches the example: https://www.youtube.com/watch?v=dQw4w9WgXcQ.");
            return;
        }

        window.youtubeInfoGrabber.cueVideoById(source);

        // the rest of the upload will be processed by event listeners, waiting for the player to load the video
        lastSource.current = source;
    }

    const handleYoutubeStateChange = (state:{target:any,data:number}):void => {

        setUploads(prevState => {

            // if the state is cued then we can read the title, hence we wait for 5 meaning cued
            // we also check that the source is not the source of a different upload
            // (we don't want to upload the same song twice)
            if (state.data === 5 && !(prevState.map(upload => upload.source)).includes(lastSource.current)){
                const newSong: Song = {
                    title: getUniqueStringWithPrefix(
                        window.youtubeInfoGrabber.videoTitle,
                        prevState.map((song) => song.title)
                    ),
                    sourceFormat: "youtube",
                    source: lastSource.current as string
                };

                return [...prevState, newSong];
            } else {
                return prevState;
            }
        })
    }

    const handleYoutubeError = (error:{target:any,data:number}):void => {
        console.error("Could not find video with URL. Youtube error code: ",error.data);
        window.alert("The URL entered is valid but we could not find the video. Ensure the video is not private, unlisted, or been deleted.");
    }

    const youtubeReady = useRef(false);

    const attachYoutubeListeners = () => {
        window.youtubeInfoGrabber.addEventListener("onStateChange", handleYoutubeStateChange);
        window.youtubeInfoGrabber.addEventListener("onError", handleYoutubeError);
    };

    useEffect(() => {
        const handleYoutubeReady = () => {
            youtubeReady.current = true;
            attachYoutubeListeners();
        };

        if (window.youtubeInfoGrabber?.getPlayerState) {
            handleYoutubeReady();
        } else {
            window.youtubeInfoGrabber.addEventListener("onReady", handleYoutubeReady,{once:true});
        }

        return () => {
            if (youtubeReady.current) {
                window.youtubeInfoGrabber.removeEventListener("onStateChange", handleYoutubeStateChange);
                window.youtubeInfoGrabber.removeEventListener("onError", handleYoutubeError);
            }
        }
    }, [youtubeReady]);

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

    // when dismounted, I will assume the user forgot to save their uploads and prompt them
    useEffect(() => {
        return () => {
            if (uploadsRef.current.length > 0){
                const shouldSend = window.confirm("You have unsaved uploads. Would you like to save them?");
                if (shouldSend) {
                    for (const song of uploadsRef.current){
                        controller.uploadNewSong(song);
                    }
                }
            }
        }
    },[])

    return (
        <div className="songInput">

            Upload from:
            <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value as 'local' | 'youtube' | 'spotify')}
            >
                <option value="local">Computer</option>
                <option value="youtube">YouTube</option>
                <option value="spotify">Spotify</option>
            </select>

            <br />
            <br />

            {selectedSource === 'local' && (
                <FileInput
                    uploadName="audio"
                    fileUploadCallback={uploadLocal}
                    accept="audio/*"
                />
            )}
            {selectedSource === 'youtube' && (
                <div className={"youtubeInput"}>
                    <input
                        type="text"
                        value={youtubeUrl}
                        placeholder="YouTube URL (e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                    />
                    <button onClick={uploadYoutube}>Find song at URL</button>
                </div>
            )}
            {selectedSource === 'spotify' && (
                <p>Spotify upload option - Coming soon</p>
            )}

            <br />
            <br />

            <SongsList songArray={uploads} deleteSongIndex={deleteSongIndex} updateSongAtIndex={updateSongAtIndex}/>

            <div className={"buttons"}>
                <button className={"finishUploadButton"} onPointerDown={sendToController}>Finish upload</button>
                <button className={"clearButton"} onPointerDown={() => setUploads([])}>Clear</button>
            </div>

        </div>
    )
}