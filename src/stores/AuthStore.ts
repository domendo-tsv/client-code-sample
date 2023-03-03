import { signOut, User } from "firebase/auth"
import { action, makeAutoObservable, observable, runInAction } from "mobx"
import { ErrorCode, HandledError } from "../error"
import { IAuthInfo, IProfile } from "../interfaces/Auth"
import Api from "../services/Api"
import DialogService from "../services/DialogService"
import { auth } from "../services/Firebase"

class AuthStore {
    @observable public user: IAuthInfo | null = null
    @observable public userProfile: IProfile | null = null

    @observable public initDone = false

    constructor() {
        makeAutoObservable(this)
    }

    get isAuthenticated() {
        return !!this.user
    }

    get isProfileCompleted() {
        return !!this.userProfile
    }

    @action.bound
    public init = async (user: User | null) => {
        let userAuthInfo: IAuthInfo | null = null
        let userProfile: IProfile | null = null

        if (user) {
            const token = await user.getIdToken()
            userAuthInfo = { ...user, token }

            if (!this.userProfile) {
                try {
                    userProfile = await this.getUserProfile(token)
                } catch (e) {
                    if ((e as HandledError).code !== ErrorCode.NotFound) {
                        // An internal Server error happenned. You have been logged out..
                        DialogService.error(e, this.logout)
                    }
                    // else Silent error
                }
            }
        }

        runInAction(() => {
            this.user = userAuthInfo
            this.userProfile = userProfile
            this.initDone = true
        })
    }

    public async logout(): Promise<void> {
        try {
            await signOut(auth)
            runInAction(() => {
                this.user = null
            })
        } catch (e) {
            console.error(e)
        }
    }

    public updateProfileInfo(data: IProfile) {
        this.userProfile = data
    }

    private getUserProfile(token: string) {
        return Api.get<IProfile>("/user/profile", {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
    }
}

export default new AuthStore()
