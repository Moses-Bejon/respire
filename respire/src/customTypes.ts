export type sourceFormat = "local"|"youtube"|"spotify";

export type Song = {
    title: string;
    sourceFormat: sourceFormat;
    source: string;
};

export type SongsFile = {
    name: string;
    version: number;
    songs: Song[];
};