import { H3 } from "@/components/ui/typos";
import { Procedures } from "@/rspc_bindings";
import { inferProcedureResult } from "@rspc/client";
import { Step } from "react-joyride";

export enum DashboardTourSteps {
    TOUR_DASHBOARD,
    TOUR_DASHBOARD_SIDEBAR,
    TOUR_DASHBOARD_COMPTE,
    TOUR_DASHBOARD_RECAPITULATIF,
    TOUR_DASHBOARD_PROFIL,
    TOUR_DASHBOARD_ROBOTS,
    TOUR_DASHBOARD_END,
}

const defaultStepOptions: Partial<Step> = {
    hideBackButton: true,
    showProgress: true,
    showSkipButton: false,
    disableOverlayClose: true,
    disableBeacon: true,
};

export const fakeDashboardComptes: inferProcedureResult<Procedures, "queries", "comptes.get_reel"> = [
    {
        capital: 1000,
        courtier: "Courtier",
        devise: "EUR",
        id: 1,
        name: "Compte réel 1",
        numero: "123456",
        password: "password",
        plateforme: "MT4",
        serveur: "Server-Live",
        status: "actif",
        tags: [
            {
                compteId: 1,
                tag: {
                    name: "Tag 1",
                },
                tagId: 1,
            },
        ],
        type_compte: "reel",
    },
];

export const fakeDashboardOptimisations: inferProcedureResult<Procedures, "queries", "optimisations.get_by_compte_id"> =
    [
        {
            capital: 1000,
            compte: {
                name: "Compte réel 1",
            },
            compteId: 1,
            date_debut: "2018-01-01",
            decalage_ct: 3,
            decalage_ct_unit: "mois",
            decalage_lt: 9,
            decalage_lt_unit: "années",
            description: "Description",
            id: 1,
            name: "Optimisation 1",
            paire: "EURUSD",
            robot: {
                name: "Robot 1",
            },
            robotId: 1,
            timeframe: "H1",
            set_path: "set_path",
            xlsm_path: "xlsm_path",
            tags: [],
        },
        {
            capital: 1000,
            compte: {
                name: "Compte réel 1",
            },
            compteId: 1,
            date_debut: "2018-01-01",
            decalage_ct: 3,
            decalage_ct_unit: "mois",
            decalage_lt: 9,
            decalage_lt_unit: "années",
            description: "Description",
            id: 1,
            name: "Optimisation 2",
            paire: "GBPUSD",
            robot: {
                name: "Robot 2",
            },
            robotId: 1,
            timeframe: "M30",
            set_path: "set_path",
            xlsm_path: "xlsm_path",
            tags: [],
        },
        {
            capital: 1000,
            compte: {
                name: "Compte réel 1",
            },
            compteId: 1,
            date_debut: "2018-01-01",
            decalage_ct: 3,
            decalage_ct_unit: "mois",
            decalage_lt: 9,
            decalage_lt_unit: "années",
            description: "Description",
            id: 1,
            name: "Optimisation 3",
            paire: "EURCAD",
            robot: {
                name: "Robot 2",
            },
            robotId: 1,
            timeframe: "M15",
            set_path: "set_path",
            xlsm_path: "xlsm_path",
            tags: [],
        },
    ];

export const fakeDashboardLancementData: inferProcedureResult<
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

export const fakeDashboardOptimisationData: inferProcedureResult<
    Procedures,
    "queries",
    "optimisations.get_xlsm_optimisation_data"
> = {
    drawdowns: [
        (Math.random() * 0.25).toString(),
        (Math.random() * 0.25).toString(),
        (Math.random() * 0.25).toString(),
        (Math.random() * 0.25).toString(),
        (Math.random() * 0.25).toString(),
        (Math.random() * 0.25).toString(),
    ],
    periodes: ["2023-01-01", "2023-04-01", "2023-07-01", "2023-10-01", "2024-01-01", "2024-04-01"],
    resultats: [
        (Math.random() * 90).toString(),
        (Math.random() * 90).toString(),
        (Math.random() * 90).toString(),
        (Math.random() * 90).toString(),
        (Math.random() * 90).toString(),
        (Math.random() * 90).toString(),
    ],
};

export const dashboardViewTourSteps: Step[] = [
    {
        target: ".tour-dashboard-page",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Page dashboard</H3>
                <p>
                    Cette page n'affiche pour l'instant que quelques todos, à terme elle affichera probablement un
                    ensemble de statistiques sur les comptes et robots.
                </p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
    {
        target: ".tour-dashboard-sidebar",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Les comptes</H3>
                <p>
                    Ici vous trouverez les comptes enregistrées dans l'application. En cliquant dessus, vous aurez la
                    liste des optimisations associées à ce compte ainsi qu'un récapitulatif des performances espérées.
                </p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
    {
        target: ".tour-dashboard-recapitulatif",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Le récapitulatif</H3>
                <p>
                    Si toutes les optimisations associées au compte sont <strong>terminées</strong> donc avec des
                    données valides, le récapitulatif affichera une aggrégation des résultats.
                </p>
                <p>En première ligne vous trouverez les gains aggrégés réalisées sur chaque période.</p>
                <p>En seconde ligne, un cumul des drawdowns sur chaque période.</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
    {
        target: ".tour-dashboard-profil",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Générer un profil MT4</H3>
                <p>
                    Grâce a ce bouton, vous pourrez directement générer un profil MT4. Ce dernier vous permettra de
                    lancer directement tout les robots, paramétrés comme il faut pour chaque optimisation.
                </p>
                <p>
                    Pour l'utiliser, cliquez sur le bouton, choisisssez un répertoire de sortie, le logiciel va alors
                    créer un répertoire avec le nom du compte et dedans générer des .chr. Il va aussi générer un .zip
                    avec ces mêmes données.
                </p>
                <p>
                    Il vous suffit alors de copier le dossier <strong>ou</strong> de dézipper l'archive dans le dossier
                    "profiles" de MT4 (accessible en faisant Fichier &gt; Ouvrir le dossier des données).
                </p>
                <p>Vous verrez et pourrez alors appliquer le profil via Fichier &gt; Profil &gt; Nom du compte</p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
    {
        target: ".tour-dashboard-robots",
        content: (
            <div className={"flex flex-col gap-2"}>
                <H3>Les optimisations</H3>
                <p>
                    Enfin, vous avez ici la liste des optimisations qui tournent sur le compte. Vous pouvez cliquer sur
                    une ligne pour aller directement voir les détails.
                </p>
            </div>
        ),
        ...defaultStepOptions,
        data: {},
    },
];
