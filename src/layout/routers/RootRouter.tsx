import { Route, Routes } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { PrivateRouter } from "./PrivateRouter"

export const RootRouter = observer(() => {
    return (
        <Routes>
            <Route path="collection" element={<div>Domen shared collection</div>} />
            <Route path="privacy-policy" element={<div>Privacy</div>} />
            <Route path="terms" element={<div>Terms</div>} />
            <Route path="*" element={<PrivateRouter />} />
        </Routes>
    )
})
