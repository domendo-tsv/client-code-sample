import { makeAutoObservable, observable, ObservableMap } from "mobx"

export class ObservableURLSearchParams {
    private readonly map: ObservableMap<string, string>

    constructor(init?: string | string[][] | Record<string, string> | URLSearchParams | undefined) {
        makeAutoObservable(this)
        this.map = observable.map(Object.fromEntries(new URLSearchParams(init)))
    }

    public set(name: string, val: string | number | null | string[] | number[] | undefined): void {
        if (Array.isArray(val)) {
            if (val.length) {
                this.map.set(name, val.join(","))
            } else {
                this.map.delete(name)
            }
        } else {
            if (val || val === 0) {
                this.map.set(name, val.toString())
            } else {
                this.map.delete(name)
            }
        }
    }

    public get(name: string): string | undefined {
        return this.map.get(name)
    }

    public calcCount(...keys: string[]): number {
        return keys.filter((k) => this.map.has(k)).length
    }

    public toString(): string {
        return new URLSearchParams(this.map.toJSON()).toString()
    }
}
