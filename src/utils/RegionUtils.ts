import { LocaleCurrencyMap } from "./data"

export default {
    getCountryCode(localeString: string) {
        return localeString.split("-")[1]
    },

    getCurrency(locale: string) {
        const countryCode = this.getCountryCode(locale).toUpperCase()
        if (countryCode in LocaleCurrencyMap) {
            return LocaleCurrencyMap[countryCode]
        }
        return null
    },

    getLocales(currencyCode: string) {
        currencyCode = currencyCode.toUpperCase()
        const locales = []
        for (const countryCode in LocaleCurrencyMap) {
            if (LocaleCurrencyMap[countryCode] === currencyCode) {
                locales.push(countryCode)
            }
        }
        return locales
    },
}
