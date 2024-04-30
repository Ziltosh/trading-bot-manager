import { inferProcedureResult } from "@rspc/client";
import { Procedures } from "@/rspc_bindings.ts";
import { useGlobalStore } from "@/stores/global-store.ts";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge.tsx";

interface CompteHomeSidebarProps {
    compte: inferProcedureResult<Procedures, "queries", "comptes.get_reel">[0];
}

export const HomeCompteSidebar = ({ compte }: CompteHomeSidebarProps) => {
    const { currentCompte, setCurrentCompte } = useGlobalStore();
    const navigate = useNavigate();

    const handleClick = () => {
        setCurrentCompte(compte);
        navigate("/home/compte/" + compte.id);
    };

    return (
        <div
            className={`flex flex-col gap-2 rounded-lg border p-2 text-center ${compte?.id === currentCompte?.id && "bg-secondary"} cursor-pointer hover:bg-accent hover:text-primary-foreground`}
            onClick={handleClick}
        >
            {compte.name} <small>{compte.numero}</small>
            <div className="flex gap-2">
                <Badge variant={"secondary"}>{compte.type_compte.toUpperCase()}</Badge>
                <Badge variant={"secondary"}>{compte.plateforme.toUpperCase()}</Badge>
            </div>
        </div>
    );
};
