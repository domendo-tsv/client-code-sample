import { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { styled } from "baseui"
import { Block } from "baseui/block"
import { Button, KIND, SIZE } from "baseui/button"
import { Search } from "baseui/icon"
import { Input } from "baseui/input"
import { MonoHeadingXSmall } from "baseui/typography"
import { sample } from "lodash"
import { observable, runInAction } from "mobx"
import { observer, useLocalObservable } from "mobx-react-lite"
import { HandledError } from "../../error"
import { PaginatedMeta, PaginatedResponse, Product, ProductGTINSearchResponse } from "../../interfaces"
import Api from "../../services/Api"
import DialogService from "../../services/DialogService"
import { BarcodeIcon } from "../../ui/icons"
import { ListLoader } from "../../ui/loader"
import { ProductScan, SearchItem } from "./components"

const minDocumentOffset = 16 // minimum margin from window edges
const maxWidth = 1280

const findParentRecursive = (parent: HTMLElement, node: HTMLElement | null): boolean => {
    if (!node) {
        return false
    }
    return node === parent || findParentRecursive(parent, node?.parentNode as HTMLElement | null)
}

const BarContainer = styled("div", ({ $theme }) => ({
    backgroundColor: $theme.colors.mono100,
    border: `solid 1px ${$theme.colors.borderOpaque}`,
    display: "flex",
    position: "relative",
    justifyContent: "center",
    height: "56px",
}))

const SearchPopoverContainer = styled("div", ({ $theme }) => ({
    backgroundColor: $theme.colors.mono100,
    border: `solid 1px ${$theme.colors.borderOpaque}`,
    position: "absolute",
    overflow: "auto",
}))

const PlaceholderExamples: string[] = ["Yeezy 350", "Nike Dunk Low", "Air Jordan 1", "Air Jordan 4", "Nike SB"]

export const SearchBar = observer(() => {
    const { t } = useTranslation()
    const ref = useRef<null | HTMLDivElement>(null)

    const navigate = useNavigate()

    const state = useLocalObservable(
        () => ({
            navigate,
            ref,
            searchRef: undefined as undefined | HTMLDivElement,
            showPopover: false,

            searchValue: "",

            isLoading: false,
            error: null as HandledError | null,
            metadata: null as PaginatedMeta | null,

            items: null as Product[] | null,

            query: {} as Record<string, string>,

            get showLoadMore() {
                return (!this.isLoading || !this.error) && this.metadata && this.metadata.to < this.metadata.total
            },

            setSearchValue(value: string) {
                this.searchValue = value

                if (!this.searchValue) {
                    this.showPopover = false
                }
            },

            async execSearch(q: string) {
                this.isLoading = true

                let items: Product[] | null = null
                let error: HandledError | null = null
                let metadata: PaginatedMeta | null = null

                this.query = { q, from: "0", limit: "10" }

                try {
                    const queryBody = new URLSearchParams(this.query).toString()
                    const { data, meta } = await this.search(queryBody)
                    items = data
                    metadata = meta
                } catch (e) {
                    error = e
                }

                runInAction(() => {
                    if (items) {
                        this.items = items
                    }
                    this.metadata = metadata
                    this.error = error
                    this.isLoading = false
                })
            },

            async loadMore() {
                this.isLoading = true

                const query = this.query ?? {}
                if (query.from && query.limit) {
                    const from = parseInt(query.from)
                    const limit = parseInt(query.limit)
                    query.from = (from + limit).toString()
                }

                this.query = query

                let items: Product[] | null = null
                let error: HandledError | null = null
                let metadata: PaginatedMeta | null = null

                try {
                    const queryBody = new URLSearchParams(query).toString()
                    const { data, meta } = await this.search(queryBody)
                    items = data
                    metadata = meta
                } catch (e) {
                    error = e
                }

                runInAction(() => {
                    if (items) {
                        this.items = [...(this.items ?? []), ...items]
                    }

                    this.metadata = metadata
                    this.error = error
                    this.isLoading = false
                })
            },

            search(query: string) {
                return Api.get<PaginatedResponse<Product>>(`/products/search?${query}`)
            },

            addProductToCollection(productId: string, variantId: string) {
                this.searchValue = ""
                this.showPopover = false

                this.navigate(`/vault/in-vault/new/${productId}?variantId=${variantId}`)
            },

            onEnterClick() {
                if (this.searchValue) {
                    this.showPopover = true
                    this.execSearch(this.searchValue)
                } else {
                    this.showPopover = false
                }
            },

            calcIf() {
                this.setPortalRef()
            },

            setPortalRef(_searchRef?: HTMLDivElement | null) {
                if (_searchRef) {
                    this.searchRef = _searchRef ?? undefined
                }

                const { ref, searchRef } = this
                if (!ref?.current || !searchRef) {
                    return
                }

                // Set Width
                if (document.body.clientWidth >= maxWidth) {
                    searchRef.style.width = `${maxWidth}px`
                } else {
                    searchRef.style.width = `${document.body.clientWidth}px`
                }

                // Position center
                if (document.body.clientWidth >= maxWidth) {
                    const left = (document.body.clientWidth - maxWidth) / 2
                    searchRef.style.left = `${left}px`
                } else {
                    searchRef.style.left = `0px`
                }

                // Position below Search input
                const clickableRect = ref.current.getBoundingClientRect()
                searchRef.style.top = `${clickableRect.height - 2}px`
                searchRef.style.maxHeight = `${document.body.clientHeight - clickableRect.bottom - minDocumentOffset}px`
                searchRef.style.zIndex = "10"
            },

            onMouseDown(event: MouseEvent) {
                const mainNode = this.ref.current
                const dropdownNode = this.searchRef

                const isClickableNodeClicked = mainNode ? findParentRecursive(mainNode, event.target as HTMLElement) : false
                const isDropdownNodeClicked = dropdownNode ? findParentRecursive(dropdownNode, event.target as HTMLElement) : false

                if (!isClickableNodeClicked && !isDropdownNodeClicked) {
                    this.showPopover = false
                }
            },
        }),
        { navigate: observable.ref },
    )

    useEffect(() => {
        runInAction(() => {
            state.ref = ref
            state.navigate = navigate
        })
    }, [state, ref, navigate])

    useEffect(() => {
        window.addEventListener("mousedown", state.onMouseDown)
        window.addEventListener("resize", state.calcIf)
        return () => {
            window.removeEventListener("mousedown", state.onMouseDown)
            window.addEventListener("resize", state.calcIf)
        }
    }, [state.calcIf, state.onMouseDown])

    return (
        <BarContainer ref={ref}>
            <Block
                display="flex"
                width="100%"
                maxWidth={["100%", "100%", "1280px"]}
                paddingLeft="8px"
                paddingRight="8px"
                alignItems="center"
                position="relative"
                gridGap="12px"
            >
                <SearchBarInput
                    searchValue={state.searchValue}
                    onValueChange={state.setSearchValue}
                    onEnterClick={state.onEnterClick}
                    onFocus={() => {
                        runInAction(() => {
                            if (state.searchValue && !state.showPopover) {
                                state.showPopover = true
                            }
                        })
                    }}
                />
                <ScanProductButton addProductToCollection={(item) => state.addProductToCollection(item.productId, item.variantId)} />
            </Block>

            {state.showPopover && (
                <SearchPopoverContainer ref={state.setPortalRef}>
                    <Block flex={1} display="flex" flexDirection="column" padding="24px">
                        <MonoHeadingXSmall marginTop="0px" marginBottom="8px" font={["font450", "font450", "font550"]}>{`${t(
                            "common.results_for",
                        )} "${state.searchValue}"`}</MonoHeadingXSmall>

                        {state.items?.map((item) => (
                            <SearchItem
                                key={item.id}
                                item={item}
                                onAddToCollection={(variant) => {
                                    state.addProductToCollection(item.id, variant.id)
                                }}
                            />
                        ))}

                        {state.showLoadMore && (
                            <Block display="flex" justifyContent="center" margin="12px">
                                <Button onClick={state.loadMore} kind={KIND.secondary} size={SIZE.mini}>
                                    {t("common.load_more")}
                                </Button>
                            </Block>
                        )}

                        <Block marginTop="12px" display="flex" justifyContent="center">
                            <ListLoader isLoading={state.isLoading} error={state.error} items={state.items} />
                        </Block>
                    </Block>
                </SearchPopoverContainer>
            )}
        </BarContainer>
    )
})

interface ISearchBarInput {
    searchValue: string
    onValueChange: (val: string) => void
    onEnterClick: () => void
    onFocus: () => void
}

const SearchBarInput = observer(({ searchValue, onValueChange, onEnterClick, onFocus }: ISearchBarInput) => {
    const placeholder = sample(PlaceholderExamples)

    return (
        <Block display="flex" alignItems="center" flex={1}>
            <Search size="24px" />
            <Input
                overrides={{
                    Root: {
                        style: ({ $theme }) => ({
                            flex: 1,
                            backgroundColor: $theme.colors.mono100,
                            borderTopWidth: "0px",
                            borderBottomWidth: "0px",
                            borderRightWidth: "0px",
                            borderLeftWidth: "0px",
                        }),
                    },
                    Input: {
                        style: ({ $theme }) => ({
                            backgroundColor: $theme.colors.mono100,
                        }),
                    },
                    ClearIconContainer: {
                        style: ({ $theme }) => ({
                            backgroundColor: $theme.colors.mono100,
                        }),
                    },
                }}
                value={searchValue ?? ""}
                onChange={(e) => onValueChange(e.target.value)}
                placeholder={`Try \`${placeholder}\``}
                onFocus={onFocus}
                onKeyDown={(event) => {
                    event.stopPropagation()

                    if (event.key === "Enter") {
                        event.preventDefault()
                        onEnterClick()
                    }
                }}
                clearable
            />
        </Block>
    )
})

interface IScanProductButton {
    addProductToCollection: (item: ProductGTINSearchResponse) => void
}

const ScanProductButton = observer(({ addProductToCollection }: IScanProductButton) => {
    const { t } = useTranslation()
    return (
        <Button
            onClick={() => {
                DialogService.pushDialog(<ProductScan onFound={addProductToCollection} />)
            }}
            kind={KIND.primary}
            size={SIZE.compact}
        >
            <Block display="flex" gridGap="12px" alignItems="center">
                <BarcodeIcon width={"18px"} fill={"#ffffff"} />
                <Block display={["none", "none", "block"]}>{t("common.scan_product")}</Block>
            </Block>
        </Button>
    )
})
