import {type DragEvent} from "react";
import "./fileInput.css";

export function FileInput(
    {uploadName,fileUploadCallback,accept}:
                        {
                            uploadName:string;
                            fileUploadCallback: (file: File) => void;
                            accept: string;
                        }
    ){

    const handleFileSelect = ():void => {

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = accept;
        fileInput.multiple = true;

        fileInput.onchange = (event: Event) => {

            const input = event.target as HTMLInputElement;

            if (!input.files){
                throw new Error("target does not have files");
            }

            for (const file of input.files){
                fileUploadCallback(file);
            }
        }

        fileInput.click();
    };

    const handleDragOver = (event: DragEvent):void => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }

    const handleDrop = (event: DragEvent):void => {
        event.preventDefault();
        const files = event.dataTransfer?.files;

        if (!files){
            throw new Error("event does not have files");
        }

        for (const file of files){
            fileUploadCallback(file);
        }
    }

    return (
        <div className={"fileInput"} onPointerDown={handleFileSelect} onDragOver={handleDragOver} onDrop={handleDrop}>
            <img src={"icons/file.svg"} alt={"upload file image"}/>
            Drag and drop {uploadName} file(s) here, or click me
        </div>
    );
}
