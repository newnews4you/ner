export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    provider: 'google' | 'email';
    createdAt: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => void;
    register: (email: string, password: string, name: string) => Promise<void>;
}
