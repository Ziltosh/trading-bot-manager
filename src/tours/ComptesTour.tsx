import useAppContext from "@/hooks/useAppContext.ts";
import { ComptesTourSteps, comptesTourSteps } from "@/lib/tours/comptesTour";
import { $compteAddPopup } from "@/signals/components/ui/popups";
import { useQueryClient } from "@tanstack/react-query";
import Joyride, { CallBackProps } from "react-joyride";

export const ComptesTour = () => {
    const {
        setState,
        state: { run, section, stepIndex },
    } = useAppContext();

    const queryClient = useQueryClient();

    const handleCallback = (data: CallBackProps) => {
        const { action, index, type } = data;
        //     console.log(action, index, type);

        if (action === "start") {
            queryClient.invalidateQueries({
                queryKey: ["comptes"],
            });
        }

        if (action === "skip" || action === "close" || action === "reset" || action === "stop") {
            setState({ run: false, stepIndex: 0, tourActive: false });
            window.setTimeout(() => {
                queryClient.invalidateQueries({
                    queryKey: ["comptes"],
                });
            }, 50);
            return;
        }

        if (type === "step:after") {
            if (index === ComptesTourSteps.TOUR_COMPTE_ADD) {
                $compteAddPopup.set(true);
                window.setTimeout(() => {
                    setState({ stepIndex: ComptesTourSteps.TOUR_COMPTE_ADD_NAME });
                }, 100);
            } else if (index === ComptesTourSteps.TOUR_COMPTE_ADD_CREATE) {
                setState({ run: false, stepIndex: ComptesTourSteps.TOUR_COMPTE, tourActive: false });
                $compteAddPopup.set(false);
                window.setTimeout(() => {
                    queryClient.invalidateQueries({
                        queryKey: ["comptes"],
                    });
                }, 50);
            } else {
                setState({ stepIndex: index + 1 });
            }
        }
    };

    return (
        <>
            {run && section === "comptes" && (
                <Joyride
                    callback={handleCallback}
                    continuous
                    run={run}
                    scrollToFirstStep
                    stepIndex={stepIndex}
                    steps={comptesTourSteps}
                    showSkipButton={true}
                    locale={{
                        next: "Suivant",
                        skip: "Skip",
                        close: "Fermer",
                        last: "Terminé",
                    }}
                />
            )}
        </>
    );
};
