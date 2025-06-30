import {CountModel} from "./countModel.ts";
import type {CountButton} from "./countButton.tsx";

class Controller{
    private readonly countSubscribers: Set<CountButton>
    private countModel: CountModel

    constructor() {
        this.countSubscribers = new Set()
        this.countModel = new CountModel()
    }

    public increment(){
        this.countModel.increment()
        this.updateCount()
    }

    public subscribeToCount(subscriber: CountButton){
        this.countSubscribers.add(subscriber)

        return this.countModel.read()
    }

    private updateCount(){
        for (const subscriber of this.countSubscribers){
            subscriber.newCount(this.countModel.read())
        }
    }
}

export const controller = new Controller()

console.log(controller)