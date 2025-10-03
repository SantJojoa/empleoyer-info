import { useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';

interface UseInactivityLogoutProps {
    timeoutMinutes?: number;
    onLogout?: () => void;
}

export const useInactivityLogout = ({
    timeoutMinutes = 30,
    onLogout
}: UseInactivityLogoutProps = {}) => {
    const { logout } = useUser();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            logout();
            if (onLogout) {
                onLogout();
            }
        }, timeoutMinutes * 60 * 1000); // Convertir minutos a milisegundos
    };

    useEffect(() => {
        // Eventos que indican actividad del usuario
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        const handleActivity = () => {
            resetTimeout();
        };

        // Agregar listeners para todos los eventos
        events.forEach(event => {
            document.addEventListener(event, handleActivity, true);
        });

        // Inicializar el timeout
        resetTimeout();

        // Cleanup
        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleActivity, true);
            });

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [timeoutMinutes, logout, onLogout]);

    return { resetTimeout };
};
