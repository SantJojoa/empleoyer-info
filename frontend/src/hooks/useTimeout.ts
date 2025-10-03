import { useRef, useCallback } from 'react';

export const useTimeout = () => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const createTimeout = useCallback((callback: () => void, delay: number) => {
        // Limpiar timeout anterior si existe
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Crear nuevo timeout
        timeoutRef.current = setTimeout(callback, delay);
    }, []);

    const clearTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    return { createTimeout, clearTimeout };
};
