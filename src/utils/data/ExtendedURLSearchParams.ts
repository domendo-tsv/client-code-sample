export class ExtendedURLSearchParams implements URLSearchParams {
    private readonly urlSearchParams: URLSearchParams

    public constructor(init?: string | string[][] | Record<string, string> | URLSearchParams | undefined) {
        this.urlSearchParams = new URLSearchParams(init)
    }

    public setIf(name: string, val: string | number | null | string[] | number[] | undefined): void {
        if (Array.isArray(val)) {
            if (val.length) {
                this.urlSearchParams.set(name, val.join(","))
            } else {
                this.urlSearchParams.delete(name)
            }
        } else {
            if (val || val === 0) {
                this.urlSearchParams.set(name, val.toString())
            } else {
                this.urlSearchParams.delete(name)
            }
        }
    }

    public append(name: string, value: string): void {
        this.urlSearchParams.append(name, value)
    }

    public delete(name: string): void {
        this.urlSearchParams.delete(name)
    }

    public get(name: string): string | null {
        return this.urlSearchParams.get(name)
    }

    public getAll(name: string): string[] {
        return this.urlSearchParams.getAll(name)
    }

    public has(name: string): boolean {
        return this.urlSearchParams.has(name)
    }

    public set(name: string, value: string): void {
        this.urlSearchParams.set(name, value)
    }

    public sort(): void {
        this.urlSearchParams.sort()
    }

    public getObject<T extends { [key: string]: string | string[] | undefined }>(defaultSearchObject: T): T {
        const object: T = defaultSearchObject
        type K = keyof T

        Object.entries(defaultSearchObject).forEach(([key, _value]) => {
            const singleParam = this.urlSearchParams.get(key)
            const arrayParam = singleParam?.split(",") || defaultSearchObject[key as K]
            if (Array.isArray(defaultSearchObject[key])) object[key as K] = arrayParam as T[K]
            else object[key as K] = (singleParam as T[K]) || defaultSearchObject[key as K]
        })

        return object
    }

    public setObject<T extends { [key: string]: string | string[] | undefined }>(object: T): void {
        Object.entries(object).forEach(([key, value]: [string, string | string[] | undefined]) => {
            if (value && value.length > 0) {
                if (Array.isArray(value)) {
                    this.urlSearchParams.set(key, value.join(","))
                } else {
                    this.urlSearchParams.set(key, value)
                }
            } else {
                this.urlSearchParams.delete(key)
            }
        })
    }

    public forEach(callbackfn: (value: string, key: string, parent: URLSearchParams) => void, thisArg?: unknown): void {
        this.urlSearchParams.forEach(callbackfn, thisArg)
    }

    public [Symbol.iterator](): IterableIterator<[string, string]> {
        return this.urlSearchParams[Symbol.iterator]()
    }

    public entries(): IterableIterator<[string, string]> {
        return this.urlSearchParams.entries()
    }

    public keys(): IterableIterator<string> {
        return this.urlSearchParams.keys()
    }

    public values(): IterableIterator<string> {
        return this.urlSearchParams.values()
    }

    public toString(): string {
        return this.urlSearchParams.toString()
    }
}
