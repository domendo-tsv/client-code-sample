import { Block, BlockProps } from "baseui/block"
import { FormControl } from "baseui/form-control"
import { Options, Select, SelectOverrides, Value } from "baseui/select"
import { observer } from "mobx-react-lite"
import { IValidation } from "../../layout/validation"

interface IDropdown extends Pick<BlockProps, "flex" | "minWidth"> {
    label?: string
    caption?: string
    className?: string
    inputClassName?: string
    placeholder?: string
    value?: Value | undefined
    disabled?: boolean
    options?: Options
    useUppercaseLabel?: boolean
    onSelect: (val: string[] | undefined) => void
    validation?: IValidation
    multi?: boolean
    size?: "mini" | "default" | "compact" | "large" | undefined
    overrides?: SelectOverrides | undefined
    creatable?: boolean
    clearable?: boolean
}

export const Dropdown = observer(
    ({
        label,
        caption,
        placeholder,
        disabled,
        validation,
        overrides,
        options,
        value,
        multi,
        creatable,
        size,
        clearable = false,
        onSelect,
        ...props
    }: IDropdown) => {
        const showError = validation && validation.showError && validation.errors.length > 0

        const onChange = (value: Value) => {
            const values = value?.map((e) => (e as { value: string }).value)
            onSelect(values && values.length > 0 ? values : undefined)
        }

        if (!label && !caption) {
            return (
                <Select
                    value={value}
                    size={size ?? "compact"}
                    onChange={({ value }) => onChange(value)}
                    options={options}
                    searchable={creatable ? true : false}
                    clearable={clearable}
                    disabled={disabled}
                    placeholder={placeholder}
                    labelKey="text"
                    valueKey="value"
                    multi={multi}
                    overrides={overrides}
                    creatable={creatable}
                    error={showError}
                />
            )
        }

        return (
            <Block {...props}>
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
                    <Select
                        value={value}
                        size={size ?? "compact"}
                        onChange={({ value }) => onChange(value)}
                        options={options}
                        searchable={creatable ? true : false}
                        clearable={clearable}
                        labelKey="text"
                        valueKey="value"
                        disabled={disabled}
                        placeholder={placeholder}
                        multi={multi}
                        overrides={overrides}
                        creatable={creatable}
                        error={showError}
                    />
                </FormControl>
            </Block>
        )
    },
)

Dropdown.displayName = "Dropdown"
