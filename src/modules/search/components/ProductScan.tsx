import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import BarcodeScannerComponent from "react-qr-barcode-scanner"
import { Block } from "baseui/block"
import { ModalBody } from "baseui/modal"
import { DURATION, useSnackbar } from "baseui/snackbar"
import { HeadingXSmall, LabelSmall } from "baseui/typography"
import { observable, runInAction } from "mobx"
import { observer, useLocalObservable } from "mobx-react-lite"
import { HandledError } from "../../../error"
import { ProductGTINSearchResponse } from "../../../interfaces"
import Api from "../../../services/Api"
import DialogService from "../../../services/DialogService"
import { Modal } from "../../../ui/modal"

interface IProductScan {
    onFound: (item: ProductGTINSearchResponse) => void
}

export const ProductScan = observer(({ onFound }: IProductScan) => {
    const { enqueue, dequeue } = useSnackbar()
    const { t } = useTranslation()

    const state = useLocalObservable(
        () => ({
            onFound,
            enqueue,
            dequeue,

            isLoading: false,
            error: null as HandledError | null,

            stopStream: false,

            setStopStream() {
                this.stopStream = true
            },

            async execSearch(value: string) {
                this.stopStream = true

                this.isLoading = true

                let item: ProductGTINSearchResponse | null = null
                let error: HandledError | null = null

                // Temporary fix!
                if (value.charAt(0) === "0") {
                    value = value.slice(1)
                }

                try {
                    item = await Api.get<ProductGTINSearchResponse>(`/products/search/gtin/${value}`)
                } catch (e) {
                    error = e
                }

                runInAction(() => {
                    this.error = error
                    this.isLoading = false

                    if (this.error) {
                        this.enqueue({
                            message: this.error?.errorMessage,
                        })
                    } else if (item) {
                        this.onFound(item)
                        this.dequeue()

                        DialogService.popDialog()
                    }
                })
            },
        }),
        { onFound: observable.ref, enqueue: observable.ref, dequeue: observable.ref },
    )

    useEffect(() => {
        enqueue({
            message: t("common.loading_camera"),
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        runInAction(() => {
            state.enqueue = enqueue
            state.dequeue = dequeue
            state.onFound = onFound
        })

        return () => state.setStopStream()
    }, [enqueue, dequeue, onFound, state])

    return (
        <Modal closeable onClose={DialogService.popDialog} isOpen={DialogService.showModalPage}>
            <ModalBody>
                <Block display="flex" flexDirection="column" marginBottom="18px" gridGap="4px">
                    <HeadingXSmall marginBottom="12px" marginTop="0px">
                        {t("common.scan_product")}
                    </HeadingXSmall>
                    <LabelSmall>{t("common.scan_product_desc")}</LabelSmall>
                </Block>

                <BarcodeScannerComponent
                    width="100%"
                    height="100%"
                    stopStream={state.stopStream}
                    delay={100}
                    onUpdate={(_err, result) => {
                        if (result) {
                            const text = result.getText()
                            state.execSearch(text)
                            enqueue(
                                {
                                    message: `${t("common.searching")}`,
                                },
                                DURATION.short,
                            )
                        }
                    }}
                    onError={() => {
                        enqueue(
                            {
                                message: `${t("error.default")}`,
                            },
                            DURATION.short,
                        )
                    }}
                />
            </ModalBody>
        </Modal>
    )
})
