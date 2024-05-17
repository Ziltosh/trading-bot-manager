import { createContext, useMemo } from "react";
import { useSetState } from "react-use";

const appState = {
    run: false,
    stepIndex: 0,
    steps: [],
    tourActive: false,
};

export const AppContext = createContext({
    state: appState,
    setState: () => undefined,
});
AppContext.displayName = "AppContext";

export function WelcomeTourProvider(props: any) {
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
