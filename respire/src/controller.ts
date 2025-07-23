import {SongsModel} from "./songsModel.ts";
import {type Song} from "./customTypes.ts";

class Controller{
    private readonly antiRepetitionBias: number;
    private readonly currentSongSubscribers: Set<(song: Song) => void>;
    private readonly allSongsSubscribers: Set<(songs: Song[]) => void>;
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
        this.allSongsSubscribers = new Set();
    }

    public subscribeToCurrentSong(setSong: (song: Song) => void):() => void{
        this.currentSongSubscribers.add(setSong);
        setSong(this.currentSong);

        return () => {
            this.currentSongSubscribers.delete(setSong);
        };
    }

    public subscribeToAllSongs(setSongs: (songs: Song[]) => void):() => void{
        this.allSongsSubscribers.add(setSongs);
        setSongs(this.songsModel.getSongs());

        return () => {
            this.allSongsSubscribers.delete(setSongs);
        };
    }

    private updateAllSongs():void{
        for (const subscriber of this.allSongsSubscribers){
            subscriber(this.songsModel.getSongs());
        }
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

    public uploadNewSong(song:Song):void{
        this.songsModel.addSong(song);
        this.updateAllSongs();
    }

    public deleteSongIndex(index:number):void{
        this.songsModel.deleteSongIndex(index);
        this.updateAllSongs();
    }

    public updateSongAtIndex<K extends keyof Song>(index:number,attribute:K,value:Song[K]){
        this.songsModel.updateSongAtIndex(index,attribute,value);
        this.updateAllSongs();
    }
}

export const controller = new Controller();

console.log(controller);