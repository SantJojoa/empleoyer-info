import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface Subscription {
    planType: string;

}
interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    birthDate: string;
    role: string;
    planType?: string;
}

interface UserContextType {
    user: User | null;
    token: string | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Verificar si hay datos de usuario en localStorage al cargar la app
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
                // Limpiar datos corruptos
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }, []);

    const login = (userData: User, userToken: string) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Limpiar cualquier dato corrupto
        localStorage.removeItem('undefined');
    };

    const isAuthenticated = !!user && !!token;

    // Debug: verificar el estado
    console.log("UserContext - user:", user);
    console.log("UserContext - token:", token);
    console.log("UserContext - isAuthenticated:", isAuthenticated);

    return (
        <UserContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
            {children}
        </UserContext.Provider>
    );
};
