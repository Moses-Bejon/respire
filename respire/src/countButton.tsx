import { useState} from 'react'
import './countApp.css'

import {controller} from "./controller.ts";
import {View} from "./view.ts";

export class CountButton extends View{
    constructor() {
        super()
        controller.subscribeToCount(this)
    }

    public App() {

        const [count, setCount] = useState(0)

        this.useNewSetter("count",setCount)

        return (
            <>
                <p>
                    The default counter for testing purposes:
                </p>
                <button onClick={() => controller.increment()}> count is {count}</button>
            </>
        )
    }

    public newCount(count:number){
        this.setState("count",count)
    }
}
