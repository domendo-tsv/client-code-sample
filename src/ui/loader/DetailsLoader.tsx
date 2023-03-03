import { useStyletron } from "baseui"
import { BlockOverrides } from "baseui/block"
import { SIZE, Spinner } from "baseui/spinner"
import { LabelXSmall } from "baseui/typography"
import { observer } from "mobx-react-lite"
import { ErrorUtils } from "../../utils"

const loginErrorLabelOverride: BlockOverrides = {
    Block: {
        style: ({ $theme }) => ({
            display: "flex",
            color: $theme.colors.jumpRed400,
            overflow: "hidden",
            alignSelf: "center",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        }),
    },
}

interface IDetailsLoaderProps {
    isLoading: boolean
    error: Error | string | null
}

export const DetailsLoader: React.FC<IDetailsLoaderProps> = observer(({ isLoading, error }) => {
    const [css] = useStyletron()

    if (isLoading) {
        return (
            <Spinner
                $size={SIZE.small}
                className={css({
                    alignSelf: "center",
                    margin: "12px",
                })}
                $color="#000000"
            />
        )
    }

    if (error) {
        return <LabelXSmall overrides={loginErrorLabelOverride}>{typeof error === "string" ? error : ErrorUtils.getErrorMessage(error)}</LabelXSmall>
    }

    return null
})
