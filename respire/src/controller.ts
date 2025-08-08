import {SongsModel} from "./songsModel.ts";
import {type Song, type SongsFile} from "./customTypes.ts";
import {FilesModel} from "./filesModel.ts";
import {FILE_VERSION} from "./globalConstants.ts";

// for the youtube player API:
const [UNSTARTED, ENDED, PLAYING, PAUSED, BUFFERING,CUED] = [-1,0,1,2,3,5]

class Controller{
    private readonly antiRepetitionBias: number;
    private readonly currentSongSubscribers: Set<(song: Song) => void>;
    private readonly allSongsSubscribers: Set<(songs: Song[]) => void>;
    private readonly playingSubscribers: Set<(playing: boolean) => void>;
    private readonly currentFileSubscribers: Set<(file:SongsFile)=>void>;
    private readonly allFilesSubscribers: Set<(files:SongsFile[])=>void>;
    private filesModel: FilesModel;
    private songsModel: SongsModel;
    private currentSong: Song;
    private currentFile: SongsFile;
    private readonly audioSource: HTMLAudioElement;
    private isPlaying: boolean = false;
    private currentMode: "local" | "youtube" = "local";

    constructor() {

        this.antiRepetitionBias = 1;

        this.filesModel = new FilesModel();
        this.filesModel.addFile({
            "name": "your songs",
            "version": FILE_VERSION,
            "songs": []
        });

        this.currentFile = this.filesModel.pickFile(0);
        this.songsModel = new SongsModel(this.currentFile);
        this.currentSong = this.songsModel.pickSong(this.antiRepetitionBias);

        this.audioSource = new Audio(this.currentSong.source);

        this.audioSource.addEventListener("ended",() => {
            this.requestNewSong();
        });

        this.play();

        this.currentSongSubscribers = new Set();
        this.allSongsSubscribers = new Set();
        this.playingSubscribers = new Set();
        this.currentFileSubscribers = new Set();
        this.allFilesSubscribers = new Set();
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

    private updateCurrentSong():void{

        if (this.currentSong.sourceFormat === "local") {
            this.audioSource.src = this.currentSong.source;
            this.currentMode = "local";
        } else {
            window.youtubePlayer.loadVideoById(this.currentSong.source);
            this.currentMode = "youtube";
        }

        this.play()

        for (const subscriber of this.currentSongSubscribers){
            subscriber(this.currentSong);
        }
    }

    public playSongAtIndex(index:number):void{
        this.currentSong = this.songsModel.pickSongIndex(index,this.antiRepetitionBias);
        this.updateCurrentSong();
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

    public subscribeToCurrentFile(setFile:(file:SongsFile)=>void):() => void{
        setFile(this.currentFile);
        this.currentFileSubscribers.add(setFile);
        return () => {
            this.currentFileSubscribers.delete(setFile);
        }
    }

    private updateCurrentFile():void{
        for (const subscriber of this.currentFileSubscribers){
            subscriber(this.currentFile);
        }
    }

    public subscribeToAllFiles(setAllFiles:(files:SongsFile[])=>void):() => void{
        setAllFiles(this.filesModel.getFiles());
        this.allFilesSubscribers.add(setAllFiles);
        return () => {
            this.allFilesSubscribers.delete(setAllFiles);
        }
    }

    private updateAllFiles():void{
        for (const subscriber of this.allFilesSubscribers){
            subscriber(this.filesModel.getFiles());
        }
    }

    public playFileAtIndex(index:number):void{
        const file = this.filesModel.pickFile(index);

        if (file === this.currentFile){
            this.play();
            return;
        }
        this.currentFile = file;
        this.songsModel = new SongsModel(this.currentFile);

        this.updateCurrentFile();

        this.requestNewSong();
    }

    // called by views to request a new song, i.e. if song finishes or user skips
    public requestNewSong():void{

        this.currentSong = this.songsModel.pickSong(this.antiRepetitionBias);

        this.updateCurrentSong();
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

    public uploadNewFile(file:SongsFile):void{
        this.filesModel.addFile(file);
        this.updateAllFiles();
    }

    public deleteFileIndex(index:number):void{

        if (this.filesModel.getFiles().length === 1){
            window.alert("You must have at least one file");
            return;
        }

        let fileChosenIsCurrent = false;
        if (this.filesModel.pickFile(index) === this.currentFile){
            fileChosenIsCurrent = true;
        }

        this.filesModel.deleteFileIndex(index);
        this.updateAllFiles();

        if (fileChosenIsCurrent){
            this.playFileAtIndex(0);
        }
    }

    public updateFileAtIndex<K extends keyof SongsFile>(index:number,attribute:K,value:SongsFile[K]){
        this.filesModel.updateFileAtIndex(index,attribute,value);
        this.updateAllFiles();
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
            if ([PAUSED,UNSTARTED,CUED].includes(state)){
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
window.playerSubscribers.add(
    {
        "onStateChange": controller.youtubePlayerChangedState.bind(controller),
        "onError": () => {
            // TODO: handle errors
        }
    }
);
window.youtubePlayer.addEventListener("onStateChange",controller.youtubePlayerChangedState.bind(controller));

console.log(controller);