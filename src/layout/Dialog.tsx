import { Fragment } from "react"
import { observer } from "mobx-react-lite"
import DialogService from "../services/DialogService"

export const Dialog = observer(() => {
    return (
        <Fragment>
            {DialogService.dialogs.map((dialog, index) => (
                <Fragment key={index}>{dialog}</Fragment>
            ))}
        </Fragment>
    )
})
