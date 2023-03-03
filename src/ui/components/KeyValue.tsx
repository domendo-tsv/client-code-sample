import { styled, useStyletron } from "baseui"
import { Block, StyledBlockProps } from "baseui/block"
import { LabelXSmall, MonoLabelXSmall } from "baseui/typography"

interface IKeyValueProps extends StyledBlockProps {
    label: string
    value: React.ReactNode
    subText?: React.ReactNode
    truncateValue?: boolean
}

export const TextComponent = styled(MonoLabelXSmall, {
    textOverflow: "ellipsis",
    overflow: "hidden",
    maxWidth: "250px",
    whiteSpace: "nowrap",
})

export const KeyValue = ({ label, value, ...props }: IKeyValueProps) => {
    const [css, theme] = useStyletron()
    return (
        <Block {...props} display="flex" flexDirection="column" gridGap="2px" justifyItems="flex-start" alignContent="flex-start">
            <LabelXSmall
                className={css({
                    color: theme.colors.contentInverseTertiary,
                    whiteSpace: "nowrap",
                    textTransform: "uppercase",
                })}
            >
                {label}
            </LabelXSmall>
            <TextComponent>{value}</TextComponent>
        </Block>
    )
}
