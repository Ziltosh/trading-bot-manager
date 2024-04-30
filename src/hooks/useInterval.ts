import {useEffect, useRef, useState} from 'react';

// Hook personnalisé useInterval
function useInterval(callback: () => void, delay: number | null): number {
    const savedCallback = useRef<() => void>();
    const [count, setCount] = useState(0); // Un autre hook à l'intérieur, pour suivre le compteur

    // Se souvenir de la dernière fonction de callback
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Mettre en place l'intervalle
    useEffect(() => {
        const tick = () => {
            savedCallback.current?.();
            setCount((c) => c + 1); // Mettre à jour le compteur à chaque intervalle
        };
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);

    // Retourner le compteur si nécessaire
    return count;
}

export default useInterval;