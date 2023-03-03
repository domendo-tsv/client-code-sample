import { Block } from "baseui/block"
import { observer } from "mobx-react-lite"

interface IScrollableContent {
    children: React.ReactNode
}

export const ScrollableContent = observer(({ children }: IScrollableContent) => {
    return (
        <Block position="relative" display="flex" flex={1}>
            <Block position="absolute" top={0} bottom={0} left={0} right={0} overflow="auto">
                {children}
            </Block>
        </Block>
    )
})
