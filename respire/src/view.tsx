import { useState, useEffect } from 'react'
import './App.css'

import {controller} from "./controller.ts";

// in the real thing this would be pulled out of any specific view file:
type StateIdentifier = "count"
type SetStateMethods = {
    [Key in StateIdentifier]?: Function;
};

export class View{
    setStateMethods: SetStateMethods

    constructor() {
        this.setStateMethods = {}

        controller.subscribeToCount(this)
    }

    addSetter(stateName:StateIdentifier,setState:Function){
        this.setStateMethods[stateName] = setState

        return () => {delete this.setStateMethods[stateName]}
    }

    App() {
        const [count, setCount] = useState(0)

        useEffect(() => {
            // this is so the controller can set the count:
            return this.addSetter("count",setCount)
        }, []);

        return (
            <>
                <p>
                    The default counter for testing purposes:
                </p>
                <button onClick={() => controller.increment()}>
                    count is {count}
                </button>
            </>
        )
    }
}
