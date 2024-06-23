import { AppContext } from "@/ToursProvider";
import { Tours } from "@/types/tours";
import { useContext } from "react";
import { Step } from "react-joyride";

export interface AppState {
    run: boolean;
    stepIndex: number;
    steps: Step[];
    tourActive: boolean;
    section: keyof Tours;
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
