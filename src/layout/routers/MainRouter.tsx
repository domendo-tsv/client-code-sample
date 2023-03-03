import { Navigate, Route, Routes } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { NavigateToPrevPath } from "../../components"
import { AnalyticsPage } from "../../modules/analytics"
import { AccountPage } from "../../modules/settings"
import { VaultPage } from "../../modules/vault"
import { RouteContainer } from "../RouteContainer"
import { RouteContainerWithSearch } from "../RouteContainerWithSearch"

export const MainRouter = observer(() => {
    return (
        <Routes>
            <Route index element={<Navigate to="vault" />} />
            <Route element={<RouteContainerWithSearch />}>
                <Route path="vault/*" element={<VaultPage />} />
                <Route path="analytics/*" element={<AnalyticsPage />} />
            </Route>
            <Route element={<RouteContainer />}>
                <Route path="account/*" element={<AccountPage />} />
            </Route>
            <Route path="*" element={<NavigateToPrevPath />} />
        </Routes>
    )
})
