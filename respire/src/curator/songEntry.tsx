import type {Song} from "../customTypes.ts";
import "./songEntry.css";

export function SongEntry({song, deleteCallback, updateAttributeCallback}:
                          {
                              song: Song,
                              deleteCallback: () => void,
                              updateAttributeCallback: <K extends keyof Song>(attribute: K, value: Song[K]) => void
                          }) {

    return (
        <div className="songEntry">
            <img src={"icons/trash.svg"} alt={"delete button"} onPointerDown={deleteCallback} />
            <input value={song.title} onChange={
                (event) => {
                    updateAttributeCallback("title",event.target.value);
                }
            }></input>
        </div>
    )
}