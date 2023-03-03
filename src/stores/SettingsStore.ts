import { action, makeAutoObservable, observable } from "mobx"
import { SizeTypes } from "../interfaces"
import AppFormatter from "./AppFormatter"

const DEFAULT_STORAGE_KEY = "app_settings"
export const DEFAULT_SIZE_SYSTEM = "us"
export const DEFAULT_CURRENCY = "$"

export interface ISettings {
    currency: string
    sizeSystem: SizeTypes
}

class SettingsStore {
    @observable private _settings: ISettings | null = null
    @observable private _initDone = false

    constructor() {
        makeAutoObservable(this)
    }

    get settings() {
        return this._settings
    }

    get sizeSystem() {
        return this._settings?.sizeSystem ?? DEFAULT_SIZE_SYSTEM
    }

    get currency() {
        return this._settings?.currency ?? DEFAULT_CURRENCY
    }

    get hasAppSettings() {
        return !!this._settings
    }

    get initDone() {
        return this._initDone
    }

    get usersLocale() {
        return navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language
    }

    @action.bound
    public init = () => {
        const settingsObj = localStorage.getItem(DEFAULT_STORAGE_KEY)
        if (settingsObj) {
            this._settings = JSON.parse(settingsObj)

            if (this._settings) {
                AppFormatter.updateFormatters(this._settings)
            }
        } else {
            // setup here
        }

        this._initDone = true
    }

    public setSettings = (settings: ISettings) => {
        localStorage.setItem(DEFAULT_STORAGE_KEY, JSON.stringify(settings))
        this._settings = settings
        AppFormatter.updateFormatters(this._settings)
    }

    public updateSettings = (updatedSettings: Partial<ISettings>) => {
        let settings: ISettings

        const settingsObj = localStorage.getItem(DEFAULT_STORAGE_KEY)
        if (settingsObj) {
            settings = JSON.parse(settingsObj)
            Object.assign(settings, updatedSettings)
            this.setSettings(settings)
        }
    }
}

export default new SettingsStore()
