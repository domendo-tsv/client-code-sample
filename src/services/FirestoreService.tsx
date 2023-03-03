import { FirebaseApp } from "firebase/app"
import { Firestore, getFirestore } from "firebase/firestore"

class FirestoreService {
    private _firestore: Firestore | null = null

    public get firestore() {
        return this._firestore
    }

    public init(app: FirebaseApp) {
        this._firestore = getFirestore(app)
    }
}

export default new FirestoreService()
