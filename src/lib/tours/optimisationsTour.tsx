import { H3 } from "@/components/ui/typos";
import { Procedures } from "@/rspc_bindings";
import { inferProcedureResult } from "@rspc/client";
import { Step } from "react-joyride";

export enum OptimisationsTourSteps {
    TOUR_OPTIMISATION,
    TOUR_OPTIMISATION_VIEW,
    TOUR_OPTIMISATION_EDIT,
    TOUR_OPTIMISATION_DELETE,
    TOUR_OPTIMISATION_ADD,
    TOUR_OPTIMISATION_ADD_DESCRIPTION,
    TOUR_OPTIMISATION_ADD_PAIRE,
    TOUR_OPTIMISATION_ADD_ROBOT,
    TOUR_OPTIMISATION_ADD_COMPTE,
    TOUR_OPTIMISATION_ADD_TIMEFRAME,
    TOUR_OPTIMISATION_ADD_TAGS,
    TOUR_OPTIMISATION_ADD_SET,
    TOUR_OPTIMISATION_ADD_XLSM,
    TOUR_OPTIMISATION_ADD_CREATE,
    TOUR_END,
}

const defaultStepOptions: Partial<Step> = {
    hideBackButton: true,
    showProgress: true,
    disableOverlayClose: true,
    disableBeacon: true,
};

export const fakeOptimisations: inferProcedureResult<Procedures, "queries", "optimisations.all"> = [
    {
        capital: 1000,
        compteId: 1,
        decalage_ct: 3,
        decalage_ct_unit: "mois",
        decalage_lt: 9,
        decalage_lt_unit: "années",
        paire: "EURUSD",
        set_path: "/chemin/du/set",
        timeframe: "H1",
        date_debut: "2024-01-01",
        description: "Description de l'optimisation",
        name: "ROBOT - PAIRE - TIMEFRAME",
        robotId: 1,
        xlsm_path: "/chemin/du/xlsm",
        compte: {
            name: "Compte 1",
        },
        robot: {
            name: "Robot 1",
        },
        id: 1,
        tags: [
            {
                tag: {
                    name: "Tag 1",
                },
                optimisationId: 1,
                tagId: 1,
            },
        ],
    },
];

export const optimisationsTourSteps: Step[] = [
    {
        target: ".tour-optimisations",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Les optimisations</H3>
                <p>
                    Une fois un robot et un compte ajouté, vous pourrez créer des optimisations grâce aux fichiers
                    d'optimisation de Paul.
                </p>
                <p>Vous les verrez listés ici, avec les infos principales directement disponibles.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
    {
        target: ".tour-optimisations-view",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Voir l'optimisation</H3>
                <p>Cliquez sur cette icône pour voir les détails de l'optimisation.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
    {
        target: ".tour-optimisations-edit",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Modifier l'optimisation</H3>
                <p>Cliquez sur cette icône pour modifier certains paramètres de l'optimisation.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
    {
        target: ".tour-optimisations-delete",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Supprimer l'optimisation</H3>
                <p>Cliquez sur cette icône pour supprimer l'optimisation.</p>
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
                <p>En cliquant sur ce bouton vous pourrez ajouter une optimisation.</p>
                <p></p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
    {
        target: ".tour-optimisations-add-description",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Entrez une description</H3>
                <p>Rentrez les informations qui vous semblent utiles pour identifier cette optimisation.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
    {
        target: ".tour-optimisations-add-paire",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Entrez la paire</H3>
                <p>Renseignez la paire sur laquelle porte cette optimisation.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
    {
        target: ".tour-optimisations-add-robot",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Choix du robot</H3>
                <p>Choisissez dans la liste le robot utilisé pour cette optimisation.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
    {
        target: ".tour-optimisations-add-compte",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Choix du compte</H3>
                <p>Choisissez dans la liste le compte utilisé pour cette optimisation.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
    {
        target: ".tour-optimisations-add-timeframe",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Choix de la timeframe</H3>
                <p>Choisissez dans la liste la timeframe utilisée pour cette optimisation.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
    {
        target: ".tour-optimisations-add-tags",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Renseignez des tags</H3>
                <p>Cliquez pour ajouter des tags, cliquez sur des tags mis pour les enlever</p>
                <p>Vous pouvez aussi rentrer vos propres tags.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
    {
        target: ".tour-optimisations-add-set",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Envoi du fichier .set</H3>
                <p>Envoyez le fichier .set utilisé pour cette optimisation.</p>
                <p>
                    <strong>Attention :</strong>Bien vérifier qu'il s'agit du bon fichier, en effet il sera utilisé
                    ensuite pour générer le fichier de passage a lancer ainsi que pour générer le profil Metatrader.
                </p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
    {
        target: ".tour-optimisations-add-xlsm",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Envoi du fichier .xlsm</H3>
                <p>
                    Envoyez le fichier Excel de cette optimisation. Vous pouvez l'envoyer avant ou après avoir lancer
                    l'import des données. Dans le second cas, il faudra ensuite renvoyer le fichier Excel rempli dans la
                    page de détails de l'optimisation.
                </p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
    {
        target: ".tour-optimisations-add-create",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Création de l'optimisation</H3>
                <p>Enfin, cliquez ici pour créer l'optimisation.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
];
