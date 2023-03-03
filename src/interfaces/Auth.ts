import { User } from "firebase/auth"

export interface IAuthInfo extends User {
    token: string | null
}

export interface IProfile {
    username?: string
}
