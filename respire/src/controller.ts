import {SongsModel} from "./songsModel.ts";
import {type Song} from "./customTypes.ts";

// for the youtube player API:
const [UNSTARTED, ENDED, PLAYING, PAUSED, BUFFERING] = [-1,0,1,2,3]

class Controller{
    private readonly antiRepetitionBias: number;
    private readonly currentSongSubscribers: Set<(song: Song) => void>;
    private readonly allSongsSubscribers: Set<(songs: Song[]) => void>;
    private readonly playingSubscribers: Set<(playing: boolean) => void>;
    private songsModel: SongsModel;
    private currentSong: Song;
    private readonly audioSource: HTMLAudioElement;
    private isPlaying: boolean = false;
    private currentMode: "local" | "youtube" = "local";

    constructor() {

        this.antiRepetitionBias = 1;

        this.songsModel = new SongsModel();
        this.currentSong = this.songsModel.pickSong(this.antiRepetitionBias);

        this.audioSource = new Audio(this.currentSong.source);

        this.audioSource.addEventListener("ended",() => {
            this.requestNewSong();
        });

        this.play();

        this.currentSongSubscribers = new Set();
        this.allSongsSubscribers = new Set();
        this.playingSubscribers = new Set();
    }

    public play():void{
        if (this.currentMode === "youtube"){
            window.youtubePlayer.playVideo();

            if (!this.audioSource.paused){
                this.audioSource.pause();
            }

            this.isPlaying = true;
            this.updatePlaying();
        } else {

            if (window.youtubePlayer.getPlayerState !== undefined && [BUFFERING,PLAYING].includes(window.youtubePlayer.getPlayerState())){
                window.youtubePlayer.stopVideo();
            }

            this.audioSource.play().then(
                () => {
                    this.isPlaying = true;
                    this.updatePlaying();
                }
            ).catch((error) => {
                this.isPlaying = false;
                this.updatePlaying();

                // if autoplay disabled, wait for user interaction before autoplaying
                if (error.name === "NotAllowedError"){
                    document.addEventListener("click",() => {
                        this.play();
                    }, {once: true})
                }
            });
        }
    }

    public pause():void{
        if (this.currentMode === "youtube"){
            window.youtubePlayer.pauseVideo();
        } else {
            this.audioSource.pause();
        }
        this.isPlaying = false;
        this.updatePlaying();
    }

    public currentlyPlaying():boolean{
        return this.isPlaying;
    }

    public subscribeToPlaying(setPlaying: (playing: boolean) => void):() => void{
        this.playingSubscribers.add(setPlaying);
        setPlaying(this.isPlaying);

        return () => {
            this.playingSubscribers.delete(setPlaying);
        };
    }

    private updatePlaying():void{
        for (const subscriber of this.playingSubscribers){
            subscriber(this.isPlaying);
        }
    }

    public getTimestamp():number{
        if (this.currentMode === "youtube"){
            return window.youtubePlayer.getCurrentTime();
        } else {
            return this.audioSource.currentTime;
        }
    }

    public getDuration():number{
        if (this.currentMode === "youtube"){
            return window.youtubePlayer.getDuration();
        } else {
            return this.audioSource.duration;
        }
    }

    public seekTo(timestamp:number):void{
        if (this.currentMode === "youtube"){
            window.youtubePlayer.seekTo(timestamp,true);
        } else {
            this.audioSource.currentTime = timestamp;
        }
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

        if (this.currentSong.sourceFormat === "local") {
            this.audioSource.src = this.currentSong.source;
            this.currentMode = "local";
        } else {
            window.youtubePlayer.loadVideoById(this.currentSong.source);
            this.currentMode = "youtube";
        }

        this.play()

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

    // this function essentially ensures that the youtube player's state aligns with the controller's
    public youtubePlayerChangedState(state:number):void{
        if (this.currentMode !== "youtube"){
            if ([PLAYING,BUFFERING].includes(state)){
                window.youtubePlayer.stopVideo();
            }
            return;
        }

        if (this.isPlaying){
            if ([PAUSED,UNSTARTED].includes(state)){
                window.youtubePlayer.playVideo();
            }
            if (state === BUFFERING){
                // TODO: tell the user it's buffering
            }
        } else {
            if ([PLAYING,BUFFERING].includes(state)){
                window.youtubePlayer.pauseVideo();
            }
        }

        if (state === ENDED){
            this.requestNewSong();
        }
    }
}

export const controller = new Controller();
window.youtubePlayerSubscribers.add(controller.youtubePlayerChangedState.bind(controller));

console.log(controller);