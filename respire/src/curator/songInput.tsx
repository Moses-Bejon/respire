import {useState,useEffect,useRef} from 'react';
import {FileInput} from './fileInput';
import type {Song, sourceFormat} from '../customTypes.ts';
import {SongsList} from "./songsList.tsx";
import {getUniqueStringWithPrefix} from "../lib/strings.ts";
import {controller} from "../controller.ts";
import "./songInput.css";

export function SongInput() {
    const [selectedSource, setSelectedSource] = useState<sourceFormat>('local');
    const [uploads, setUploads] = useState<Song[]>([]);
    const uploadsRef = useRef(uploads);

    useEffect(() => {
        uploadsRef.current = uploads;
    },[uploads]);

    const getNewUploads = (
        title:string,
        sourceFormat:sourceFormat,
        source:string,
        currentUploads:Song[]
    ):Song[] => {
        const newSong = {
            title: getUniqueStringWithPrefix(title,currentUploads.map((song) => song.title)),
            sourceFormat: sourceFormat,
            source: source
        };

        return [...currentUploads, newSong];
    }

    const uploadLocal = (source: File, title?: string):void => {

        if (!title){
            // if no specific title given, use file name without the .mp3/.wav etc. bit
            title = source.name.slice(0,source.name.lastIndexOf('.'));
        }

        const reader = new FileReader();

        reader.onload = () => {
            setUploads(prevState => {
                return getNewUploads(title, "local", reader.result as string, prevState);
            })
        }

        reader.readAsDataURL(source);
    }

    const [youtubeUrl,setYoutubeUrl] = useState<string>('');

    const uploadYoutube = ():void => {
        let source: string;
        try {
            source = new URL(youtubeUrl).searchParams.get("v") as string

            if (source === null){
                source = new URL(youtubeUrl).pathname.split('/').pop() as string;
            }
        } catch (error) {
            console.error("Could not parse URL: ",youtubeUrl);
            window.alert("Could not parse URL, check the URL entered matches the example: https://www.youtube.com/watch?v=dQw4w9WgXcQ.");
            return;
        }

        if (source === null){
            console.error("Could not find video ID in URL: ",youtubeUrl);
            window.alert("Could not find video ID in URL. Check the URL entered matches the example: https://www.youtube.com/watch?v=dQw4w9WgXcQ.");
            return;
        }

        window.youtubeInfoGrabber.cueVideoById(source);

        waitForState(-1).then(() => {
            setUploads(prevState => {
                return getNewUploads(window.youtubeInfoGrabber.videoTitle,"youtube",source,prevState);
            })
            setYoutubeUrl("");
        }).catch((error) => {
            console.error("Could not find video/playlist with URL. Youtube error code: ",error);
            window.alert(`The URL entered is valid but we could not find the video. Ensure the video is not private, unlisted, or been mistyped.`);
        })
    }

    const uploadYoutubePlaylist = async (): Promise<void> => {

        let source: string;
        try {
            source = new URL(youtubeUrl).searchParams.get("list") as string;
        } catch (error) {
            console.error("Could not parse URL: ",youtubeUrl);
            window.alert("Could not parse URL, check the URL entered matches the example: https://www.youtube.com/watch?v=KNZbaP3bhk0&list=PLU1XqNAUBP5XIc3y7DemzqmLXqvyH3f37.");
            return;
        }

        if (source === null){
            console.error("Could not find playlist ID in URL: ",youtubeUrl);
            window.alert("Could not find playlist ID in URL. Check the URL entered matches the example: https://www.youtube.com/watch?v=KNZbaP3bhk0&list=PLU1XqNAUBP5XIc3y7DemzqmLXqvyH3f37. It should have 'list=PL' in it.");
            return;
        }

        window.youtubeInfoGrabber.cuePlaylist({listType: "playlist", list: source});

        try {
            await waitForState(5);
        } catch (error) {
            console.error("Could not find playlist with URL: ",youtubeUrl);
            window.alert(`The URL entered is valid but we could not find the playlist. Ensure the playlist is not private, unlisted, or been mistyped.
If this is a personal playlist, procured by yourself, it is quite likely to be private. You can upload it by: 
- Fist making it public, see: https://support.google.com/youtube/answer/3127309
- Come back to the curate tab and click "find playlist at URL" again
- Once it is successfully uploaded, you can safely make it private again`);
            return;
        }

        let playlist = window.youtubeInfoGrabber.getPlaylist();
        playlist = window.youtubeInfoGrabber.getPlaylist();

        if (playlist === null){
            console.error("Could not find playlist with URL: ",youtubeUrl);
            window.alert(`Something went wrong while trying to find the playlist. You could try refreshing and trying again.`);
            return;
        }

        if (playlist.length === 200){
            window.alert("This playlist has more than 200 songs, which (for some reason) means YouTube will only fetch me the first 200 videos. There's probably a hacky way I can work around this, but for now I'm just going to upload the first 200 videos. Press the clear button if this is undesirable.");
        }

        for (let i = 0; i < playlist.length; i++){

            setYoutubeUrl("");

            window.youtubeInfoGrabber.cueVideoById(playlist[i]);

            try {
                await waitForState(5);
            } catch (error) {
                console.error(`Failed to wait for state on playlist item ${i}:`, error);
                continue;
            }

            setUploads(prevState => {
                return getNewUploads(window.youtubeInfoGrabber.videoTitle,"youtube",playlist[i],prevState);
            })
        }
    }

    const waitForState = (state:number):Promise<void> => {

        return new Promise(
            (resolve, reject) => {

                let subscriber : {"onError": (errorCode:number) => void, "onStateChange": (newState:number) => void}

                const timeoutID = setTimeout(() => {
                    window.infoGrabberSubscribers.delete(subscriber);
                    reject("Timeout: State change did not occur within 1 second");
                }, 1000);

                subscriber = {
                    "onError": (errorCode:number) => {
                        window.infoGrabberSubscribers.delete(subscriber);
                        clearTimeout(timeoutID);
                        reject(errorCode);
                    },
                    "onStateChange": (newState:number) => {
                        if (newState === state){
                            window.infoGrabberSubscribers.delete(subscriber);
                            clearTimeout(timeoutID);
                            resolve();
                        }
                    }
                };

                window.infoGrabberSubscribers.add(subscriber);
            }
        )
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
    },[]);

    return (
        <div className="songInput">

            Upload from:
            <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value as sourceFormat)}
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
                    <button onClick={uploadYoutubePlaylist}>Find playlist at URL</button>
                </div>
            )}
            {selectedSource === 'spotify' && (
                <p>Spotify upload option - Coming soon</p>
            )}

            <br />
            <br />

            <SongsList songArray={uploads} deleteSongIndex={deleteSongIndex} updateSongAtIndex={updateSongAtIndex}/>

            {uploads.length > 0 && <div className="buttons">
                <button className={"finishUploadButton"} onPointerDown={sendToController}>Finish upload</button>
                <button className={"clearButton"} onPointerDown={() => setUploads([])}>Clear</button>
            </div>}

        </div>
    )
}