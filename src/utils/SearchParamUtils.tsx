import { ExtendedURLSearchParams, ObservableURLSearchParams } from "./data"

export default {
    paramsToPath(path: string, params: { [key: string]: {} }): string {
        let ret = path
        let hasQuery = ret.indexOf("?") !== -1

        for (const prop of Object.keys(params)) {
            const val = params[prop]
            if (val) {
                if (!hasQuery) {
                    ret += "?"
                    hasQuery = true
                } else {
                    ret += "&"
                }
                ret += `${encodeURIComponent(prop)}=${encodeURIComponent(val.toString())}`
            }
        }
        return ret
    },

    searchToParams(search: string): { [key: string]: {} } {
        const params: { [key: string]: {} } = {}

        if (search) {
            const splited = search.substring(1).split("&")
            splited.forEach((s) => {
                const keyVal = s.split("=")
                const key = decodeURIComponent(keyVal[0])
                const val = decodeURIComponent(keyVal[1])
                params[key] = val
            })
        }

        return params
    },

    getSearchParam(search: string, param: string): string | undefined {
        const params = this.searchToParams(search)
        return params[param] as string
    },

    getValueFromUrl(prop: string): string | null {
        const search = window.location.search
        return new URLSearchParams(search).get(prop ?? "")
    },

    applyValueToUrl(prop: string, value: string | null): void {
        if (!prop) {
            return
        }

        if (value === "") {
            value = null
        }

        const params = this.getURLSearchParams()
        const paramValue = params.get(prop)

        if (paramValue === value) {
            return
        }

        if (value === null || value === undefined) {
            params.delete(prop)
        } else {
            params.delete("page")
            params.setIf(prop, value)
        }

        this.applyURLSearchParams(params)
    },

    getURLSearchParams(): ExtendedURLSearchParams {
        return new ExtendedURLSearchParams(window.location.search)
    },

    getURLSearchObservableMap(): ObservableURLSearchParams {
        return new ObservableURLSearchParams(window.location.search)
    },

    applyURLSearchParams(params: URLSearchParams | ObservableURLSearchParams): void {
        const path = window.location.pathname
        let search = params.toString()

        if (search) {
            search = `?${search}`
        }

        window.history.replaceState(null, "", `${path}${search}`)
    },
}
