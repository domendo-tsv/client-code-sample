import { MouseEventHandler } from "react"
import { styled } from "baseui"
import { observer } from "mobx-react-lite"

interface ICellContainer {
    children: React.ReactNode
    onClick?: MouseEventHandler<HTMLDivElement> | undefined
}

const Container = styled("div", () => ({
    display: "flex",
    padding: "8px",
    cursor: "pointer",
}))

export const CellContainer = observer(({ children, onClick }: ICellContainer) => {
    return <Container onClick={onClick}>{children}</Container>
})
