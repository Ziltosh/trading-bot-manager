import { H3 } from "@/components/ui/typos";
import { Procedures } from "@/rspc_bindings";
import { inferProcedureResult } from "@rspc/client";
import { Step } from "react-joyride";

export enum OptimisationViewTourSteps {
    TOUR_OPTIMISATIONVIEW_INFOS,
    TOUR_OPTIMISATIONVIEW_TABS,
}

const defaultStepOptions: Partial<Step> = {
    hideBackButton: true,
    showProgress: true,
    disableOverlayClose: true,
    disableBeacon: true,
};

export const fakeOptimisationViewInfos: inferProcedureResult<Procedures, "queries", "optimisations.get_by_id"> = {
    capital: 1000,
    date_debut: "2024-01-01",
    description: "Description de l'optimisation",
    name: "ROBOT - PAIRE - TIMEFRAME",
    compte: {
        name: "Compte 1",
    },
    robot: {
        name: "Robot 1",
    },
    compteId: 1,
    robotId: 1,
    decalage_ct: 3,
    decalage_ct_unit: "mois",
    decalage_lt: 9,
    decalage_lt_unit: "années",
    paire: "EURUSD",
    timeframe: "H1",
    id: 1,
    set_path: "/chemin/du/set",
    xlsm_path: "/chemin/du/xlsm",
    tags: [
        {
            tag: {
                name: "Tag 1",
            },
            optimisationId: 1,
            tagId: 1,
        },
    ],
};

export const fakeOptimisationViewLancement: inferProcedureResult<
    Procedures,
    "queries",
    "optimisations.get_xlsm_lancement_data"
> = {
    check_dd: 0.1,
    check_passage: 666,
    check_periode_validation_debut: "2018-06-01",
    check_periode_validation_fin: "2024-06-01",
    check_resultat: 666,
    check_resultat_mensuel: "20",
    check_trades: 100,
    dd_max: 0.2,
    nb_periodes: 36,
    pct_periodes_rentables: "75",
    periode_meilleur_resultat: 20,
    periode_pire_resultat: -10,
    periode_resultat_moyen: 15,
    resultat_total: 777,
};

export const optimisationViewTourSteps: Step[] = [
    {
        target: ".tour-optimisationview-infos",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Informations de base</H3>
                <p>Ici vous retrouvez les informations de base de l'optimisation.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
    {
        target: ".tour-optimisationview-tabs",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Les données récupérées</H3>
                <p>C'est ici que se trouve le plus important:</p>
                <ul>
                    <li>
                        Dans l'onglet <strong>Settings</strong> vous retrouverez une vue du .set renseigné lors de la
                        création de l'optimisation. Vous pourrez aussi le changer si besoin.
                    </li>
                    <li>
                        Dans l'onglet <strong>Lancement</strong> vous retrouverez toutes les données analysées par le
                        classeur d'optimisation. Vous aurez aussi la possibilité de générer directement le .set du
                        passage choisi afin de le lancer sur Metatrader.
                    </li>
                    <li>
                        Dans l'onglet <strong>Optimisation</strong> vous retrouverez une grande partie des informations
                        disponibles dans l'onglet Optimisation du classeur. Comme par exemple les résultats des
                        différentes périodes, le résultat, le drawdown, etc...
                    </li>
                </ul>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
];
