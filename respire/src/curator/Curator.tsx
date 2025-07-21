import {useRef, type ChangeEvent} from "react";
import {controller} from "../controller";

export function Curator(){
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (file !== null) {
            controller.uploadNewSong(file);
        }
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="*/*"
            />
        </>
    );
}
