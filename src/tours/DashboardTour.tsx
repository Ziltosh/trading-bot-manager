import useAppContext from "@/hooks/useAppContext.ts";
import { DashboardTourSteps, dashboardViewTourSteps } from "@/lib/tours/dashboardTour";
import { useQueryClient } from "@tanstack/react-query";
import Joyride, { CallBackProps } from "react-joyride";
import { useNavigate } from "react-router-dom";

export const DashboardTour = () => {
    const {
        setState,
        state: { run, section, stepIndex },
    } = useAppContext();

    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const handleCallback = (data: CallBackProps) => {
        const { action, index, type } = data;
        //     console.log(action, index, type);

        if (action === "start") {
            queryClient.invalidateQueries({
                queryKey: ["comptes"],
            });
            queryClient.invalidateQueries({
                queryKey: ["optimisations"],
            });
            queryClient.invalidateQueries({
                queryKey: ["all_opti_data"],
            });
        }

        if (action === "skip" || action === "close" || action === "reset" || action === "stop") {
            setState({ run: false, stepIndex: 0, tourActive: false });
            window.setTimeout(() => {
                queryClient.invalidateQueries({
                    queryKey: ["comptes"],
                });
                queryClient.invalidateQueries({
                    queryKey: ["optimisations"],
                });
                queryClient.invalidateQueries({
                    queryKey: ["all_opti_data"],
                });
                navigate("/home");
            }, 50);
            return;
        }

        if (type === "tour:end") {
            window.setTimeout(() => {
                queryClient.invalidateQueries({
                    queryKey: ["comptes"],
                });
                queryClient.invalidateQueries({
                    queryKey: ["optimisations"],
                });
                queryClient.invalidateQueries({
                    queryKey: ["all_opti_data"],
                });
                navigate("/home");
            }, 50);
            setState({
                run: false,
                stepIndex: DashboardTourSteps.TOUR_DASHBOARD,
                tourActive: false,
            });
            return;
        }

        if (type === "step:after") {
            if (index === DashboardTourSteps.TOUR_DASHBOARD_ROBOTS) {
                setState({
                    run: false,
                    stepIndex: DashboardTourSteps.TOUR_DASHBOARD,
                    tourActive: false,
                });
                window.setTimeout(() => {
                    queryClient.invalidateQueries({
                        queryKey: ["comptes"],
                    });
                    queryClient.invalidateQueries({
                        queryKey: ["optimisations"],
                    });
                    queryClient.invalidateQueries({
                        queryKey: ["all_opti_data"],
                    });
                    navigate("/home");
                }, 50);
            } else if (index === DashboardTourSteps.TOUR_DASHBOARD_SIDEBAR) {
                navigate("/home/compte/1");
                window.setTimeout(() => {
                    queryClient.invalidateQueries({
                        queryKey: ["all_opti_data"],
                    });
                    setState({ stepIndex: index + 1 });
                }, 50);
            } else {
                setState({ stepIndex: index + 1 });
            }
        }
    };

    return (
        <>
            {run && section === "dashboard" && (
                <Joyride
                    callback={handleCallback}
                    continuous
                    run={run}
                    scrollToFirstStep
                    stepIndex={stepIndex}
                    steps={dashboardViewTourSteps}
                    showSkipButton={true}
                    locale={{
                        next: "Suivant",
                        skip: "Passer",
                        close: "Fermer",
                        last: "Terminé",
                    }}
                />
            )}
        </>
    );
};
