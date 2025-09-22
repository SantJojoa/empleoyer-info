import { useInactivityLogout } from '../hooks/useInactivityLogout';
import { useUser } from '../contexts/UserContext';

interface InactivityWrapperProps {
    children: React.ReactNode;
}

export default function InactivityWrapper({ children }: InactivityWrapperProps) {
    const { logout } = useUser();

    // Configurar logout automático por inactividad (30 minutos)
    useInactivityLogout({
        timeoutMinutes: 30,
        onLogout: () => {
            console.log('Logout automático por inactividad');
            logout();
        }
    });

    return <>{children}</>;
}
