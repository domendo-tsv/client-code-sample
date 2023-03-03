import { Navigate, Route, Routes, useLocation, useSearchParams } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { AdditionalInfoPage, SettingsSetupPage } from "../../modules/auth"
import AuthStore from "../../stores/AuthStore"
import SettingsStore from "../../stores/SettingsStore"
import { PageLayout } from "../PageLayout"
import { AuthRouter } from "./AuthRouter"
import { MainRouter } from "./MainRouter"

export const PrivateRouter = observer(() => {
    const { pathname, search } = useLocation()

    const [searchParams] = useSearchParams()

    let expectedPath
    if (!AuthStore.user) {
        expectedPath = "/auth"
    }

    if (expectedPath) {
        const destPath = expectedPath
        if (!pathname.startsWith(destPath)) {
            let returnUrl = searchParams.get("returnUrl")
            if (!returnUrl) {
                returnUrl = `${pathname}${search}`
            }

            return <Navigate to={`${destPath}${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`} replace />
        }
    } else if (!AuthStore.userProfile) {
        const destPath = "/additional-info"
        if (!pathname.startsWith(destPath)) {
            let returnUrl = searchParams.get("returnUrl")
            if (!returnUrl) {
                returnUrl = `${pathname}${search}`
            }

            return <Navigate to={`${destPath}${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`} replace />
        }
    } else if (!SettingsStore.hasAppSettings) {
        const destPath = "/settings-setup"
        if (!pathname.startsWith(destPath)) {
            let returnUrl = searchParams.get("returnUrl")
            if (!returnUrl) {
                returnUrl = `${pathname}${search}`
            }

            return <Navigate to={`${destPath}${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`} replace />
        }
    } else {
        const returnUrl = searchParams.get("returnUrl")
        if (returnUrl) {
            return <Navigate to={returnUrl} replace />
        }
    }

    if (pathname.startsWith("/auth") && AuthStore.user) {
        return <Navigate to="/" replace />
    }

    return (
        <Routes>
            <Route element={<PageLayout />}>
                <Route path="auth/*" element={<AuthRouter />} />
                {!AuthStore.userProfile && <Route path="additional-info" element={<AdditionalInfoPage />} />}
                {!SettingsStore.hasAppSettings && <Route path="settings-setup" element={<SettingsSetupPage />} />}
                <Route path="*" element={<MainRouter />} />
            </Route>
        </Routes>
    )
})
