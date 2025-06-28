import {View} from "./view.tsx";
import {CountModel} from "./countModel.ts";

class Controller{
    countSubscribers: Set<View>
    countModel: CountModel

    constructor() {
        this.countSubscribers = new Set()
        this.countModel = new CountModel()
    }

    increment(){
        this.countModel.increment()
        this.updateCount()
    }

    subscribeToCount(subscriber: View){
        this.countSubscribers.add(subscriber)
    }

    updateCount(){
        for (const subscriber of this.countSubscribers){

            // if view not in scene, no need to update it
            if (subscriber.setStateMethods.count === undefined){
                continue
            }

            subscriber.setStateMethods.count(this.countModel.count)
        }
    }
}

export const controller = new Controller()

console.log(controller)