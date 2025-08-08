import {controller} from "./controller.ts";

export function handleKeyDown(event:KeyboardEvent):void{
    if (event.key === " "){
        event.preventDefault();

        if (controller.currentlyPlaying()){
            controller.pause();
        } else {
            controller.play();
        }
    }
}