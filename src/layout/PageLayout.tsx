import { Outlet } from "react-router-dom"
import { styled } from "baseui"
import { observer } from "mobx-react-lite"
import { HeaderNavigation } from "./HeaderNavigation"

const StyledMainContainer = styled("div", {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#F6F6F6",
})

const StyledContentContainer = styled("div", {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
})

export const PageLayout = observer(() => {
    return (
        <StyledMainContainer>
            <HeaderNavigation />
            <StyledContentContainer>
                <Outlet />
            </StyledContentContainer>
        </StyledMainContainer>
    )
})
