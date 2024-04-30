import { H2 } from "@/components/ui/typos.tsx";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { rspcClient } from "@/helpers/rspc.ts";
import { PriceFormatted } from "@/components/ui/custom/price-formatted.tsx";
import { useState } from "react";
import { EyeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";

export const CompteDetails = () => {
    const { id } = useParams();

    const [showPassword, setShowPassword] = useState(false);

    const { data, status } = useQuery({
        queryKey: ["comptes", "get_by_id", id],
        queryFn: () => {
            return rspcClient.query(["comptes.get_by_id", { id: parseInt(id!, 10) }]);
        },
        enabled: !!id,
    });

    if (status === "pending") {
        return <p>Chargement...</p>;
    }

    if (status === "error") {
        return <p>Erreur</p>;
    }

    return (
        <div className={"flex flex-col gap-2 overflow-y-scroll"}>
            <H2>Compte {data!.name}</H2>
            <div className="grid grid-cols-2 gap-3">
                <p>
                    Type de compte : <br />
                    <strong>{data!.type_compte}</strong>
                </p>
                <p>
                    Capital :
                    <strong>
                        <PriceFormatted valeur={data!.capital} currency={data!.devise} />
                    </strong>
                </p>
                <p>
                    Courtier : <br />
                    <strong>{data!.courtier}</strong>
                </p>
                <p>
                    Plateforme: <br />
                    <strong>{data!.plateforme.toUpperCase()}</strong>
                </p>
                <p>
                    Numéro de compte: <br />
                    <strong>{data!.numero}</strong>
                </p>
                <p>
                    Password: <br />
                    <div className={"flex gap-2 font-bold"}>
                        {showPassword ? data!.password : "********"}
                        <EyeIcon
                            className={"h-5 w-5 cursor-pointer items-center"}
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>
                </p>
                <p>
                    Serveur: <br />
                    <strong>{data!.serveur}</strong>
                </p>
                <p>
                    Status: <br />
                    <strong>{data!.status}</strong>
                </p>
                <div>
                    Tags: <br />
                    <div className={"flex gap-2"}>
                        {data!.tags.map((tag) => (
                            <Badge variant={"secondary"} key={tag.tagId} className={"my-1 whitespace-nowrap"}>
                                {tag.tag.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
