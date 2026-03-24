import {
    User,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
import { auth, googleProvider } from './config';

export function loginWithGoogle(): Promise<void> {
    return signInWithPopup(auth, googleProvider).then(() => undefined);
}

export function logout(): Promise<void> {
    return signOut(auth);
}

export function observeAuthState(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
}
