export {}

declare global {
    interface Window {
        youtubePlayer: YT.Player;
        youtubePlayerSubscribers: Set<(state:number) => void>;
    }
}