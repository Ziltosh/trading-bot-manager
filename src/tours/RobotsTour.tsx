import { TourSteps } from "@/WelcomeTourSteps";
import useAppContext from "@/hooks/useAppContext.ts";
import { RobotsTourSteps, robotsTourSteps } from "@/lib/tours/robotsTour";
import { $robotAddPopup } from "@/signals/components/ui/popups";
import { useQueryClient } from "@tanstack/react-query";
import Joyride, { CallBackProps } from "react-joyride";

export const RobotsTour = () => {
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
                queryKey: ["robots", "all"],
            });
        }

        if (action === "skip" || action === "close" || action === "reset" || action === "stop") {
            setState({ run: false, stepIndex: 0, tourActive: false });
            window.setTimeout(() => {
                queryClient.invalidateQueries({
                    queryKey: ["robots", "all"],
                });
            }, 50);
            return;
        }

        if (type === "step:after") {
            if (index === RobotsTourSteps.TOUR_ROBOT_ADD) {
                $robotAddPopup.set(true);
                window.setTimeout(() => {
                    setState({ stepIndex: RobotsTourSteps.TOUR_ROBOT_ADD_NAME });
                }, 100);
            } else if (index === RobotsTourSteps.TOUR_ROBOT_ADD_CREATE) {
                setState({ run: false, stepIndex: TourSteps.TOUR_START, tourActive: false });
                $robotAddPopup.set(false);
                window.setTimeout(() => {
                    queryClient.invalidateQueries({
                        queryKey: ["robots", "all"],
                    });
                }, 50);
            } else {
                setState({ stepIndex: index + 1 });
            }
        }
    };

    return (
        <>
            {run && section === "robots" && (
                <Joyride
                    callback={handleCallback}
                    continuous
                    run={run}
                    scrollToFirstStep
                    stepIndex={stepIndex}
                    steps={robotsTourSteps}
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
