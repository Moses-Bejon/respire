import { useState } from 'react'
import './App.css'

import {controller} from "./controller.ts";

export class View{

    constructor() {
        controller.subscribeToCount(this)
    }

    setNewCountFunction(count: number){

    }

    App() {
        const [count, setCount] = useState(0)

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
