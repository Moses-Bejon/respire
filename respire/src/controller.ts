import {CountModel} from "./countModel.ts";
import type {CountView} from "./countView.tsx";

class Controller{
    private readonly countSubscribers: Set<CountView>
    private countModel: CountModel

    constructor() {
        this.countSubscribers = new Set()
        this.countModel = new CountModel()
    }

    increment(){
        this.countModel.increment()
        this.updateCount()
    }

    subscribeToCount(subscriber: CountView){
        this.countSubscribers.add(subscriber)
    }

    updateCount(){
        for (const subscriber of this.countSubscribers){
            subscriber.newCount(this.countModel.read())
        }
    }
}

export const controller = new Controller()

console.log(controller)