import Joi from "joi"

const regex = {
    key: /"(.*)"/g,
}

export class ValidationError {
    readonly error: Joi.ValidationErrorItem
    readonly path: string

    get message() {
        const match = this.error.message.match(regex.key)
        if (match?.length) {
            return this.error.message.replace(match[0] as unknown as string, "").trim()
        }
        return this.error.message
    }

    constructor(path: string, error: Joi.ValidationErrorItem) {
        this.path = path
        this.error = error
    }
}
