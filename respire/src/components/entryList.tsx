import {Entry} from "./entry.tsx";
import "./entryList.css";
import {useEffect, useState} from "react";
import {controller} from "../controller.ts";

export function EntryList(
                            {
                                entries,
                                deleteEntryAtIndex,
                                updateEntryAtIndex,
                                playEntryAtIndex = null,
                                indexPlaying = null
                            }:
                          {
                              entries:string[][],
                              deleteEntryAtIndex: (index:number) => void,
                              updateEntryAtIndex: (index:number,attribute:number,value:string) => void,
                              playEntryAtIndex?:((index:number) => void) | null
                              indexPlaying?:number | null;
                          }){

    const [currentlyPlaying,setCurrentlyPlaying] = useState(false);
    useEffect(() => {
        return controller.subscribeToPlaying(setCurrentlyPlaying);
    }, []);

    return (
        <div className="entryList">
            {entries.map((entry, index) => (
                <Entry
                    key={index}
                    attributeValues={entry}
                    deleteCallback={() => {deleteEntryAtIndex(index);}}
                    updateAttributeCallback={
                        (attribute, newValue) => {updateEntryAtIndex(index,attribute,newValue)}
                    }
                    playCallback={playEntryAtIndex ? () => playEntryAtIndex(index) : null}
                    playing={indexPlaying === index && currentlyPlaying}
                />
            ))}
        </div>
    );
}