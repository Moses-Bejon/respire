import type {Song, SongsFile} from "./customTypes.ts";
import {getUniqueStringWithPrefix} from "./lib/strings.ts";

export class FilesModel{
    private readonly files:SongsFile[];

    constructor(files = [] as SongsFile[]) {
        this.files = files;
    }

    public addFile(file: { name: string; version: number; songs: Song[] }):void{

        file.name = getUniqueStringWithPrefix(file.name,this.files.map((file) => file.name));

        this.files.push(file);
    }

    public deleteFileIndex(index:number):void{
        this.files.splice(index,1);
    }

    public updateFileAtIndex<K extends keyof SongsFile>(index:number,attribute:K,value:SongsFile[K]):void{

        if (attribute === "name"){
            value = getUniqueStringWithPrefix(
                value as string,this.files.map((file) => file.name)) as SongsFile[K];
        }

        this.files[index][attribute] = value;
    }

    public pickFile(index:number):SongsFile{
        return this.files[index];
    }

    public getFiles():SongsFile[]{
        return structuredClone(this.files);
    }
}