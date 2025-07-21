import {type DragEvent} from "react";

export function FileInput(
    {uploadName,fileUploadCallback,accept}:
                        {
                            uploadName:string;
                            fileUploadCallback: (file: File) => void;
                            accept: string;
                        }
    ){
    
    const handleFileSelect = () => {

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = accept;

        fileInput.onchange = (event: Event) => {

            const input = event.target as HTMLInputElement;

            if (!input.files || input.files.length === 0){
                throw new Error("target does not have files");
            }

            const file = input.files[0];

            fileUploadCallback(file);
        }

        fileInput.click();
    };

    const handleDragOver = (event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }

    const handleDrop = (event: DragEvent) => {
        event.preventDefault();
        const files = event.dataTransfer?.files;
        const file = files && files.length > 0 ? files[0] : undefined;
        if (file) {
            fileUploadCallback(file);
        }
    }

    return (
        <button onClick={handleFileSelect} onDragOver={handleDragOver} onDrop={handleDrop}>
            Upload {uploadName} (drag and drop or click me)
        </button>
    );
}
