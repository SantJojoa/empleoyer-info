import { useRef, useCallback } from 'react';

export const useTimeout = () => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const createTimeout = useCallback((callback: () => void, delay: number) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(callback, delay);
    }, []);

    const clearTimeoutRef = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current); // ahora sí, usa la global
            timeoutRef.current = null;
        }
    }, []);

    return { createTimeout, clearTimeout: clearTimeoutRef };
};
