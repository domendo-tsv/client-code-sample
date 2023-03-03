import _ from "lodash"
import { makeAutoObservable, runInAction } from "mobx"
import { isRelativeKey, Validation, ValidationError, ValidationStringPath } from "."

export class ValidationPropertyValidator<T> {
    readonly validator: Validation<T>
    readonly propertyPath: string
    showError = false

    constructor(validator: Validation<T>, propertyPath: string) {
        this.propertyPath = propertyPath
        this.validator = validator
        setTimeout(() => {
            runInAction(() => {
                this.validate(_.get(this.validator.value, this.propertyPath))
                this.showError = false
            })
        })
        makeAutoObservable(this, undefined, { autoBind: true })
    }

    validateValidOnly = (value: unknown) => {
        this.validator.validateKey(this.propertyPath as unknown as ValidationStringPath<T>, value)
    }

    validate(value: unknown) {
        this.validator.validateKey(this.propertyPath as unknown as ValidationStringPath<T>, value)
    }

    setShowError(showError: boolean) {
        this.showError = showError
    }

    get isValid() {
        return !this.errors.length
    }

    get errors(): ValidationError[] {
        return this.validator.errors.filter((error) => isRelativeKey(this.propertyPath, error.path))
    }
}
