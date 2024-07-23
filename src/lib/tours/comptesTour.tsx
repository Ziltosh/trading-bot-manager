import { H3 } from "@/components/ui/typos";
import { Step } from "react-joyride";

export enum ComptesTourSteps {
    TOUR_COMPTE,
    TOUR_COMPTE_VIEW,
    TOUR_COMPTE_EDIT,
    TOUR_COMPTE_DELETE,
    TOUR_COMPTE_ADD,
    TOUR_COMPTE_ADD_NAME,
    TOUR_COMPTE_ADD_TYPE,
    TOUR_COMPTE_ADD_COURTIER,
    TOUR_COMPTE_ADD_STATUS,
    TOUR_COMPTE_ADD_CAPITAL,
    TOUR_COMPTE_ADD_DEVISE,
    TOUR_COMPTE_ADD_INFOS,
    TOUR_COMPTE_ADD_TAGS,
    TOUR_COMPTE_ADD_CREATE,
    TOUR_COMPTE_SETTINGS,
    TOUR_END,
}

const defaultStepOptions: Partial<Step> = {
    hideBackButton: true,
    showProgress: true,
    disableOverlayClose: true,
    disableBeacon: true,
};

export const fakeComptes = [
    {
        id: 1,
        name: "Compte test",
        capital: 1000,
        devise: "USD",
        courtier: "IC Markets",
        numero: "123456",
        plateforme: "mt4",
        status: "Actif",
        tags: [{ tagId: 1, tag: { name: "Tag 1" }, compteId: 1 }],
        type_compte: "reel",
        password: "password",
        serveur: "serveur",
    },
];

export const comptesTourSteps: Step[] = [
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
        target: ".tour-comptes-view",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Voir le compte</H3>
                <p>Cliquez sur cette icône pour voir les détails du compte.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
    {
        target: ".tour-comptes-edit",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Modifier le compte</H3>
                <p>Cliquez sur cette icône pour modifier certains paramètres du compte.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
    {
        target: ".tour-comptes-delete",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Supprimer le compte</H3>
                <p>Cliquez sur cette icône pour supprimer le compte.</p>
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
        target: ".tour-comptes-add-name",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Entrez un nom</H3>
                <p>Donnez un nom à votre compte.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {
            // next: "/comptes",
        },
    },
    {
        target: ".tour-comptes-add-type",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Entrez un type de compte</H3>
                <p>
                    Selon si c'est un compte réel, un compte démo ou prop firm, ils seront rangés dans la section
                    correspondante.
                </p>
                <p>Le choix va aussi influencer la valeur du champ suivant.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {
            // next: "/comptes",
        },
    },
    {
        target: ".tour-comptes-add-courtier",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Entrez le courtier</H3>
                <p>Si c'est un compte réel ou démo, vous pourrez choisir dans un menu déroulant votre courtier.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {
            // next: "/comptes",
        },
    },
    {
        target: ".tour-comptes-add-status",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Entrez le status</H3>
                <p>Si c'est un compte actif ou cloturé.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {
            // next: "/comptes",
        },
    },
    {
        target: ".tour-comptes-add-capital",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Entrez le capital</H3>
                <p>Le capital du compte à l'origine. Un lien avec MyFxBook permettra d'avoir la balance actuelle.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {
            // next: "/comptes",
        },
    },
    {
        target: ".tour-comptes-add-devise",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Entrez la devise</H3>
                <p>La devise du compte.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {
            // next: "/comptes",
        },
    },
    {
        target: ".tour-comptes-add-infos",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Entrez les informations du compte</H3>
                <p>Rentrez les différentes infos fournies par votre courtier.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {
            // next: "/comptes",
        },
    },
    {
        target: ".tour-comptes-add-tags",
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
        target: ".tour-comptes-add-create",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Validez l'ajout</H3>
                <p>
                    Cliquez pour ajouter le compte. Il se rajoutera automatiquement à la liste des comptes dans la
                    section appropriée.
                </p>
            </div>
        ),
        ...defaultStepOptions,
        data: {
            // next: "/comptes",
        },
    },
    {
        target: ".tour-comptes-settings",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Ajout de MyFXBook</H3>
                <p>
                    Cliquez sur cette icône pour ajouter MyFXBook, ça permettra de voir les balances des comptes dans la
                    liste générale ainsi que les ordres ouverts dans le détail du compte.
                </p>
            </div>
        ),
        ...defaultStepOptions,
        data: {
            // next: "/comptes",
        },
    },
];
