import { useTranslation } from "react-i18next"
import { styled, useStyletron } from "baseui"
import { Block } from "baseui/block"
import { Button, SIZE } from "baseui/button"
import { Tag } from "baseui/tag"
import { LabelSmall, MonoLabelXSmall } from "baseui/typography"
import { AnimatePresence, motion } from "framer-motion"
import { observer, useLocalObservable } from "mobx-react-lite"
import { HandledError } from "../../../error"
import { Product, ProductVariant } from "../../../interfaces"
import AppFormatter from "../../../stores/AppFormatter"

const SearchItemContainer = styled("div", ({ $theme }) => ({
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gridGap: "12px",
    padding: "12px",
    borderBottom: `solid 1px ${$theme.colors.borderOpaque}`,
}))
interface ISearchItem {
    item: Product
    onAddToCollection: (variant: ProductVariant) => void
}

export const SearchItem = observer(({ item, onAddToCollection }: ISearchItem) => {
    const [css] = useStyletron()
    const { t } = useTranslation()

    const state = useLocalObservable(() => ({
        isExpanded: false,
        selectedVariant: null as ProductVariant | null,

        isLoading: false,
        error: null as HandledError | null,

        toggleItem() {
            this.isExpanded = !this.isExpanded
        },

        onSelectedVariant(variant: ProductVariant) {
            this.selectedVariant = variant
        },
    }))

    return (
        <SearchItemContainer key={item.id}>
            <Block
                display="flex"
                gridGap="20px"
                alignItems="center"
                onClick={state.toggleItem}
                className={css({
                    cursor: "pointer",
                })}
            >
                <img src={item.media && item.media.length ? item.media[0] : ""} width="60px" />

                <Block flexDirection="column" display="flex">
                    <MonoLabelXSmall>{item.sku}</MonoLabelXSmall>
                    <LabelSmall>{item.name}</LabelSmall>
                    <MonoLabelXSmall>{item.colorway}</MonoLabelXSmall>
                </Block>
            </Block>

            <AnimatePresence initial={false}>
                {state.isExpanded && (
                    <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: "auto" },
                            collapsed: { opacity: 0, height: 0 },
                        }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <Block display="flex" flexDirection="column" gridGap="4px">
                            <Block display="flex" overflow="auto" paddingBottom="8px">
                                {item.variants?.map((variant, index) => (
                                    <Tag
                                        key={index}
                                        closeable={false}
                                        onClick={() => state.onSelectedVariant(variant)}
                                        variant={state.selectedVariant === variant ? "solid" : "light"}
                                        kind="neutral"
                                    >
                                        {AppFormatter.SizeSystem.getSizeString(variant.sizeChart)}
                                    </Tag>
                                ))}
                            </Block>
                            <Block display="flex" gridGap="12px">
                                <Button onClick={() => onAddToCollection(state.selectedVariant!)} size={SIZE.mini} disabled={!state.selectedVariant}>
                                    {t("collection.add_to_vault")}
                                </Button>
                            </Block>
                        </Block>
                    </motion.div>
                )}
            </AnimatePresence>
        </SearchItemContainer>
    )
})
