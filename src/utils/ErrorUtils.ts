import { exists, t } from "i18next"

interface IAdminError {
    code?: string
    message?: string
    data?: {}
}

export default {
    getErrorMessage(error: Error): string {
        let text: string | undefined

        const adminError = error as IAdminError
        if (adminError?.code) {
            if (adminError.code === "error_text" /* equivalent to ErrorCode.ErrorText */) {
                text = adminError.message
            } else {
                const errorKey = `error.${adminError.code}`
                if (exists(errorKey)) {
                    if (adminError.data) {
                        text = t(errorKey, adminError.data)
                    } else {
                        text = t(errorKey)
                    }
                }

                // special case for active sale candidates import, where error gets proxied, and we want to show it as it is
                if (!text && adminError.code === "proxy_error" /* equivalent to ErrorCode.ProxyError */) {
                    text = adminError.message
                }
            }
        }

        if (!text) {
            text = t("error.default") || ""
        }

        return text
    },
}
