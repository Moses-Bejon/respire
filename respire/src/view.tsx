import { useState } from 'react'
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

    App() {
        const [count, setCount] = useState(0)

        // this is so the controller can set the count:
        this.setStateMethods["count"] = setCount

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
