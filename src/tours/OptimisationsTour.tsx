import { TourSteps } from "@/WelcomeTourSteps";
import useAppContext from "@/hooks/useAppContext.ts";
import { OptimisationsTourSteps, optimisationsTourSteps } from "@/lib/tours/optimisationsTour";
import { $optimisationAddPopup } from "@/signals/components/ui/popups";
import { useQueryClient } from "@tanstack/react-query";
import Joyride, { CallBackProps } from "react-joyride";

export const OptimisationsTour = () => {
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
                queryKey: ["optimisations"],
            });
        }

        if (action === "skip" || action === "close" || action === "reset" || action === "stop") {
            setState({ run: false, stepIndex: 0, tourActive: false });
            window.setTimeout(() => {
                queryClient.invalidateQueries({
                    queryKey: ["optimisations"],
                });
            }, 50);
            return;
        }

        if (type === "step:after") {
            if (index === OptimisationsTourSteps.TOUR_OPTIMISATION_ADD) {
                $optimisationAddPopup.set(true);
                window.setTimeout(() => {
                    setState({ stepIndex: OptimisationsTourSteps.TOUR_OPTIMISATION_ADD_DESCRIPTION });
                }, 100);
            } else if (index === OptimisationsTourSteps.TOUR_OPTIMISATION_ADD_CREATE) {
                setState({ run: false, stepIndex: TourSteps.TOUR_START, tourActive: false });
                $optimisationAddPopup.set(false);
                window.setTimeout(() => {
                    queryClient.invalidateQueries({
                        queryKey: ["optimisations"],
                    });
                }, 50);
            } else {
                setState({ stepIndex: index + 1 });
            }
        }
    };

    return (
        <>
            {run && section === "optimisations" && (
                <Joyride
                    callback={handleCallback}
                    continuous
                    run={run}
                    scrollToFirstStep
                    stepIndex={stepIndex}
                    steps={optimisationsTourSteps}
                    showSkipButton={true}
                    locale={{
                        next: "Suivant",
                        skip: "¨Passer",
                        close: "Fermer",
                        last: "Terminé",
                    }}
                />
            )}
        </>
    );
};
