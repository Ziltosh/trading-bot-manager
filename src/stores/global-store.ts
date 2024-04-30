import { create } from "zustand";
import { combine, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Compte, Optimisation, Robot } from "@/rspc_bindings.ts";

const defaultStore = {
    currentRobot: undefined as Robot | undefined,
    currentCompte: undefined as Compte | undefined,
    currentOptimisation: undefined as Optimisation | undefined,
};

export const useGlobalStore = create(
    persist(
        devtools(
            immer(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                combine(defaultStore, (set, _get) => {
                    return {
                        /*** ROBOTS ***/
                        setCurrentRobot(robot: Robot | undefined) {
                            set((state) => {
                                state.currentRobot = robot;
                            });
                        },

                        /*** COMPTES ***/
                        setCurrentCompte(compte: Compte | undefined) {
                            set((state) => {
                                state.currentCompte = compte;
                            });
                        },

                        /*** OPTI ***/
                        setCurrentOptimisation(optimisation: Optimisation | undefined) {
                            set((state) => {
                                state.currentOptimisation = optimisation;
                            });
                        },

                        /*** MISC ***/
                        reset() {
                            set(() => {
                                return defaultStore;
                            });
                        },
                    };
                }),
            ),
        ),
        { name: "tbm-global" },
    ),
);
