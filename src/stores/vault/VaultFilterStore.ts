import { format } from "date-fns"
import { t } from "i18next"
import { makeAutoObservable } from "mobx"
import { Conditions } from "../../constants"
import { VaultSearchQuery } from "../../interfaces"
import AppFormatter from "../AppFormatter"
import { VaultStore } from "./VaultStore"

const InvalidFilterKeys: (keyof VaultSearchQuery)[] = ["statuses", "sort", "from", "limit"]

export class VaultFilterStore {
    private _query: VaultSearchQuery | null = null

    constructor() {
        makeAutoObservable(this)
    }

    get query() {
        return this._query
    }

    initParams(searchParams: URLSearchParams) {
        this._query = null

        searchParams.forEach((value, key) => {
            if (!InvalidFilterKeys.includes(key as keyof VaultSearchQuery)) {
                this.setValue(key as keyof VaultSearchQuery, value)
            }
        })
    }

    setValue<K extends keyof VaultSearchQuery, V extends VaultSearchQuery[K]>(key: K, value: V) {
        this._query ??= {} as VaultSearchQuery

        if (value) {
            this._query[key] = value
        } else {
            delete this._query[key]
        }
    }

    public static getPropString(key: keyof VaultSearchQuery, value: string, vaultStore: VaultStore) {
        switch (key) {
            case "name":
                return `${t("common.name")}: ${value}`
            case "status":
                return `${t("common.status")}: ${t(`vault.enums.vault_product_status.${value}`)}`
            case "brand":
                return `${t("common.brand")}: ${t(`brands.${value}`)}`
            case "size":
                return `${t("common.size")}: ${value}`
            case "buyFrom":
                return `${t("filter.bought_from")}: ${format(new Date(value), "PP")}`
            case "buyTo":
                return `${t("filter.bought_to")}: ${format(new Date(value), "PP")}`
            case "soldFrom":
                return `${t("filter.sold_from")}: ${format(new Date(value), "PP")}`
            case "soldTo":
                return `${t("filter.sold_to")}: ${format(new Date(value), "PP")}`
            case "condition":
                return `${t("collection.condition")}: ${Conditions.find((e) => e.value === parseInt(value))?.text ?? `${t("common.unknown")}`}`
            case "buyPriceFrom":
                return `${t("filter.purchase_price_from")}: ${AppFormatter.PriceFormater.format(parseFloat(value))}`
            case "buyPriceTo":
                return `${t("filter.purchase_price_to")}: ${AppFormatter.PriceFormater.format(parseFloat(value))}`
            case "soldPriceFrom":
                return `${t("filter.sold_price_from")}: ${AppFormatter.PriceFormater.format(parseFloat(value))}`
            case "soldPriceTo":
                return `${t("filter.sold_price_to")}: ${AppFormatter.PriceFormater.format(parseFloat(value))}`
            case "listingPriceFrom":
                return `${t("filter.listed_price_from")}: ${AppFormatter.PriceFormater.format(parseFloat(value))}`
            case "listingPriceTo":
                return `${t("filter.listed_price_to")}: ${AppFormatter.PriceFormater.format(parseFloat(value))}`
            case "collection":
                return `${t("common.collection")}: ${vaultStore.vaultCollections.find((e) => e.id === value)?.name}`

            default:
                return null
        }
    }
}
