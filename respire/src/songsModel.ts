import {type File,type Song} from "./customTypes.ts";

// file is here for now, in the future it will be loaded in through a JSON
// this presents the issue that the source field will need to be updated
// it will have to hold the raw data rather than the path
// I will get round to this later
export const file:File = {
    "version":0,
    "songs":[
        {"title":"A Strange Fellow","sourceFormat":"mp3","source":"./testSongs/A Strange Fellow.mp3"},
        {"title":"Grand Quirky Adventure","sourceFormat":"mp3","source":"./testSongs/Grand Quirky Adventure.mp3"},
        {"title":"The Village","sourceFormat":"mp3","source":"./testSongs/The Village.mp3"},
        {"title":"Woods of Camelot","sourceFormat":"mp3","source":"./testSongs/Woods of Camelot.mp3"},
        {"title":"Yarrh","sourceFormat":"mp3","source":"./testSongs/Yarrh.mp3"},
        {"title":"Ye Olde Murky Maggot Inn","sourceFormat":"mp3","source":"./testSongs/Ye Olde Murky Maggot Inn.mp3"}
    ]
}

export class SongsModel{
    private readonly songs:Song[]
    private readonly songProbabilities:number[]
    private numberOfSongs: number

    constructor(file:File) {
        this.songs = file.songs
        this.numberOfSongs = this.songs.length
        this.songProbabilities = Array(this.numberOfSongs).fill(1)
    }

    pickSong(antiRepetitionBias:number){
        const sum = this.songProbabilities.reduce((a:number,b:number)=> {return a+b},0)

        let steps = Math.random()*sum

        let chosenSongIndex = 0

        // take the number of steps generated
        while (steps >= 0){
            steps -= this.songProbabilities[chosenSongIndex]
            chosenSongIndex ++
        }

        // we overshot since we waited for it to be negative
        chosenSongIndex --

        // makes other songs more likely after picking a song
        // you'd rather not hear the same song over and over
        for (let i = 0; i<chosenSongIndex;i++){
            this.songProbabilities[i] += antiRepetitionBias
        }
        for (let i = chosenSongIndex+1; i<this.numberOfSongs;i++){
            this.songProbabilities[i] += antiRepetitionBias
        }

        // this ensures the same song never plays twice:
        this.songProbabilities[chosenSongIndex] = 0

        return this.songs[chosenSongIndex]
    }
}