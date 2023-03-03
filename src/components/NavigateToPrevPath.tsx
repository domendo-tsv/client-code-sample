import { Navigate, useLocation } from "react-router-dom"

export const NavigateToPrevPath = () => {
    const location = useLocation()
    const to = location.pathname.substring(0, location.pathname.lastIndexOf("/"))
    return <Navigate to={to} replace />
}
