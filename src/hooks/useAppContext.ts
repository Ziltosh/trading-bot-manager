import { useContext } from "react";
import { AppContext } from "@/WelcomeTourContext.tsx";
import { Step } from "react-joyride";

interface AppState {
    run: boolean;
    stepIndex: number;
    steps: Step[];
    tourActive: boolean;
}

export default function useAppContext(): {
    setState: (patch: Partial<AppState> | ((previousState: AppState) => Partial<AppState>)) => void;
    state: AppState;
} {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error("useAppContext must be used within a AppProvider");
    }

    return context;
}
