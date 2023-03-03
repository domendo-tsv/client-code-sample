import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from "axios"
import _ from "lodash"
import { ErrorCode, HandledError } from "../error"
import AuthStore from "../stores/AuthStore"

enum HttpMethod {
    POST = "POST",
    PUT = "PUT",
    GET = "GET",
    DELETE = "DELETE",
    PATCH = "PATCH",
}

enum ResponseType {
    Blob = "blob",
}

interface IFetchOptions {
    allow204?: boolean
    region?: string
    cancelTokenSource?: CancelTokenSource
    headers?: Record<string, string>
    query?: Record<string, unknown>
}

export interface IApiDevBackendConfig {
    domain: string
    routePrefix: string
    apiServerUrl: string
}

class Api {
    private httpAgent = axios.create()

    public get<T>(url: string, options?: IFetchOptions): Promise<T> {
        let headers = options?.headers ? _.clone(options.headers) : undefined
        const token = this.getAuthorizationToken()

        if (token) {
            headers ??= {}
            headers["authorization"] = token
        }

        return this.request<T>(
            {
                url: this.generateApiUrl(url, options?.query),
                method: HttpMethod.GET,
                headers,
            },
            options,
        )
    }

    public getBlob(url: string): Promise<Blob> {
        return this.request({
            url: this.generateApiUrl(url),
            method: HttpMethod.GET,
            responseType: ResponseType.Blob,
            headers: {
                authorization: this.getAuthorizationToken() ?? "",
            },
            withCredentials: true,
        })
    }

    public postBlob(url: string, body?: {}, options?: IFetchOptions): Promise<Blob> {
        const headers = options?.headers ? _.clone(options.headers) : {}
        const token = this.getAuthorizationToken()

        if (token) {
            headers["authorization"] = token
        }

        headers["Content-Type"] = "application/json"

        return this.request(
            {
                url: this.generateApiUrl(url, options?.query),
                headers,
                data: JSON.stringify(body),
                method: HttpMethod.POST,
                responseType: ResponseType.Blob,
                withCredentials: true,
            },
            options,
        )
    }

    public patch<T>(url: string, body?: {} | FormData, options?: IFetchOptions): Promise<T> {
        const headers = options?.headers ? _.clone(options.headers) : {}
        const token = this.getAuthorizationToken()

        if (token) {
            headers["authorization"] = token
        }
        let parsedBody: string | FormData | undefined

        if (body instanceof FormData) {
            headers["Content-Type"] = "multipart/form-data"
            parsedBody = body
        } else if (body) {
            headers["Content-Type"] = "application/json"
            parsedBody = JSON.stringify(body)
        }

        return this.request<T>(
            {
                url: this.generateApiUrl(url, options?.query),
                headers,
                method: HttpMethod.PATCH,
                withCredentials: true,
                data: parsedBody,
            },
            options,
        )
    }

    public put<T>(url: string, body?: {} | FormData, options?: IFetchOptions): Promise<T> {
        const headers = options?.headers ? _.clone(options.headers) : {}
        const token = this.getAuthorizationToken()

        if (token) {
            headers["authorization"] = token
        }

        let parsedBody: string | FormData | undefined

        if (body instanceof FormData) {
            headers["Content-Type"] = "multipart/form-data"
            parsedBody = body
        } else if (body) {
            headers["Content-Type"] = "application/json"
            parsedBody = JSON.stringify(body)
        }

        return this.request<T>(
            {
                url: this.generateApiUrl(url, options?.query),
                data: parsedBody,
                headers,
                method: HttpMethod.PUT,
                withCredentials: true,
            },
            options,
        )
    }

    public post<T>(url: string, body?: {} | FormData, options?: IFetchOptions): Promise<T> {
        const headers = options?.headers ? _.clone(options.headers) : {}
        const token = this.getAuthorizationToken()

        if (token) {
            headers["authorization"] = token
        }

        let parsedBody: string | FormData | undefined

        if (body instanceof FormData) {
            parsedBody = body
            headers["Content-Type"] = "multipart/form-data"
        } else if (body) {
            headers["Content-Type"] = "application/json"
            parsedBody = JSON.stringify(body)
        }

        return this.request<T>(
            {
                url: this.generateApiUrl(url, options?.query),
                data: parsedBody,
                headers,
                method: HttpMethod.POST,
            },
            options,
        )
    }

