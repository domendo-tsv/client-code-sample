import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { NavigateToPrevPath } from "../../components"
import { ForgotPasswordPage, SignInPage, SignUpPage } from "../../modules/auth"

export const AuthRouter = observer(() => {
    const { search } = useLocation()

    return (
        <Routes>
            <Route index element={<Navigate replace to={`login${search}`} />} />
            <Route path="login" element={<SignInPage />} />
            <Route path="create-account" element={<SignUpPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="*" element={<NavigateToPrevPath />} />
        </Routes>
    )
})
