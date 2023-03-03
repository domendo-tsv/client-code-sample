import { Fragment, useEffect } from "react"
import { observer } from "mobx-react-lite"
import SettingsStore from "../stores/SettingsStore"

interface SettingsProviderProperties {
    children: JSX.Element
}

export const SettingsProvider = observer(({ children }: SettingsProviderProperties) => {
    useEffect(() => {
        SettingsStore.init()
    }, [])

    if (!SettingsStore.initDone) {
        return null
    }

    return <Fragment>{children}</Fragment>
})
