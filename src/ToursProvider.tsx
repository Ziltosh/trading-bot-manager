import { AppState } from "@/hooks/useAppContext";
import { createContext, useMemo } from "react";
import { useSetState } from "react-use";

const appState: AppState = {
    run: false,
    stepIndex: 0,
    steps: [],
    tourActive: false,
    section: "root",
};

export const AppContext = createContext({
    state: appState,
    setState: () => {},
});
AppContext.displayName = "AppContext";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ToursProvider(props: any) {
    const [state, setState] = useSetState(appState);

    const value = useMemo(
        () => ({
            state,
            setState,
        }),
        [setState, state],
    );

    return <AppContext.Provider value={value} {...props} />;
}
