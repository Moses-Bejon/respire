// as new states are added, this needs to be extended, i.e. "title"|...
export type StateIdentifier = "title"
export type SetStateMethods = {
    [Key in StateIdentifier]?: Function;
};

// as new views which subscribe to the current song are added, this will be extended
import {type PlayerView} from "./playerView.tsx";
export type CurrentSongSubscriber = PlayerView

export type Song = {
    title: string
    sourceFormat: "mp3"|"youtube"|"spotify"
    source: string
}

export type File = {
    version: number
    songs: Song[]
}