import { BrowserRouter } from "react-router-dom"
import "./i18next"
import { BaseProvider, LightTheme } from "baseui"
import { SnackbarProvider } from "baseui/snackbar"
import { observer } from "mobx-react-lite"
import { Client as Styletron } from "styletron-engine-atomic"
import { Provider as StyletronProvider } from "styletron-react"
import { Dialog } from "./layout"
import { RootRouter } from "./layout/routers"
import { AuthProvider, SettingsProvider } from "./provider"

const engine = new Styletron()

const App = observer(() => {
    return (
        <StyletronProvider value={engine}>
            <BaseProvider
                theme={LightTheme}
                overrides={{
                    AppContainer: {
                        style: {
                            display: "flex",
                            flex: 1,
                        },
                    },
                }}
            >
                <SnackbarProvider>
                    <BrowserRouter>
                        <SettingsProvider>
                            <AuthProvider>
                                <RootRouter />
                            </AuthProvider>
                        </SettingsProvider>
                    </BrowserRouter>
                    <Dialog />
                </SnackbarProvider>
            </BaseProvider>
        </StyletronProvider>
    )
})

export default App
