import {EntryList} from "../components/entryList.tsx";
import {useState,useEffect} from "react";
import {FILE_PLACEHOLDER, FILE_VERSION} from "../globalConstants.ts";
import type {SongsFile} from "../customTypes.ts";
import {controller} from "../controller.ts";

export function File() {

    const [files,setFiles] = useState([FILE_PLACEHOLDER as SongsFile]);
    useEffect(() => {
        return controller.subscribeToAllFiles(setFiles);
    },[])

    const [currentFile,setCurrentFile] = useState(FILE_PLACEHOLDER as SongsFile);
    useEffect(() => {
        return controller.subscribeToCurrentFile(setCurrentFile);
    }, []);

    return (
        <div className="fileManager view">
            <h1>Your files:</h1>
            <EntryList
                entries={files.map((file) => [file.name])}
                deleteEntryAtIndex={(index:number) => controller.deleteFileIndex(index)}
                updateEntryAtIndex={(index:number,attribute:number,newValue:string) => {

                    if (attribute !== 0) {
                        throw new Error("attribute must be 0, as only one attribute is passed in");
                    }

                    controller.updateFileAtIndex(index,"name",newValue);
                }}
                playEntryAtIndex={(index:number) => controller.playFileAtIndex(index)}
                indexPlaying={files.findIndex((file) => file.name === currentFile.name)}
            />
            <div className="buttons"><button onClick={() => {
                controller.uploadNewFile({
                    "name": "new file",
                    "version": FILE_VERSION,
                    "songs": []
                })
            }}>New File</button></div>
        </div>
    )
}