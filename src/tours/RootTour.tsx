import useAppContext from "@/hooks/useAppContext.ts";
import { rootTourSteps } from "@/lib/tours/rootTour";
import { useEffect } from "react";
import Joyride, { CallBackProps } from "react-joyride";

export const RootTour = () => {
    const {
        setState,
        state: { run, section },
    } = useAppContext();

    useEffect(() => {
        console.log(run, section);
    }, [run, section]);

    const handleCallback = (data: CallBackProps) => {
        const { action } = data;
        //     console.log(action, index, type);

        if (action === "skip" || action === "close" || action === "reset") {
            setState({ run: false, stepIndex: 0, tourActive: false });
        }
    };

    return (
        <>
            {run && section === "root" && (
                <Joyride
                    callback={handleCallback}
                    continuous
                    run={run}
                    // scrollToFirstStep
                    // stepIndex={stepIndex}
                    steps={rootTourSteps}
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
