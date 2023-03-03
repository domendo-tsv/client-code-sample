import Joi from "joi"
import _ from "lodash"
import { makeAutoObservable } from "mobx"
import { ValidationError, ValidationPropertyValidator, ValidationStringPath } from "."

export class Validation<T> {
    private readonly joiSchema: Joi.Schema
    private pathValidators: Record<string, ValidationPropertyValidator<T>> = {}
    private result: Joi.ValidationResult<unknown> = {} as Joi.ValidationResult<unknown>
    value: unknown = undefined
    showError = false

    private get isPrimitive() {
        return this.joiSchema.type !== "object"
    }

    get isValid(): boolean {
        return !this.errors.length
    }

    get errors(): ValidationError[] {
        return this.result.error?.details?.map((error) => new ValidationError(error.path.join("."), error)) || []
    }

    constructor(joiSchema: Joi.Schema, readonly options: Joi.ValidationOptions = {}) {
        this.joiSchema = joiSchema
        makeAutoObservable(this, undefined, { autoBind: true })
        this.clear()
    }

    setShowError(showError: boolean) {
        this.showError = showError
    }

    getRule(key: ValidationStringPath<T>): ValidationPropertyValidator<T> {
        if (this.isPrimitive) {
            throw new Error("getRule is invoked on primitive type!")
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.pathValidators[key] ??= new ValidationPropertyValidator<T>(this, key)
        return this.pathValidators[key]
    }

    getRuleUnsafe(key: string): ValidationPropertyValidator<T> {
        return this.getRule(key as unknown as ValidationStringPath<T>)
    }

    validateKey(key: ValidationStringPath<T>, value: unknown) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this.validateKeyExtended(key, value)
    }

    validateKeyUnsafe(key: string, value: unknown) {
        return this.validateKey(key as unknown as ValidationStringPath<T>, value)
    }

    validate(value: unknown) {
        this.validateExtended(value)
    }

    validateValidOnly(value: unknown) {
        this.validateExtended(value, false)
    }

    clear() {
        this.showError = false
        this.value = this.isPrimitive ? undefined : {}
        this.result = this.joiSchema.validate(this.value, { abortEarly: false, ...this.options })
        Object.entries(this.pathValidators).forEach(([, value]) => {
            value.validate(undefined)
            value.setShowError(false)
        })
    }

    private validateExtended(value: unknown, handleShowError = true) {
        this.value = _.cloneDeep(value)
        this.result = this.joiSchema.validate(value, { abortEarly: false, ...this.options })

        if (handleShowError) {
            if (this.isPrimitive) {
                this.showError = true
            } else {
                Object.entries(this.pathValidators).forEach(([, rule]) => rule.setShowError(true))
            }
        }
    }

    private validateKeyExtended(key: ValidationStringPath<T>, value: unknown, handleShowError = true) {
        if (this.isPrimitive) {
            throw new Error("validateKey is invoked on primitive type!")
        }

        const pathKey = key as unknown as string
        _.set(this.value as {}, pathKey, value)

        // if rule path does not exists, add it
        if (!this.pathValidators[pathKey]) {
            this.getRuleUnsafe(pathKey)
        }

        this.result = this.joiSchema.validate(this.value, { abortEarly: false, ...this.options })

        // validate
        if (handleShowError) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            Object.entries(this.pathValidators)
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                .filter(([key]) => isRelativeKey(key, pathKey))
                .forEach(([_, rule]) => {
                    rule.showError = true
                })
        }
    }
}

export const isRelativeKey = (path: string, parentPath: string) => {
    return path.startsWith(parentPath) && (path === parentPath || [".", "["].includes(path[parentPath.length]))
}
