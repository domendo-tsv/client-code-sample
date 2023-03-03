import { styled } from "baseui"
import { Block } from "baseui/block"
import { ParagraphSmall } from "baseui/typography"
import { observer } from "mobx-react-lite"

interface ITabContent {
    children: React.ReactNode
}

export const TabContent = observer(({ children }: ITabContent) => {
    return (
        <Block height="54px" display="flex" flex={1}>
            {children}
        </Block>
    )
})

interface ITab {
    label: string
    isActive: boolean
    onClick: () => void
}

type CustomProp = { $isActive: boolean }

const TabStyled = styled<"div", CustomProp>("div", ({ $theme, $isActive }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "80px",
    cursor: "pointer",
    borderBottom: $isActive ? `solid 2px ${$theme.colors.mono1000}` : undefined,
    "@media screen and (max-width: 600px)": {
        width: "100%",
    },
}))

export const Tab = observer(({ label, isActive, onClick }: ITab) => {
    return (
        <TabStyled onClick={onClick} $isActive={isActive}>
            <ParagraphSmall>{label}</ParagraphSmall>
        </TabStyled>
    )
})
