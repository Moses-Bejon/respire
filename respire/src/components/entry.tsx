import "./entry.css";
import {controller} from "../controller.ts";

export function Entry({attributeValues, deleteCallback, updateAttributeCallback, playCallback, playing}:
                          {
                              attributeValues: string[],
                              deleteCallback: () => void,
                              updateAttributeCallback: (attribute:number,newValue:string) => void,
                              playCallback: (() => void) | null;
                              playing: boolean;
                          }) {

    return (
        <div className= "entry">
            {
                playCallback !== null ?
                playing ?
                    <img src={"icons/pause.svg"} alt={"pause button"} onPointerDown={controller.pause.bind(controller)}/> :
                    <img src={"icons/play.svg"} alt={"play button"} onPointerDown={playCallback} />
                : null
            }
            <img src={"icons/trash.svg"} alt={"delete button"} onPointerDown={deleteCallback} />
            {
                attributeValues.map((attributeValue,index) => (
                    <input key={index} value={attributeValue} onChange={
                        (event) => {
                            updateAttributeCallback(index,event.target.value);
                        }
                    }></input>
                ))
            }
        </div>
    )
}