import { Block, BlockOverrides } from "baseui/block"
import { LabelXSmall } from "baseui/typography"
import { observer } from "mobx-react-lite"

const loginErrorLabelOverride: BlockOverrides = {
    Block: {
        style: ({ $theme }) => ({
            color: $theme.colors.jumpRed400,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        }),
    },
}

interface IErrorMessage {
    message: string
}

export const ErrorMessage = observer(({ message }: IErrorMessage) => {
    return (
        <Block margin="4px">
            <LabelXSmall overrides={loginErrorLabelOverride}>{message}</LabelXSmall>
        </Block>
    )
})
