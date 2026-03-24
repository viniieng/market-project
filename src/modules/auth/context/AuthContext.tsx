import { ReactNode, useEffect, useMemo, useState } from 'react';
import { loginWithGoogle, logout, observeAuthState } from '../../../services/firebase/auth';
import { AuthContext, AuthContextData } from './auth-context';

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<AuthContextData['user']>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = observeAuthState((currentUser) => {
            setUser(currentUser);
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = useMemo<AuthContextData>(
        () => ({
            user,
            isLoading,
            isAuthenticated: Boolean(user),
            signInWithGoogle: loginWithGoogle,
            signOut: logout,
        }),
        [isLoading, user],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
