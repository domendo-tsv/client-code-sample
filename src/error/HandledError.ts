import { t } from "i18next"
import { ErrorCode } from "./"

export class HandledError extends Error {
    public readonly isHandledError = true

    constructor(public readonly code: ErrorCode, message: string, public readonly data?: {}, public readonly internalData?: {}) {
        super(message)
    }

    public get status(): number {
        switch (this.code) {
            case ErrorCode.BadRequest:
                return 400

            case ErrorCode.Forbidden:
                return 403

            case ErrorCode.ExternalError:
                return 502

            case ErrorCode.Unauthorized:
                return 401

            default:
                return 404
        }
    }

    public get errorMessage(): string {
        switch (this.code) {
            case ErrorCode.EmailInUse:
                return t("error.email_in_use")

            case ErrorCode.InvalidEmail:
                return t("error.email_invalid")

            case ErrorCode.UsernameExists:
                return t("error.username_exists")

            case ErrorCode.UserDoesNotExists:
                return t("error.email_not_exists")

            case ErrorCode.InvalidPassword:
                return t("error.invalid_password")

            case ErrorCode.AccountExists:
                return t("error.account_exists")

            case ErrorCode.FormLoginEmpty:
                return t("error.login_empty")

            case ErrorCode.NotFound:
                return t("error.not_found")

            case ErrorCode.FormInvalidEmail:
                return t("error.not_valid", { field: "email" })

            case ErrorCode.FormEmailEmpty:
                return t("error.field_empty", { field: "email" })

            case ErrorCode.FormUsernameEmpty:
                return t("error.field_empty", { field: "username" })

            case ErrorCode.PasswordsNotMatch:
                return t("error.passwords_match")

            default:
                return t("error.unknown_error")
        }
    }
}
