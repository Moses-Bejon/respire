import {FileInput} from "./fileInput.tsx";
import {controller} from "../controller.ts";

export function Curator() {
    return (
        <>
            <FileInput
                uploadName="mp3"
                fileUploadCallback={controller.uploadNewSong.bind(controller)}
                accept="audio/*"
            />
        </>
    )
}