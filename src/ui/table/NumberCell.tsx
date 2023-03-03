import { useStyletron } from "baseui"
import { ArrowDown, ArrowUp } from "baseui/icon"
import AppFormatter from "../../stores/AppFormatter"

interface INumberCell {
    value: number
    diff?: number
}

export const NumberCell = ({ value, diff }: INumberCell) => {
    const [css, theme] = useStyletron()
    const positive = diff ? diff >= 0 : undefined
    return (
        <div className={css({ display: "flex", alignItems: "center" })}>
            <span className={css({ ...theme.typography.MonoParagraphSmall, fontSize: "12px" })}>{AppFormatter.PriceFormater.format(value)}</span>
            {diff && (
                <div
                    className={css({
                        alignItems: "center",
                        display: "flex",
                        paddingLeft: theme.sizing.scale300,
                        color: positive ? theme.colors.contentPositive : theme.colors.contentNegative,
                    })}
                >
                    {positive ? <ArrowUp /> : <ArrowDown />}
                    <span
                        className={css({
                            ...theme.typography.MonoLabelSmall,
                            paddingLeft: "2px",
                            fontSize: "12px",
                        })}
                    >
                        {AppFormatter.PriceFormater.format(diff)}
                    </span>
                </div>
            )}
        </div>
    )
}
