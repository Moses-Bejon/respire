export type Song = {
    title: string;
    sourceFormat: "local"|"youtube"|"spotify";
    source: string;
};

export type File = {
    version: number;
    songs: Song[];
};