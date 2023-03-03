import { ChangeEvent } from "react"
import { Block } from "baseui/block"
import { FormControl } from "baseui/form-control"
import { Input, InputProps } from "baseui/input"
import { observer } from "mobx-react-lite"
import { IValidation } from "../../layout/validation"

interface ITextInput extends InputProps {
    label?: string
    caption?: string
    className?: string
    inputClassName?: string
    value?: string
    useUppercaseLabel?: boolean
    onTextChange?: (val: string) => void
    validation?: IValidation
}

export const Textinput = observer(({ label, className, caption, validation, value, size, onTextChange, ...props }: ITextInput) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (onTextChange) {
            const val = e.target.value
            if (val !== value) {
                if (props.type === "number") {
                    const parsedVal = parseFloat(val)

                    if (props.max && parsedVal > props.max) {
                        return
                    }

                    if (props.min && parsedVal < props.min) {
                        return
                    }
                }

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

    if (!label && !caption) {
        return <Input size={size ?? "compact"} {...props} onBlur={handleBlur} error={showError} value={value ?? ""} onChange={handleChange} />
    }

    return (
        <Block flex={1} className={className}>
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
                <Input size={size ?? "compact"} {...props} onBlur={handleBlur} error={showError} value={value ?? ""} onChange={handleChange} />
            </FormControl>
        </Block>
    )
})

Textinput.displayName = "TextInput"
