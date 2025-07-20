import {type CurrentSongSubscriber, type Song} from "./customTypes.ts";
import {SongsModel,file} from "./songsModel.ts";

class Controller{
    private readonly antiRepetitionBias: number;
    private readonly currentSongSubscribers: Set<CurrentSongSubscriber>;
    private songsModel: SongsModel;
    private currentSong: Song;
    private readonly audioSource: HTMLAudioElement;

    constructor() {

        this.antiRepetitionBias = 1;

        this.songsModel = new SongsModel(file);
        this.currentSong = this.songsModel.pickSong(this.antiRepetitionBias);

        this.audioSource = new Audio(this.currentSong.source);

        this.audioSource.addEventListener("ended",() => {
            this.requestNewSong();
        });

        this.audioSource.play();

        this.currentSongSubscribers = new Set();
    }

    public subscribeToCurrentSong(subscriber: CurrentSongSubscriber){
        this.currentSongSubscribers.add(subscriber);

        return this.currentSong;
    }

    public unsubscribeToCurrentSong(subscriber: CurrentSongSubscriber){
        this.currentSongSubscribers.delete(subscriber);
    }

    // called by views to request a new song, i.e. if song finishes or user skips
    public requestNewSong(){

        this.audioSource.src = this.currentSong.source;
        this.audioSource.play();

        this.currentSong = this.songsModel.pickSong(this.antiRepetitionBias);

        for (const subscriber of this.currentSongSubscribers){
            subscriber.newSong(this.currentSong);
        }
    }
}

export const controller = new Controller();

console.log(controller);