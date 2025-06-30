export class CountModel{

    private count: number

    constructor() {
        this.count = 0
    }

    public increment(){
        this.count ++
    }

    public read(){
        return this.count
    }
}