import { useState } from 'react'
import './App.css'

import {controller} from "./controller.ts";

export class View{

    constructor() {
        controller.subscribeToCount(this)
    }

    // declared here so that TS doesn't get mad at me:
    setNewCountFunction(count: number){

    }

    // this function must be run before newCount for this preview to work
    // can be made to not be the case in future versions
    // one (potentially problematic but potentially elegant) way to do this would be to run the contents of App in the...
    // constructor 😬
    App() {
        const [count, setCount] = useState(0)

        // this is so the controller can set the count:
        this.setNewCountFunction = setCount

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

    newCount(count: number){
        this.setNewCountFunction(count)
    }
}
