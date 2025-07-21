import {useEffect, useState} from "react";
import "../app.css";
import { controller } from "../controller.ts";
import type {Song} from "../customTypes.ts";
import {threeSecondSilence} from "../../public/silence.ts";

export function Player(){
    const [song,setSong] = useState<Song>(threeSecondSilence);

    useEffect(() => {
        return controller.subscribeToCurrentSong(setSong);
    },[]);

    return (
        <>
            <p>Press to go to next song:</p>
            <button onClick={() => controller.requestNewSong()}>
                {" "}
                title is {song.title}
            </button>
        </>
    );
}
