/* Translation config */
import { initReactI18next } from "react-i18next"
import { use } from "i18next"
import translationEN from "./assets/locales/en.json"

use(initReactI18next).init({
    resources: {
        en: {
            translation: translationEN,
        },
    },
    lng: "en",
    fallbackLng: "en",
})
