import { Block } from "baseui/block"

interface ContentContainerProps {
    children: React.ReactNode
}

export const ContentContainer = ({ children, ...props }: ContentContainerProps) => {
    return (
        <Block flex={1} display="flex" justifyContent="center">
            <Block display="flex" width={["100%", "100%", "1280px"]} {...props}>
                {children}
            </Block>
        </Block>
    )
}
