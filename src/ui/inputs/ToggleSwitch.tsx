import { ChangeEvent } from "react"
import { Block } from "baseui/block"
import { Checkbox, STYLE_TYPE } from "baseui/checkbox"
import { FormControl } from "baseui/form-control"
import { observer } from "mobx-react-lite"

interface IToggleSwitch {
    text?: string
    label?: string
    caption?: string
    className?: string
    checked?: boolean
    onChange: (checked: boolean) => void
}

export const ToggleSwitch = observer(({ label, className, caption, checked, text, onChange }: IToggleSwitch) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.checked
        if (val !== checked) {
            onChange(val)
        }
    }

    if (!label && !caption) {
        return (
            <Checkbox checked={checked} onChange={handleChange} checkmarkType={STYLE_TYPE.toggle_round}>
                {text}
            </Checkbox>
        )
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
                <Checkbox checked={checked} onChange={handleChange} checkmarkType={STYLE_TYPE.toggle_round}>
                    {text}
                </Checkbox>
            </FormControl>
        </Block>
    )
})

ToggleSwitch.displayName = "ToggleSwitch"
