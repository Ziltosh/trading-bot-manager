import {useCallback, useSyncExternalStore} from "react";
import {effect, type ReadSignal} from "@maverick-js/signals";

export function useSignal<T>(signal: ReadSignal<T>): T {
    const subscribe = useCallback(
        (onChange: (v: T) => void) => effect(() => onChange(signal())),
        [signal]
    );
    return useSyncExternalStore(subscribe, signal, signal);
}