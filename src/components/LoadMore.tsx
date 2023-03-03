import { useTranslation } from "react-i18next"
import { Block } from "baseui/block"
import { Button } from "baseui/button"
import { observer } from "mobx-react-lite"
import { PaginatedMeta } from "../interfaces"
import { useVaultListStore } from "../modules/vault/context"

interface ILoadMore {
    metadata: PaginatedMeta | null
}

export const LoadMore = observer(({ metadata }: ILoadMore) => {
    const { t } = useTranslation()

    const listStore = useVaultListStore()

    const onLoadMore = () => {
        listStore.loadMore()
    }

    if (!metadata || metadata.to >= metadata.total) {
        return null
    }

    return (
        <Block display="flex" justifyContent="center" margin="12px">
            <Button kind="secondary" size="compact" onClick={onLoadMore}>
                {t("common.load_more")}
            </Button>
        </Block>
    )
})
