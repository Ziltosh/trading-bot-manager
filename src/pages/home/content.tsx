import { Outlet, useLocation } from "react-router-dom";
import { HomeContentMain } from "@/pages/home/content/main.tsx";

export const HomeContent = () => {
    // const portfolioAddPopup = useSignal($portfolioAddPopup)
    const location = useLocation();

    return (
        <div className="relative flex h-full w-full flex-col p-2">
            {location.pathname === "/home" ? <HomeContentMain /> : <Outlet />}
        </div>
    );
};
