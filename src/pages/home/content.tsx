import { Outlet, useLocation } from "react-router-dom";
import { HomeContentMain } from "@/pages/home/content/main.tsx";
import { H2, H4 } from "@/components/ui/typos.tsx";

export const HomeContent = () => {
    // const portfolioAddPopup = useSignal($portfolioAddPopup)
    const location = useLocation();

    return (
        <div className="relative flex h-full w-full flex-col gap-2 p-2">
            {location.pathname === "/home" ? <HomeContentMain /> : <Outlet />}
            {location.pathname === "/" && (
                <>
                    <H2>Bienvenue</H2>
                    <H4>Étape 1: Ajoutez vos robots</H4>
                    <H4>Étape 2: Ajoutez vos comptes</H4>
                    <H4>Étape 3: Ajoutez vos optimisations</H4>
                </>
            )}
        </div>
    );
};
