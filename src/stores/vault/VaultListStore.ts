import { makeAutoObservable, runInAction } from "mobx"
import { VaultProductStatus } from "../../enums"
import { HandledError } from "../../error"
import { PaginatedMeta, PaginatedResponse, VaultSearchQuery } from "../../interfaces"
import Api from "../../services/Api"
import SettingsStore from "../SettingsStore"

export class VaultListStore<T> {
    private _isLoading = false
    private _error: HandledError | null = null

    private _metadata: PaginatedMeta | null = null
    private _items: T[] | null = null

    private _query: VaultSearchQuery | null = null

    constructor(readonly apiPrefix: string, readonly statuses: VaultProductStatus[]) {
        makeAutoObservable(this)
    }

    get showLoadMore() {
        return (!this.isLoading || !this.error) && this.metadata && this.metadata.to - this.metadata.from === this.metadata.total
    }

    get isLoading() {
        return this._isLoading
    }

    get error() {
        return this._error
    }

    get items() {
        return this._items
    }

    get metadata() {
        return this._metadata
    }

    get query() {
        return this._query
    }

    public refresh() {
        this.search(this._query ?? {})
    }

    async search(query: VaultSearchQuery) {
        this._isLoading = true
        this._items = []

        let items: T[] | null = null
        let error: HandledError | null = null
        let metadata: PaginatedMeta | null = null

        query.statuses = this.statuses.map((e) => e.toString()).join(",")
        this._query = query

        try {
            const queryBody = new URLSearchParams(query).toString()
            const { data, meta } = await this.execSearch(queryBody)
            items = data
            metadata = meta
        } catch (e) {
            error = e
        }

        runInAction(() => {
            if (items) {
                this._items = items
            }
            this._metadata = metadata
            this._error = error
            this._isLoading = false
        })
    }

    public async loadMore() {
        this._isLoading = true

        const query = this._query ?? {}
        if (query.from && query.limit) {
            const from = parseInt(query.from)
            const limit = parseInt(query.limit)
            query.from = (from + limit).toString()
        }

        this._query = query

        let items: T[] | null = null
        let error: HandledError | null = null
        let metadata: PaginatedMeta | null = null

        try {
            const queryBody = new URLSearchParams(query).toString()
            const { data, meta } = await this.execSearch(queryBody)
            items = data
            metadata = meta
        } catch (e) {
            error = e
        }

        runInAction(() => {
            if (items) {
                this._items = [...(this._items ?? []), ...items]
            }

            this._metadata = metadata
            this._error = error
            this._isLoading = false
        })
    }

    private execSearch(query: string) {
        return Api.get<PaginatedResponse<T>>(`${this.apiPrefix}?${query}`, {
            headers: {
                "size-system": SettingsStore.sizeSystem,
            },
        })
    }
}
