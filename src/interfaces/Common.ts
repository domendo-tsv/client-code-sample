export interface ValidateResponse {
    valid: boolean
}

export interface PaginatedResponse<T> {
    meta: PaginatedMeta
    data: T[]
}

export interface PaginatedMeta {
    total: number
    from: number
    to: number
}

export interface Currency {
    name: string
    symbol: string
}

export type Query<T extends string = string> = Partial<Record<T, string | undefined>>
