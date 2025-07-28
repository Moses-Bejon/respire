export {}

declare global {
    interface Window {
        youtubePlayer: YT.Player;
        youtubeInfoGrabber: YT.Player;
        infoGrabberSubscribers: Set<{ onError: (errorCode: number) => void, onStateChange: (state: number) => void }>;
    }
}