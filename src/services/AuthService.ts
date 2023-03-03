import { FirebaseError } from "firebase/app"
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth"
import { ErrorCode, HandledError } from "../error"
import { auth } from "./Firebase"

class AuthService {
    private _googleAuthProvider = new GoogleAuthProvider()

    public async registerWithEmail(email: string, password: string) {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
        } catch (e) {
            const error = e as FirebaseError
            throw new HandledError(error.code as ErrorCode, error.message)
        }
    }

    public async login(email: string, password: string) {
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (e) {
            const error = e as FirebaseError
            throw new HandledError(error.code as ErrorCode, error.message)
        }
    }

    public async signUpWithGoogle() {
        try {
            const result = await signInWithPopup(auth, this._googleAuthProvider)
            const credential = GoogleAuthProvider.credentialFromResult(result)

            if (!credential) {
                throw new HandledError(ErrorCode.NotFound, "404 - User Credentials Not Found")
            }
        } catch (e) {
            const error = e as FirebaseError
            throw new HandledError(error.code as ErrorCode, error.message)
        }
    }

    public async sendForgotPasswordEmail(email: string) {
        try {
            await sendPasswordResetEmail(auth, email)
        } catch (e) {
            const error = e as FirebaseError
            throw new HandledError(error.code as ErrorCode, error.message)
        }
    }
}

export default new AuthService()
