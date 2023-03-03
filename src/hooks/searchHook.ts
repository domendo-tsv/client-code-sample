import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { isNull, omitBy } from "lodash"

export function useSearch<T extends Record<string, string | undefined> = {}, T1 extends Record<string, string | undefined> = {}>(
    defaultSearch?: T,
    map: (params: Record<string, string | undefined>) => T1 = () => ({} as T1),
): [T & T1, (newSearch: T) => void] {
    const [defaultInit, nextInit] = useSearchParams(omitBy(defaultSearch, isNull) as Record<string, string>)

    const search = useMemo(() => {
        const defaultSearch = Object.fromEntries(defaultInit || {}) as T
        const mappedSearch = map(defaultSearch)

        return { ...defaultSearch, ...mappedSearch }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultInit])

    const nextInitFunc = (newSearch: T) => {
        Object.keys(newSearch).forEach((key) => (newSearch[key] === undefined ? delete newSearch[key] : {}))
        if (newSearch) nextInit(omitBy(newSearch, isNull) as Record<string, string>)
    }
    return [search, nextInitFunc]
}
