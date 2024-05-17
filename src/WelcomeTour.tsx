import Joyride, { CallBackProps } from "react-joyride";
import { useNavigate } from "react-router-dom";
import { useMount } from "react-use";
import useAppContext from "@/hooks/useAppContext.ts";
import { H3 } from "@/components/ui/typos.tsx";
import { $compteAddPopup, $optimisationAddPopup, $robotAddPopup } from "@/signals/components/ui/popups.ts";
import { TourSteps } from "@/WelcomeTourSteps.ts";

export const WelcomeTour = () => {
    const navigate = useNavigate();

    const {
        setState,
        state: { run, stepIndex, steps },
    } = useAppContext();

    const defaultStepOptions = {
        hideBackButton: true,
        showProgress: false,
        disableOverlayClose: true,
        disableBeacon: true,
    };

    useMount(() => {
        setState({
            steps: [
                {
                    target: ".tour-accueil",
                    content: (
                        <div className={"flex flex-col gap-2"}>
                            <H3>Bienvenue</H3>
                            <p>Vous êtes ici sur la page d'accueil de l'application.</p>
                            <p>Pour y revenir cliquez sur le logo en haut à gauche.</p>
                            <p>
                                La première étape pour utiliser cette application est de créer un robot. Cliquez sur
                                Next pour aller sur la page correspondante.
                            </p>
                        </div>
                    ),
                    ...defaultStepOptions,
                    data: {
                        next: "/robots",
                    },
                },
                {
                    target: ".tour-robots",
                    content: (
                        <div className={"flex flex-col gap-2"}>
                            <H3>Les robots</H3>
                            <p>Ici vous pourrez voir les différents robots que vous avez ajoutés.</p>
                        </div>
                    ),
                    ...defaultStepOptions,
                    data: {},
                },
                {
                    target: ".tour-robots-add",
                    content: (
                        <div className={"flex flex-col gap-2"}>
                            <H3>Ajout d'un robot</H3>
                            <p>En cliquant sur ce bouton vous pourrez ajouter un robot.</p>
                        </div>
                    ),
                    ...defaultStepOptions,
                    data: {},
                },
                {
                    target: ".tour-robots-add-name",
                    content: (
                        <div className={"flex flex-col gap-2"}>
                            <H3>Entrez un nom</H3>
                            <p>Donnez un nom à votre robot.</p>
                        </div>
                    ),
                    ...defaultStepOptions,
                    data: {
                        // next: "/comptes",
                    },
                },
                {
                    target: ".tour-robots-add-desc",
                    content: (
                        <div className={"flex flex-col gap-2"}>
                            <H3>Entrez une description</H3>
                            <p>Entrez ce que vous pensez utile de vous rappeler ici.</p>
                        </div>
                    ),
                    ...defaultStepOptions,
                    data: {
                        // next: "/comptes",
                    },
                },
                {
                    target: ".tour-robots-add-tags",
                    content: (
                        <div className={"flex flex-col gap-2"}>
                            <H3>Renseignez des tags</H3>
                            <p>Cliquez pour ajouter des tags, cliquez sur des tags mis pour les enlever</p>
                            <p>Vous pouvez aussi rentrer vos propres tags.</p>
                        </div>
                    ),
                    ...defaultStepOptions,
                    data: {
                        // next: "/comptes",
                    },
                },
                {
                    target: ".tour-robots-add-set",
                    content: (
                        <div className={"flex flex-col gap-2"}>
                            <H3>Ajoutez le fichier .set</H3>
                            <p>
                                Remettez a zéro les paramètres du robot avec Metatrader, enregistrer les paramètres et
                                chargez les ici.
                            </p>
                        </div>
                    ),
                    ...defaultStepOptions,
                    data: {
                        // next: "/comptes",
                    },
                },
                {
                    target: ".tour-robots-add-create",
                    content: (
                        <div className={"flex flex-col gap-2"}>
                            <H3>Validez l'ajout</H3>
                            <p>Cliquez pour ajouter le robot. Il se rajoutera automatiquement à la liste des robots.</p>
                        </div>
                    ),
                    ...defaultStepOptions,
                    data: {
                        next: "/comptes",
                    },
                },
                {
                    target: ".tour-comptes",
                    content: (
                        <div className={"flex flex-col gap-2"}>
                            <H3>Les comptes</H3>
                            <p>Dans cette partie vous pourrez voir les différents comptes que vous avez ajouté.</p>
                            <p>Ils sont classés selon si ce sont des comptes réels, démo ou prop firms.</p>
                        </div>
                    ),
                    ...defaultStepOptions,
                    data: {},
                },
                {
                    target: ".tour-comptes-add",
                    content: (
                        <div className={"flex flex-col gap-2"}>
                            <H3>Ajout d'un compte</H3>
                            <p>En cliquant sur ce bouton vous pourrez ajouter un compte.</p>
                            <p></p>
                        </div>
                    ),
                    ...defaultStepOptions,
                    data: {},
                },
                {
                    target: ".tour-comptes-add-popup",
                    content: (
                        <div className={"flex flex-col gap-2"}>
                            <H3>Entrez les détails</H3>
                            <p>Remplissez les différentes infos de votre compte.</p>
                        </div>
                    ),
                    ...defaultStepOptions,
                    data: {
                        next: "/optimisations",
                    },
                },
                {
                    target: ".tour-optimisations",
                    content: (
                        <div className={"flex flex-col gap-2"}>
                            <H3>Les optimisations</H3>
                            <p>
                                Une fois un robot et un compte ajouté, vous pourrez créer des optimisations grâce aux
                                fichiers d'optimisation de Paul.
                            </p>
                            <p>Vous les verrez listés ici, avec les infos principales directement disponibles.</p>
                        </div>
                    ),
                    ...defaultStepOptions,
                    data: {},
                },
                {
                    target: ".tour-optimisations-add",
                    content: (
                        <div className={"flex flex-col gap-2"}>
                            <H3>Ajout d'une optimisation</H3>
                            <p>En cliquant sur ce bouton vous pourrez ajouter un compte.</p>
                            <p></p>
                        </div>
                    ),
                    ...defaultStepOptions,
                    data: {},
                },
                {
                    target: ".tour-optimisations-add-popup",
                    content: (
                        <div className={"flex flex-col gap-2"}>
                            <H3>Entrez les détails</H3>
                            <p>Remplissez les différentes infos de l'optimisation.</p>
                            <p>
                                Vous n'êtes pas obligé d'avoir fini l'optimisation avant de la rentrer dans le logiciel.
                                Si elle est en cours, alors les données de l'Excel concernant les résultats ne seront
                                pas chargées et vous pourrez ensuite renvoyer un Excel remplie afin de mettre à jour les
                                informations.
                            </p>
                        </div>
                    ),
                    ...defaultStepOptions,
                    data: {
                        next: "/home",
                    },
                },
                // {
                //     target: ".tour-home",
                //     content: <>TODO</>,
                //     data: {
                //         previous: "/optimisations",
                //         next: "/",
                //     },
                // },
                // {
                //     target: "#routeB",
                //     content: (
                //         <>This is Route B Yet another loader simulation and now we reached the last step in our tour!</>
                //     ),
                //     data: {
                //         previous: "/multi-route/a",
                //         next: "/multi-route",
                //     },
                // },
            ],
        });
    });

    const handleCallback = (data: CallBackProps) => {
        console.log(data);
        const {
            action,
            index,
            step: {
                data: { next, previous },
            },
            type,
        } = data;

        const isPreviousAction = action === "prev";

        if (action === "skip" || action === "close") {
            setState({ run: false, stepIndex: TourSteps.TOUR_START, tourActive: false });
        }

        if (type === "step:before") {
            // if (index === 2) {
            //     $robotAddPopup.set(true);
            // }
        }

        // if (type === "step:after" && stepActions[index]) {
        //     stepActions[index](setState);
        //     if (next) {
        //         setState({ run: false });
        //         navigate(isPreviousAction && previous ? previous : next);
        //     }
        // }

        if (type === "step:after") {
            if (index === TourSteps.TOUR_ROBOT) {
                setState({ stepIndex: TourSteps.TOUR_ROBOT_ADD });
            }

            if (index === TourSteps.TOUR_ROBOT_ADD) {
                setState({ stepIndex: TourSteps.TOUR_ROBOT_ADD_NAME });
                $robotAddPopup.set(true);
            }

            if (index === TourSteps.TOUR_ROBOT_ADD_NAME) {
                setState({ stepIndex: TourSteps.TOUR_ROBOT_ADD_DESC });
            }

            if (index === TourSteps.TOUR_ROBOT_ADD_DESC) {
                setState({ stepIndex: TourSteps.TOUR_ROBOT_ADD_TAGS });
            }

            if (index === TourSteps.TOUR_ROBOT_ADD_TAGS) {
                setState({ stepIndex: TourSteps.TOUR_ROBOT_ADD_SET });
            }

            if (index === TourSteps.TOUR_ROBOT_ADD_SET) {
                setState({ stepIndex: TourSteps.TOUR_ROBOT_ADD_CREATE });
            }

            if (index === TourSteps.TOUR_ROBOT_ADD_CREATE) {
                setState({ stepIndex: TourSteps.TOUR_COMPTE });
                $robotAddPopup.set(false);
            }

            if (index === TourSteps.TOUR_COMPTE) {
                setState({ stepIndex: TourSteps.TOUR_COMPTE_ADD });
            }

            if (index === TourSteps.TOUR_COMPTE_ADD) {
                $compteAddPopup.set(true);
            }

            if (index === TourSteps.TOUR_COMPTE_ADD_POPUP) {
                $compteAddPopup.set(false);
            }

            if (index === TourSteps.TOUR_OPTIMISATION) {
                setState({ stepIndex: TourSteps.TOUR_OPTIMISATION_ADD });
            }

            if (index === TourSteps.TOUR_OPTIMISATION_ADD) {
                $optimisationAddPopup.set(true);
            }

            if (index === TourSteps.TOUR_OPTIMISATION_ADD_POPUP) {
                $optimisationAddPopup.set(false);
            }

            if (next) {
                setState({ run: false });
                navigate(isPreviousAction && previous ? previous : next);
            }

            if (index === TourSteps.TOUR_END)
                setState({ run: false, stepIndex: TourSteps.TOUR_START, tourActive: false });
        }
    };

    return (
        <>
            <Joyride
                callback={handleCallback}
                continuous
                run={run}
                stepIndex={stepIndex}
                steps={steps}
                showSkipButton={true}
            />
        </>
    );
};
