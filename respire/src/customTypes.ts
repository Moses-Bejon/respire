// as new states are added, this needs to be extended, i.e. "count"|"songTitle"|...
export type StateIdentifier = "count"
export type SetStateMethods = {
    [Key in StateIdentifier]?: Function;
};