    public upload<T>(url: string, form?: {} | FormData, progress?: (uploaded: number) => void, options?: IFetchOptions): Promise<T> {
        const headers = options?.headers ? _.clone(options.headers) : {}
        headers["Content-Type"] = "multipart/form-data"

        const token = this.getAuthorizationToken()

        if (token) {
            headers["authorization"] = token
        }

        return this.request<T>({
            url: this.generateApiUrl(url, options?.query),
            data: form,
            headers,
            method: HttpMethod.POST,
            withCredentials: true,
            onUploadProgress: (progressEvent: { loaded: number; total: number }) => {
                if (progress) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    progress(percentCompleted)
                }
            },
        })
    }

    public delete<T>(url: string, options?: IFetchOptions): Promise<T> {
        const headers = options?.headers ? _.clone(options.headers) : {}
        const token = this.getAuthorizationToken()

        if (token) {
            headers["authorization"] = token
        }

        return this.request<T>(
            {
                url: this.generateApiUrl(url, options?.query),
                headers,
                method: HttpMethod.DELETE,
                withCredentials: true,
            },
            { allow204: true, ...options },
        )
    }

    public getRawBlob(url: string): Promise<AxiosResponse> {
        const token = this.getAuthorizationToken()

        return this.rawRequest({
            url: this.generateApiUrl(url),
            method: HttpMethod.GET,
            responseType: ResponseType.Blob,
            headers: {
                authorization: token ?? "",
            },
            withCredentials: true,
        })
    }

    public generateApiUrl(url: string, query?: Record<string, unknown> | undefined): string {
        let apiUrl = `${import.meta.env.VITE_API_PREFIX}${url}`

        if (query) {
            let hasQueryParam = apiUrl.includes("?")
            Object.entries(query).forEach(([key, val]) => {
                if (val !== undefined) {
                    if (Array.isArray(val)) {
                        val.forEach((v) => {
                            apiUrl += `${hasQueryParam ? "&" : "?"}${encodeURIComponent(key)}=${encodeURIComponent(v as string)}`
                            hasQueryParam = true
                        })
                    } else {
                        apiUrl += `${hasQueryParam ? "&" : "?"}${encodeURIComponent(key)}=${encodeURIComponent(val as string)}`
                        hasQueryParam = true
                    }
                }
            })
        }

        return apiUrl
    }

    public isRequestCancelError(error: Error): boolean {
        if (error instanceof HandledError) {
            return error.code === ErrorCode.CanceledRequest
        } else {
            return axios.isCancel(error)
        }
    }

    private getAuthorizationToken() {
        return AuthStore.user?.token ? `Bearer ${AuthStore.user.token}` : undefined
    }

    private async request<T>(requestConfig: AxiosRequestConfig, options?: IFetchOptions): Promise<T> {
        const { data } = await this.rawRequest<T>(requestConfig, options)
        return data
    }

    private async rawRequest<T>(requestConfig: AxiosRequestConfig, options?: IFetchOptions): Promise<AxiosResponse<T>> {
        if (options && options.cancelTokenSource) {
            requestConfig.cancelToken = options.cancelTokenSource.token
        }

        try {
            const response = await this.httpAgent.request<T>(requestConfig)

            if (!response.data && !options?.allow204) {
                throw new HandledError(ErrorCode.InvalidResponse, "Invalid response")
            }

            return response
        } catch (error) {
            const axiosError = error as AxiosError

            if (axios.isCancel(axiosError)) {
                throw new HandledError(ErrorCode.CanceledRequest, axiosError.message)
            }

            if (axiosError.isAxiosError) {
                let errorCode: ErrorCode
                let serverResponse: HandledError | undefined

                if (axiosError.response) {
                    serverResponse = axiosError.response.data as HandledError
                    errorCode = serverResponse?.code
                } else {
                    errorCode = ErrorCode.NetworkError
                }

                if (errorCode === ErrorCode.Unauthorized) {
                    if (errorCode === ErrorCode.Unauthorized && AuthStore.user) {
                        errorCode = ErrorCode.LoggedOut
                    }

                    AuthStore.logout()
                }

                throw new HandledError(errorCode, serverResponse?.message || "", serverResponse?.data)
            } else {
                throw new HandledError(ErrorCode.UnhandledError, "Unknown error")
            }
        }
    }
}

export default new Api()
