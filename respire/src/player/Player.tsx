import {useEffect, useState} from "react";
import { controller } from "../controller.ts";
import type {Song} from "../customTypes.ts";
import {threeSecondSilence} from "../../public/silence.ts";
import {PlayBar} from "./playBar.tsx";
import "./player.css";

export function Player(){
    const [song,setSong] = useState<Song>(threeSecondSilence);

    useEffect(() => {
        return controller.subscribeToCurrentSong(setSong);
    },[]);

    const [playing,setPlaying] = useState(false);

    useEffect(() => {
        return controller.subscribeToPlaying(setPlaying);
    }, []);

    useEffect(() => {

        const handleKeyDown = (event:KeyboardEvent):void => {
            if (event.key === " "){
                event.preventDefault();

                if (controller.currentlyPlaying()){
                    controller.pause();
                } else {
                    controller.play();
                }
            }
        }

        document.addEventListener("keydown",handleKeyDown)

        return () => document.removeEventListener("keydown",handleKeyDown);
    }, []);

    return (
        <div className={"player"}>
            <h1>{song.title}</h1>
            <img
                className={"coverArt"}
                src={"noCoverArtMeme.svg"}
                alt={"no cover art meme: this is where I would put my cover art... IF I HAD ANY!"}
            />
            <PlayBar />
            <div className={"buttons"}>

                {playing ?
                    <img
                        src={"icons/pause.svg"}
                        alt={"pause button"}
                        onPointerDown={controller.pause.bind(controller)}
                    /> :
                    <img
                        src={"icons/play.svg"}
                        alt={"play button"}
                        onPointerDown={controller.play.bind(controller)}
                    />
                }

                <img
                    src={"icons/skip.svg"}
                    alt={"To next song button"}
                    onPointerDown={() => controller.requestNewSong()}>
                </img>
            </div>
        </div>
    );
}
