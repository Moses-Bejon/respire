import {useState,useRef,useEffect, type PointerEvent} from "react";
import {controller} from "../controller.ts";
import "./playBar.css";

export function PlayBar() {

    const [progress,setProgress] = useState(0);

    const currentFrame = useRef(0);

    const nextRequest = () => {
        setProgress(controller.getTimestamp()/controller.getDuration());
        currentFrame.current = requestAnimationFrame(nextRequest);
    }

    useEffect(() => {
        currentFrame.current = requestAnimationFrame(nextRequest);
        return () => cancelAnimationFrame(currentFrame.current as number);
    },[]);

    const seekTo = (pointerEvent: PointerEvent<HTMLDivElement>) => {
        const rect = pointerEvent.currentTarget.getBoundingClientRect();
        const proportion = (pointerEvent.clientX - rect.left)/rect.width;
        controller.seekTo(proportion*controller.getDuration());
    }

    return (
        <div className={"playBar"} onPointerDown={seekTo}>
            <div className={"playBarProgress"} style={{width: `${progress*100}%`}}></div>
        </div>
    )
}