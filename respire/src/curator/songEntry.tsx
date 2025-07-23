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
            <input value={song.title} onChange={
                (event) => {
                    updateAttributeCallback("title",event.target.value);
                }
            }></input>
            <img src={"public/icons/trash.svg"} alt={"delete button"} onClick={deleteCallback} />
        </div>
    )
}