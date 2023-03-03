import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { Block } from "baseui/block"
import { runInAction } from "mobx"
import { observer, useLocalObservable } from "mobx-react-lite"
import { HandledError } from "../error"
import { SearchBar } from "../modules/search"
import { VaultStoreContext } from "../modules/vault/context"
import { VaultStore } from "../stores"
import { DetailsLoader } from "../ui"

export const RouteContainerWithSearch = observer(() => {
    const [store] = useState(() => new VaultStore())

    const state = useLocalObservable(() => ({
        store,

        isLoading: true,
        error: null as HandledError | null,

        async load() {
            this.isLoading = true
            let error: HandledError | null

            try {
                await this.store.load()
            } catch (e) {
                error = e
            }

            runInAction(() => {
                this.error = error
                this.isLoading = false
            })
        },
    }))

    useEffect(() => {
        runInAction(() => {
            state.store = store
        })
    }, [state, store])

    useEffect(() => {
        state.load()
    }, [state])

    if (state.isLoading || state.error) {
        return <DetailsLoader isLoading={state.isLoading} error={state.error} />
    }

    return (
        <Block flex={1} display="flex" flexDirection="column">
            <SearchBar />

            <VaultStoreContext.Provider value={store}>
                <Block flex={1} display="flex" justifyContent="center">
                    <Block flex={1} display="flex" flexDirection="column" width="100%" maxWidth={["100%", "100%", "1280px"]}>
                        <Outlet />
                    </Block>
                </Block>
            </VaultStoreContext.Provider>
        </Block>
    )
})
