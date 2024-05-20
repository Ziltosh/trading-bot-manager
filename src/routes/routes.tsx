import App from "@/App.tsx";
import { HomePage } from "@/pages/home/home.tsx";
import { RobotsPage } from "@/pages/robots/robots.tsx";
import { RobotContentMain } from "@/pages/robots/content/main.tsx";
import { RobotDetails } from "@/pages/robots/content/details.tsx";
import { OptimisationsPage } from "@/pages/optimisations/content.tsx";
import { OptimisationContentMain } from "@/pages/optimisations/content/main.tsx";
import { OptimisationDetails } from "@/pages/optimisations/content/details/details.tsx";
import { ComptesPage } from "@/pages/comptes/content.tsx";
import { CompteDetails } from "@/pages/comptes/content/details/details.tsx";
import { OutilsPage } from "@/pages/outils/outils.tsx";
import { HomeContentDetails } from "@/pages/home/content/details.tsx";

export const routes = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <HomePage />,
                errorElement: <a href={"/"}>Retour à l'accueil</a>,
            },
            {
                path: "/home",
                element: <HomePage />,
                children: [
                    {
                        path: "compte/:id",
                        element: <HomeContentDetails />,
                        errorElement: <a href={"/"}>Retour à l'accueil</a>,
                    },
                ],
            },
            {
                path: "/robots",
                element: <RobotsPage />,
                children: [
                    {
                        path: "main",
                        element: <RobotContentMain />,
                    },
                    {
                        path: ":id",
                        element: <RobotDetails />,
                    },
                ],
            },
            {
                path: "/comptes",
                element: <ComptesPage />,
                children: [
                    {
                        path: ":id/:myfxbookId?",
                        element: <CompteDetails />,
                    },
                ],
            },
            {
                path: "/optimisations",
                element: <OptimisationsPage />,
                children: [
                    {
                        path: "main",
                        element: <OptimisationContentMain />,
                    },
                    {
                        path: ":id",
                        element: <OptimisationDetails />,
                    },
                ],
            },
            {
                path: "/outils",
                element: <OutilsPage />,
            },
        ],
    },
];
