import { createContext } from 'react';
import { User } from 'firebase/auth';

export interface AuthContextData {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);
