import useAppContext from "@/hooks/useAppContext.ts";
import { OptimisationViewTourSteps, optimisationViewTourSteps } from "@/lib/tours/optimisationViewTour";
import { useQueryClient } from "@tanstack/react-query";
import Joyride, { CallBackProps } from "react-joyride";

export const OptimisationViewTour = () => {
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
            if (index === OptimisationViewTourSteps.TOUR_OPTIMISATIONVIEW_TABS) {
                setState({
                    run: false,
                    stepIndex: OptimisationViewTourSteps.TOUR_OPTIMISATIONVIEW_INFOS,
                    tourActive: false,
                });
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
            {run && section === "optimisationView" && (
                <Joyride
                    callback={handleCallback}
                    continuous
                    run={run}
                    scrollToFirstStep
                    stepIndex={stepIndex}
                    steps={optimisationViewTourSteps}
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
