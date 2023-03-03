import { Fragment, useState } from "react"
import { useStyletron } from "baseui"
import { Block, BlockProps } from "baseui/block"
import { ChevronDown, ChevronUp } from "baseui/icon"
import { AnimatePresence, motion } from "framer-motion"
import { observer } from "mobx-react-lite"
import { useWindowSize } from "../hooks"

interface IResponsiveSidePanel extends BlockProps {
    children: React.ReactNode
    moreNode?: React.ReactNode
}

export const ResponsiveSidePanel = observer(({ children, moreNode, ...props }: IResponsiveSidePanel) => {
    const [css, theme] = useStyletron()
    const [expanded, setExpanded] = useState(false)

    const windowSize = useWindowSize()
    if (windowSize.width > 769) {
        return null
    }

    return (
        <Block
            display={["flex", "flex", "flex", "none"]}
            flexDirection="column"
            className={css({
                borderBottom: `solid 1px ${theme.colors.borderOpaque}`,
            })}
            {...props}
        >
            {children}

            {moreNode && (
                <Fragment>
                    <AnimatePresence initial={false}>
                        {expanded && (
                            <motion.div
                                key="content"
                                initial="collapsed"
                                animate="open"
                                exit="collapsed"
                                variants={{
                                    open: { opacity: 1, height: "auto" },
                                    collapsed: { opacity: 0, height: 0 },
                                }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            >
                                {moreNode}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <Block
                        display="flex"
                        width="100%"
                        justifyContent="center"
                        alignItems="center"
                        onClick={() => setExpanded(!expanded)}
                        className={css({
                            cursor: "pointer",
                            paddingBottom: "8px",
                        })}
                    >
                        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </Block>
                </Fragment>
            )}
        </Block>
    )
})
