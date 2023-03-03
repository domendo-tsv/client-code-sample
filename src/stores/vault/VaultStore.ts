import { makeAutoObservable, runInAction } from "mobx"
import { VaultBase } from "../../interfaces"
import Api from "../../services/Api"

export class VaultStore {
    private _data: VaultBase | null = null

    constructor() {
        makeAutoObservable(this)
    }

    get data() {
        return this._data
    }

    get vaultCollections() {
        return this._data?.collections ?? []
    }

    public async load() {
        const vaultBase = await Api.get<VaultBase>("/vault")

        runInAction(() => {
            this._data = vaultBase
        })
    }

    setValue<K extends keyof VaultBase, V extends VaultBase[K]>(key: K, value: V) {
        this._data ??= {} as VaultBase
        this._data[key] = value
    }
}
