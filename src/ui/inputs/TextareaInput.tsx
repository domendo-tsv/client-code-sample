import { ChangeEvent } from "react"
import { Block } from "baseui/block"
import { FormControl } from "baseui/form-control"
import { Textarea, TextareaProps } from "baseui/textarea"
import { observer } from "mobx-react-lite"
import { IValidation } from "../../layout/validation"

interface ITextInput extends TextareaProps {
    label?: string
    caption?: string
    className?: string
    inputClassName?: string
    value?: string
    useUppercaseLabel?: boolean
    onTextChange?: (val: string) => void
    validation?: IValidation
}

export const TextareaInput = observer(({ label, className, caption, validation, value, onTextChange, ...props }: ITextInput) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (onTextChange) {
            const val = e.target.value
            if (val !== value) {
                onTextChange(val)
            }
        }
    }

    const handleBlur = () => {
        if (validation?.setShowError) {
            validation?.setShowError(true)
        }
    }

    const showError = validation && validation.showError && validation.errors.length > 0

    return (
        <Block className={className}>
            <FormControl
                label={label}
                caption={caption}
                overrides={{
                    ControlContainer: {
                        style: () => ({
                            marginBottom: "0px",
                        }),
                    },
                }}
            >
                <Textarea onBlur={handleBlur} error={showError} value={value ?? ""} onChange={handleChange} {...props} />
            </FormControl>
        </Block>
    )
})

TextareaInput.displayName = "TextareaInput"
