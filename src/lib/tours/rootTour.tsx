import { H3 } from "@/components/ui/typos";
import { Step } from "react-joyride";

const defaultStepOptions: Partial<Step> = {
    hideBackButton: true,
    showProgress: false,
    disableOverlayClose: true,
    disableBeacon: true,
};

export const rootTourSteps: Step[] = [
    {
        target: ".tour-accueil",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Bienvenue</H3>
                <p>Vous êtes ici sur la page d'accueil de l'application.</p>
                <p>Pour y revenir cliquez sur le logo en haut à gauche.</p>
                <p>
                    La première étape pour utiliser cette application est d'ajouter un robot. Cliquez sur{" "}
                    <strong>Robots</strong> dans le menu supérieur.
                </p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
];
