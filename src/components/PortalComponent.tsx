import { ReactNode, useEffect } from "react"
import { useStyletron } from "baseui"
import { Block } from "baseui/block"
import { observer } from "mobx-react-lite"

interface IDropdownContainerProps {
    children?: ReactNode
    refe?: ((instance: HTMLDivElement | null) => void) | React.RefObject<HTMLDivElement> | null | undefined
    state: {
        hideTooltip: (event: Event) => void
        calcIf: () => void
    }
}

export const PortalComponent: React.FC<IDropdownContainerProps> = observer(({ children, state, refe }) => {
    const [css] = useStyletron()

    useEffect(() => {
        window.addEventListener("scroll", state.hideTooltip, true)
        window.addEventListener("resize", state.calcIf)
        return () => {
            window.removeEventListener("scroll", state.hideTooltip, true)
            window.addEventListener("resize", state.calcIf)
        }
    }, [state.hideTooltip, state.calcIf])

    return (
        <Block
            ref={refe}
            display="flex"
            className={css({
                display: "flex",
                zIndex: 99999,
                opacity: 0,
                transition: "opacity 0.2s",
                position: "absolute",
                willChange: "transform",
            })}
        >
            {children}
        </Block>
    )
})
