import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '@/types/auth';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check for stored user on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string) => {
        setIsLoading(true);
        // Mock login
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockUser: User = {
            id: '1',
            email,
            name: email.split('@')[0],
            provider: 'email',
            createdAt: new Date().toISOString(),
        };

        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setIsLoading(false);
    };

    const loginWithGoogle = async () => {
        setIsLoading(true);
        // Mock Google login
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockUser: User = {
            id: '2',
            email: 'user@gmail.com',
            name: 'Google User',
            provider: 'google',
            avatar: 'https://github.com/shadcn.png',
            createdAt: new Date().toISOString(),
        };

        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setIsLoading(false);
    };

    const register = async (email: string, _password: string, name: string) => {
        setIsLoading(true);
        // Mock register
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockUser: User = {
            id: '3',
            email,
            name,
            provider: 'email',
            createdAt: new Date().toISOString(),
        };

        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setIsLoading(false);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoading,
            login,
            loginWithGoogle,
            logout,
            register
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
