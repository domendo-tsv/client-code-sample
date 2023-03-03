import { Block } from "baseui/block"
import { DatePicker, DatepickerProps } from "baseui/datepicker"
import { FormControl } from "baseui/form-control"
import { observer } from "mobx-react-lite"
import { IValidation } from "../../layout/validation"

interface IDateTimeInput extends DatepickerProps<Date> {
    label?: string
    caption?: string
    className?: string
    inputClassName?: string
    useUppercaseLabel?: boolean
    onDateChange: (val: string | undefined | null) => void
    validation?: IValidation
}

export const DateTimeInput = observer(({ label, caption, className, validation, value, onDateChange, ...props }: IDateTimeInput) => {
    const showError = validation && validation.showError && validation.errors.length > 0

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
                <DatePicker
                    value={value}
                    onChange={({ date }) => {
                        const dateValue = Array.isArray(date) ? date[0] : date
                        onDateChange(dateValue?.toISOString())
                    }}
                    error={showError}
                    {...props}
                />
            </FormControl>
        </Block>
    )
})

DateTimeInput.displayName = "DateTimeInput"
