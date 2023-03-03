import { makeAutoObservable } from "mobx"
import { RegionUtils } from "../utils"
import { SizeSystem } from "./helpers"
import { ISettings } from "./SettingsStore"

const DEFAULT_CURRENCY = "USD"
const DEFAULT_SIZESYSTEM = "us"

class AppFormatter {
    private _priceFormat: Intl.NumberFormat
    private _sizeSystem: SizeSystem

    get PriceFormater() {
        return this._priceFormat
    }

    get SizeSystem() {
        return this._sizeSystem
    }

    constructor() {
        this._priceFormat = new Intl.NumberFormat(this.usersLocale, {
            style: "currency",
            currency: RegionUtils.getCurrency(this.usersLocale) ?? DEFAULT_CURRENCY,
        })

        this._sizeSystem = new SizeSystem(DEFAULT_SIZESYSTEM)

        makeAutoObservable(this)
    }

    get usersLocale() {
        return navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language
    }

    updateFormatters(appSettings: ISettings) {
        this._priceFormat = new Intl.NumberFormat(this.usersLocale, {
            style: "currency",
            currency: appSettings.currency,
        })

        this._sizeSystem.updateSystem(appSettings.sizeSystem)
    }
}

export default new AppFormatter()
