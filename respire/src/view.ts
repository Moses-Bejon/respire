import {type ReactNode, useEffect} from "react";

// as new states are added, this needs to be extended, i.e. "count"|"songTitle"|...
type StateIdentifier = "count"
type SetStateMethods = {
    [Key in StateIdentifier]?: Function;
};

export abstract class View{
    private readonly setStateMethods: SetStateMethods

    protected constructor() {
        this.setStateMethods = {}
    }

    // this hook is used to add a state to the setStateMethods so it can be set by the view
    protected useNewSetter(stateName:StateIdentifier,setState:Function){
        useEffect(() => {
            this.setStateMethods[stateName] = setState

            return () => {delete this.setStateMethods[stateName]}
        }, [])
    }

    // this is used whenever a state is updated by the child view
    protected setState(stateName:StateIdentifier,newState:any){

        const stateSetter = this.setStateMethods[stateName]

        if (stateSetter === undefined){
            throw new Error(`No state with name: ${stateName}. This may be because App was not called.`)
        }

        stateSetter(newState)
    }

    // all views should have an app function which returns what they look like
    // this allows an entire view to be appended to the dom in one go
    public abstract App(): ReactNode
}
