// youtube's nonsense for setting up their API:
// the use of the global variables is to enable exports
// as for whatever reason youtube's API breaks if you try to make this script a module

const tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
    window.youtubePlayer = new YT.Player('youtubePlayer', {
        height: '390',
        width: '640',
        videoId: 'dQw4w9WgXcQ',
        playerVars: {
            'playsinline': 1
        },
        events: {
            onStateChange: () => {
                for (const subscriber of window.youtubePlayerSubscribers){
                    subscriber(window.youtubePlayer.getPlayerState());
                }
            }
        }
    });
}

window.youtubePlayerSubscribers = new Set()