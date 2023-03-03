import { Modal as BaseUIModal, ModalProps } from "baseui/modal"
import { observer } from "mobx-react-lite"

type IModal = ModalProps

export const Modal = observer(({ ...props }: IModal) => {
    return (
        <BaseUIModal
            overrides={{
                Dialog: {
                    style: ({ $theme }) => ({
                        border: `solid 1px ${$theme.colors.borderOpaque}`,
                        borderRadius: "0px",
                    }),
                },
            }}
            {...props}
        />
    )
})
