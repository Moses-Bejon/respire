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
        events:{
            'onStateChange': (event) => {
                for (const subscriber of window.playerSubscribers){
                    subscriber.onStateChange(event.data);
                }
            },
            'onError': (event) => {
                for (const subscriber of window.playerSubscribers){
                    subscriber.onError(event.data);
                }
            },
        }
    });

    window.youtubeInfoGrabber = new YT.Player('youtubeInfoGrabber', {
        height: '390',
        width: '640',
        videoId: 'dQw4w9WgXcQ',
        events:{
            'onReady': () => {
                window.youtubeInfoGrabber.mute();
            },
            'onStateChange': (event) => {
                for (const subscriber of window.infoGrabberSubscribers){
                    subscriber.onStateChange(event.data);
                }
            },
            'onError': (event) => {
                for (const subscriber of window.infoGrabberSubscribers){
                    subscriber.onError(event.data);
                }
            }
        }
    });
}

window.playerSubscribers = new Set();
window.infoGrabberSubscribers = new Set();
