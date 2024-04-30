import { Outlet, useLocation } from "react-router-dom";
import { OptimisationContentMain } from "@/pages/optimisations/content/main.tsx";

export const OptimisationsPage = () => {
    const location = useLocation();

    return (
        <div className="relative flex h-full w-full flex-col p-2">
            {location.pathname === "/optimisations" ? <OptimisationContentMain /> : <Outlet />}
        </div>
    );
};
