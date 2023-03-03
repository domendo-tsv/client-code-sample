import { useTranslation } from "react-i18next"
import { useStyletron } from "baseui"
import { BlockOverrides } from "baseui/block"
import { SIZE, Spinner } from "baseui/spinner"
import { LabelSmall, LabelXSmall } from "baseui/typography"
import { observer } from "mobx-react-lite"
import { ErrorUtils } from "../../utils"

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

interface IListLoaderProps {
    isLoading: boolean
    error: Error | string | null
    items: unknown[] | null | undefined
}

export const ListLoader: React.FC<IListLoaderProps> = observer(({ isLoading, error, items }) => {
    const { t } = useTranslation()
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

    if (!items?.length) {
        return <LabelSmall>{t("common.list_empty")}</LabelSmall>
    }

    return null
})
