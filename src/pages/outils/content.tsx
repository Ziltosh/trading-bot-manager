import { Outlet, useLocation } from "react-router-dom";
import { OutilsContentMain } from "@/pages/outils/content/main.tsx";

export const OutilsContent = () => {
    // const portfolioAddPopup = useSignal($portfolioAddPopup)
    const location = useLocation();

    return (
        <div className="relative flex h-full w-full flex-col p-2">
            {location.pathname === "/outils" ? <OutilsContentMain /> : <Outlet />}
        </div>
    );
};
