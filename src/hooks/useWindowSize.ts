import { useEffect, useState } from "react"

interface IWindowSize {
    width: number
    height: number
}

export const useWindowSize = () => {
    const isSSR = typeof window !== "undefined"
    const [windowSize, setWindowSize] = useState<IWindowSize>({
        width: isSSR ? 1200 : window.innerWidth,
        height: isSSR ? 800 : window.innerHeight,
    })

    function changeWindowSize() {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    useEffect(() => {
        changeWindowSize()

        window.addEventListener("resize", changeWindowSize)
        return () => {
            window.removeEventListener("resize", changeWindowSize)
        }
    }, [])

    return windowSize
}
