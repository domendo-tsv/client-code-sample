import { makeAutoObservable, runInAction } from "mobx"
import { VaultProductStatus } from "../../enums"
import { HandledError } from "../../error"
import { VaultDashboard, VaultSearchQuery } from "../../interfaces"
import Api from "../../services/Api"
import SettingsStore from "../SettingsStore"

export class VaultDashboardStore {
    private _isLoading = false
    private _error: HandledError | null = null

    private _item: VaultDashboard | null = null

    private _query: VaultSearchQuery | null = null

    constructor(public readonly statuses: VaultProductStatus[]) {
        makeAutoObservable(this)
    }

    get isLoading() {
        return this._isLoading
    }

    get error() {
        return this._error
    }

    get item() {
        return this._item
    }

    get query() {
        return this._query
    }

    public refresh() {
        this.load(this._query ?? {})
    }

    async load(query: VaultSearchQuery) {
        this._isLoading = true
        this._item = null
        this._query = query

        let dashboard: VaultDashboard | null = null
        let error: HandledError | null = null

        query.statuses = this.statuses.map((e) => e.toString()).join(",")

        try {
            const queryBody = new URLSearchParams(query).toString()
            dashboard = await Api.get<VaultDashboard>(`/vault/products/dashboard?${queryBody}`, {
                headers: {
                    "size-system": SettingsStore.sizeSystem,
                },
            })
        } catch (e) {
            error = e
        }

        runInAction(() => {
            if (dashboard) {
                this._item = dashboard
            }

            this._error = error
            this._isLoading = false
        })
    }
}
