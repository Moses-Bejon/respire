import type {Song} from "../customTypes.ts";

export function SongEntry({song, deleteCallback, updateAttributeCallback}:
                          {
                              song: Song,
                              deleteCallback: () => void,
                              updateAttributeCallback: <K extends keyof Song>(attribute: K, value: Song[K]) => void
                          }) {

    return (
        <div>
            <input value={song.title} onChange={
                (event) => {
                    updateAttributeCallback("title",event.target.value);
                }
            }></input>
            <button onClick={deleteCallback}>Delete</button>
        </div>
    )
}