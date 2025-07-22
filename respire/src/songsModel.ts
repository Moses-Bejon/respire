import {type Song} from "./customTypes.ts";
import {threeSecondSilence} from "../public/silence.ts";
import {getUniqueStringWithPrefix} from "./lib/strings.ts";

export class SongsModel{
    private readonly songs:Song[];
    private readonly songProbabilities:number[];
    private numberOfSongs: number;

    constructor() {
        this.songs = [];
        this.numberOfSongs = this.songs.length;
        this.songProbabilities = Array(this.numberOfSongs).fill(1);
    }

    public addSong(song:Song):void{

        // ensures no two titles are the same
        song.title = getUniqueStringWithPrefix(song.title,this.songs.map((song) => song.title));

        this.songs.push(song);
        this.numberOfSongs ++;
        this.songProbabilities.push(1);
    }

    public pickSong(antiRepetitionBias:number):Song{

        // if no songs are uploaded
        if (this.numberOfSongs === 0){
            console.error("No songs uploaded");
            return threeSecondSilence;
        }

        let sum = this.songProbabilities.reduce((a:number,b:number)=> {return a+b},0);

        // if for some reason all have zero probability, force a reset
        if (sum === 0){
            this.songProbabilities.fill(1);
            sum = this.numberOfSongs
        }

        let steps = Math.random()*sum;

        let chosenSongIndex = 0;

        // take the number of steps generated
        while (steps >= 0){
            steps -= this.songProbabilities[chosenSongIndex];
            chosenSongIndex ++;
        }

        // we overshot since we waited for it to be negative
        chosenSongIndex --;

        // if a song was not found
        if (this.songs[chosenSongIndex] === undefined){
            console.error("No suitable song available (not enough songs uploaded is likely the reason)");
            return threeSecondSilence;
        }

        // makes other songs more likely after picking a song
        // you'd rather not hear the same song over and over
        for (let i = 0; i<chosenSongIndex;i++){
            this.songProbabilities[i] += antiRepetitionBias;
        }
        for (let i = chosenSongIndex+1; i<this.numberOfSongs;i++){
            this.songProbabilities[i] += antiRepetitionBias;
        }

        // this ensures the same song never plays twice:
        this.songProbabilities[chosenSongIndex] = 0;

        return this.songs[chosenSongIndex];
    }

    public getSongs():Song[]{
        return structuredClone(this.songs);
    }
}