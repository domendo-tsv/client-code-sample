import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Block } from "baseui/block"
import { Button } from "baseui/button"
import { LabelLarge } from "baseui/typography"
import { observer, useLocalObservable } from "mobx-react-lite"
import { Currencies, SizeSystem } from "../../../constants"
import { SizeTypes } from "../../../interfaces"
import SettingsStore, { DEFAULT_CURRENCY, DEFAULT_SIZE_SYSTEM, ISettings } from "../../../stores/SettingsStore"
import { Dropdown } from "../../../ui"
import { RegionUtils, SizeUtils } from "../../../utils"

export const SettingsSetupPage = observer(() => {
    const { t } = useTranslation()

    const state = useLocalObservable(() => ({
        data: null as ISettings | null,

        get currencyOptions() {
            return Currencies.map((currency) => ({ value: currency.name, text: `${currency.name} (${currency.symbol})` }))
        },

        get selectedCurrencyValue() {
            const currency = this.currencyOptions.find((e) => e.value === this.data?.currency)
            return currency ? [currency] : undefined
        },

        get sizeSystemOptions() {
            return SizeSystem.map((size) => ({ value: size as SizeTypes, text: size }))
        },

        get selectedSizeSystemValue() {
            const currency = this.sizeSystemOptions.find((e) => e.value === this.data?.sizeSystem)
            return currency ? [currency] : undefined
        },

        init() {
            const userLocale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language

            /* Currency */
            const usersCurrency = RegionUtils.getCurrency(userLocale)
            const currency = this.currencyOptions.find((e) => e.value === usersCurrency)?.value ?? DEFAULT_CURRENCY
            this.setValue("currency", currency)
            //

            /* Size System */
            const usersSizeSystem = SizeUtils.getSizeSystemFromLocale(userLocale)
            const sizeSystem = this.sizeSystemOptions.find((e) => e.value === usersSizeSystem)?.value ?? DEFAULT_SIZE_SYSTEM
            this.setValue("sizeSystem", sizeSystem)
            //
        },

        setValue<K extends keyof ISettings, V extends ISettings[K]>(key: K, value: V) {
            this.data ??= {} as ISettings
            this.data[key] = value
        },

        save() {
            if (!this.data) {
                return
            }

            SettingsStore.setSettings(this.data)
        },
    }))

    useEffect(() => {
        state.init()
    }, [state])

    return (
        <Block display="flex" height="100%" justifyContent="center" margin="16px">
            <Block display="flex" width="100%" maxWidth={["100%", "100%", "360px"]} flexDirection="column" margin={["0px", "0px", "auto", "auto"]}>
                <Block display="flex" marginBottom="12px">
                    <LabelLarge font={["font550", "font550", "font650"]}>{t("common.settings")}</LabelLarge>
                </Block>

                <Dropdown
                    label={t("settings.language")}
                    caption={t("settings.select_your_language")}
                    value={undefined}
                    options={[]}
                    disabled={true}
                    placeholder={"English"}
                    onSelect={() => void 0}
                />

                <Dropdown
                    label={t("settings.currency")}
                    caption={t("settings.select_your_currency")}
                    value={state.selectedCurrencyValue}
                    options={state.currencyOptions}
                    onSelect={(value) => {
                        const val = value?.length ? value[0] : undefined
                        if (val) {
                            state.setValue("currency", val)
                        }
                    }}
                />

                <Dropdown
                    label={t("settings.size_system")}
                    caption={t("settings.select_your_size_system")}
                    value={state.selectedSizeSystemValue}
                    options={state.sizeSystemOptions}
                    onSelect={(value) => {
                        const val = value?.length ? value[0] : undefined
                        if (val) {
                            state.setValue("sizeSystem", val as SizeTypes)
                        }
                    }}
                />

                <Block>
                    <Button
                        overrides={{
                            BaseButton: {
                                style: {
                                    marginTop: "12px",
                                    width: "100%",
                                },
                            },
                        }}
                        disabled={!state.data}
                        onClick={state.save}
                    >
                        {t("common.continue")}
                    </Button>
                </Block>
            </Block>
        </Block>
    )
})
