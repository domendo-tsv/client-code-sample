import { Outlet } from "react-router-dom"
import { Block } from "baseui/block"
import { observer } from "mobx-react-lite"

export const RouteContainer = observer(() => {
    return (
        <Block flex={1} display="flex" justifyContent="center">
            <Block display="flex" width={["100%", "100%", "1280px"]}>
                <Outlet />
            </Block>
        </Block>
    )
})
