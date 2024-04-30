import { Outlet, useLocation } from "react-router-dom";
import { CompteContentMain } from "@/pages/comptes/content/main.tsx";

export const ComptesPage = () => {
    const location = useLocation();

    return (
        <div className="relative flex h-full w-full flex-col p-2">
            {location.pathname === "/comptes" ? <CompteContentMain /> : <Outlet />}
        </div>
    );
};
