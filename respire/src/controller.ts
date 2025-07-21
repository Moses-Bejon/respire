import {SongsModel} from "./songsModel.ts";
import {type Song} from "./customTypes.ts";

class Controller{
    private readonly antiRepetitionBias: number;
    private readonly currentSongSubscribers: Set<(song: Song) => void>;
    private songsModel: SongsModel;
    private currentSong: Song;
    private readonly audioSource: HTMLAudioElement;

    constructor() {

        this.antiRepetitionBias = 1;

        this.songsModel = new SongsModel();
        this.currentSong = this.songsModel.pickSong(this.antiRepetitionBias);

        this.audioSource = new Audio(this.currentSong.source);

        this.audioSource.addEventListener("ended",() => {
            this.requestNewSong();
        });

        this.audioSource.play();

        this.currentSongSubscribers = new Set();
    }

    public subscribeToCurrentSong(setSong: (song: Song) => void):() => void{
        this.currentSongSubscribers.add(setSong);
        setSong(this.currentSong);

        return () => {
            this.currentSongSubscribers.delete(setSong);
        };
    }

    // called by views to request a new song, i.e. if song finishes or user skips
    public requestNewSong():void{

        this.currentSong = this.songsModel.pickSong(this.antiRepetitionBias);

        this.audioSource.src = this.currentSong.source;
        this.audioSource.play();

        for (const subscriber of this.currentSongSubscribers){
            subscriber(this.currentSong)
        }
    }

    public uploadNewSong(songFile:File):void{

        const reader = new FileReader();

        reader.onload = () => {
            const newSong:Song = {
                title: "newSong",
                sourceFormat: "mp3",
                source: reader.result as string
            };

            this.songsModel.addSong(newSong);
        }

        reader.readAsDataURL(songFile);
    }
}

export const controller = new Controller();

console.log(controller);