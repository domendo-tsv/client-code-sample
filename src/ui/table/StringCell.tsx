import { useStyletron } from "baseui"

interface IStringCell {
    value: string
}

export const StringCell = ({ value }: IStringCell) => {
    const [css, theme] = useStyletron()

    return (
        <div className={css({ display: "flex", alignItems: "center" })}>
            <span className={css({ ...theme.typography.MonoParagraphSmall, fontSize: "12px" })}>{value}</span>
        </div>
    )
}
