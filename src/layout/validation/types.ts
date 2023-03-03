type Primitive = string | number | bigint | boolean | undefined | symbol

type PropertyDeepPath<T, Prefix = ""> = {
    [K in keyof T]: T[K] extends Primitive
        ? `${string & Prefix}${string & K}`
        : `${string & Prefix}${string & K}` | PropertyDeepPath<T[K], `${string & Prefix}${string & K}.`>
}[keyof T]

type RequiredDeep<T> = T extends object ? { [P in keyof T]-?: RequiredDeep<NonNullable<T[P]>> } : T

export type ValidationStringPath<T> = PropertyDeepPath<RequiredDeep<T>> & string

interface Error {
    message: string
}

export interface IValidation {
    showError: boolean
    isValid: boolean
    setShowError?: (showError: boolean) => void
    errors: Error[]
}
