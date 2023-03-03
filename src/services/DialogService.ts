import { t } from "i18next"
import { makeAutoObservable } from "mobx"

export interface IDialogListenersConfig {
    getErrorMessage: (error: Error) => string
    onAlert: (title: string, text: string, onClose?: () => void | Promise<void>) => void
}

class DialogService {
    public dialogs: React.ReactNode[] = []

    private dialogListeners: IDialogListenersConfig | undefined

    constructor() {
        makeAutoObservable<DialogService, "dialogListeners">(
            this,
            {
                dialogListeners: false,
            },
            { autoBind: true },
        )
    }

    public registerDialogListeners(config: IDialogListenersConfig) {
        this.dialogListeners = config
    }

    public get showModalPage(): boolean {
        return this.dialogs.length > 0
    }

    public pushDialog(dialog: React.ReactNode): void {
        this.dialogs.push(dialog)
    }

    public popDialog() {
        if (this.dialogs.length > 0) {
            this.dialogs.pop()
        }
    }

    public popMultipleDialogs(numberOfDialogs: number): void {
        if (this.dialogs.length > 0) {
            for (let i = 0; i < numberOfDialogs; i++) {
                this.dialogs.pop()

                if (this.dialogs.length === 0) {
                    break
                }
            }
        }
    }

    public alert(text: string, onClose?: () => void | Promise<void>): void {
        this.ensureDialogListeners()
        this.dialogListeners?.onAlert("Alert", text, onClose)
    }

    public error(error: Error | string, onClose?: () => void | Promise<void>): void {
        this.ensureDialogListeners()
        if (this.dialogListeners) {
            const errorMessage = typeof error === "string" ? error : this.dialogListeners.getErrorMessage(error)
            this.dialogListeners.onAlert("Error", errorMessage, onClose)
        }
    }

    public alertValidationError(text?: string, onClose?: () => void | Promise<void>): void {
        this.alert(text || t("validation.default"), onClose)
    }

    private ensureDialogListeners() {
        if (!this.dialogListeners) {
            console.error("Please register dialog listeners.")
        }
    }
}

// dialog store is singletone
export default new DialogService()
