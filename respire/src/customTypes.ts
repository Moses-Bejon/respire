export type Song = {
    title: string;
    sourceFormat: "mp3"|"youtube"|"spotify";
    source: string;
};

export type File = {
    version: number;
    songs: Song[];
};