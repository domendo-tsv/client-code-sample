import { Fragment, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { auth } from "../services/Firebase"
import AuthStore from "../stores/AuthStore"

interface AuthProviderProperties {
    children: JSX.Element
}

export const AuthProvider = observer(({ children }: AuthProviderProperties) => {
    useEffect(() => {
        const subscribeOnAuth = auth.onAuthStateChanged(AuthStore.init)
        return subscribeOnAuth
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!AuthStore.initDone) {
        return null
    }

    return <Fragment>{children}</Fragment>
})
