import { H3 } from "@/components/ui/typos";
import { Step } from "react-joyride";

export enum RobotsTourSteps {
    TOUR_ROBOT,
    TOUR_ROBOT_VIEW,
    TOUR_ROBOT_EDIT,
    TOUR_ROBOT_DELETE,
    TOUR_ROBOT_ADD,
    TOUR_ROBOT_ADD_NAME,
    TOUR_ROBOT_CHEMIN,
    TOUR_ROBOT_ADD_DESC,
    TOUR_ROBOT_ADD_TAGS,
    TOUR_ROBOT_ADD_SET,
    TOUR_ROBOT_ADD_CREATE,
    TOUR_END,
}

const defaultStepOptions: Partial<Step> = {
    hideBackButton: true,
    showProgress: true,
    disableOverlayClose: true,
    disableBeacon: true,
};

export const fakeRobots = [
    {
        id: 1,
        name: "Robot test",
        chemin: "/REB/REB Test v1",
        description: "Description",
        json_settings: "{}",
        tags: [{ robotId: 1, tagId: 1, tag: { name: "Tag test" } }],
    },
];

export const robotsTourSteps: Step[] = [
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
        target: ".tour-robots-view",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Voir le robot</H3>
                <p>Cliquez sur cette icône pour voir les détails du robot.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
    {
        target: ".tour-robots-edit",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Modifier le robot</H3>
                <p>Cliquez sur cette icône pour modifier certains paramètres du robot.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
    {
        target: ".tour-robots-delete",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Supprimer le robot</H3>
                <p>Cliquez sur cette icône pour supprimer le robot.</p>
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
        target: ".tour-robots-add-chemin",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Entrez le chemin</H3>
                <p>
                    Ce paramètre est le chemin du robot dans Metatrader, la racine étant le "dossier" Expert consultant.
                    Vous pourrez passer la souris sur la bulle d'informations pour avoir un exemple.
                </p>
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
                    Remettez a zéro les paramètres du robot avec Metatrader, enregistrer les paramètres et chargez les
                    ici.
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
];
