import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService, AuthUser } from '../lib/AuthService';

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; message: string }>;
    register: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    }, []);

    const login = async (usernameOrEmail: string, password: string): Promise<{ success: boolean; message: string }> => {
        const result = AuthService.login(usernameOrEmail, password);
        if (result.success && result.user) {
            setUser(result.user);
        }
        return { success: result.success, message: result.message };
    };

    const register = async (username: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
        const result = AuthService.register(username, email, password);
        if (result.success && result.user) {
            setUser(result.user);
        }
        return { success: result.success, message: result.message };
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: user !== null,
                login,
                register,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
