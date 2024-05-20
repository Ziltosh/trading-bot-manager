import { H2, H3 } from "@/components/ui/typos.tsx";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { rspcClient } from "@/helpers/rspc.ts";
import { PriceFormatted } from "@/components/ui/custom/price-formatted.tsx";
import { useState } from "react";
import { EyeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";

interface MyfxbookTrade {
    openTime: string;
    symbol: string;
    action: string;
    sizing: MyfxbookTradeSizing;
    openPrice: number;
    tp: number;
    sl: number;
    comment: string;
    profit: number;
    pips: number;
    swap: number;
    magic: string;
}

export interface MyfxbookTradeSizing {
    type: string;
    value: string;
}

export const CompteDetails = () => {
    const { id } = useParams();
    const { myfxbookId } = useParams();

    console.log("id", id);
    console.log("myfxbookId", myfxbookId);

    const [showPassword, setShowPassword] = useState(false);

    const { data: compteData, status: compteStatus } = useQuery({
        queryKey: ["comptes", "get_by_id", id],
        queryFn: () => {
            return rspcClient.query(["comptes.get_by_id", { id: parseInt(id!, 10) }]);
        },
        enabled: !!id,
    });

    const { data: myfxbookTradesData, isSuccess: myfxbookTradesSuccess } = useQuery({
        queryKey: ["myfxbook", "get-open-orders", myfxbookId],
        queryFn: async () => {
            const response = await fetch(
                `https://www.myfxbook.com/api/get-open-trades.json?id=${myfxbookId}&session=${localStorage.getItem("api-myfxbook-session")}`,
            );
            const data = (await response.json()) as { error: boolean; message: string; openTrades: MyfxbookTrade[] };
            return data.openTrades;
        },
        enabled: compteStatus === "success",
    });

    if (compteStatus === "pending") {
        return <p>Chargement...</p>;
    }

    if (compteStatus === "error") {
        return <p>Erreur</p>;
    }

    return (
        <div className={"flex flex-col gap-2 overflow-y-scroll"}>
            <H2>Compte {compteData!.name}</H2>
            <H3>Informations</H3>
            <div className="grid grid-cols-2 gap-3">
                <p>
                    Type de compte : <br />
                    <strong>{compteData!.type_compte}</strong>
                </p>
                <p>
                    Capital :
                    <strong>
                        <PriceFormatted valeur={compteData!.capital} currency={compteData!.devise} />
                    </strong>
                </p>
                <p>
                    Courtier : <br />
                    <strong>{compteData!.courtier}</strong>
                </p>
                <p>
                    Plateforme: <br />
                    <strong>{compteData!.plateforme.toUpperCase()}</strong>
                </p>
                <p>
                    Numéro de compte: <br />
                    <strong>{compteData!.numero}</strong>
                </p>
                <p>
                    Password: <br />
                    <div className={"flex gap-2 font-bold"}>
                        {showPassword ? compteData!.password : "********"}
                        <EyeIcon
                            className={"h-5 w-5 cursor-pointer items-center"}
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>
                </p>
                <p>
                    Serveur: <br />
                    <strong>{compteData!.serveur}</strong>
                </p>
                <p>
                    Status: <br />
                    <strong>{compteData!.status}</strong>
                </p>
                <div>
                    Tags: <br />
                    <div className={"flex gap-2"}>
                        {compteData!.tags.map((tag) => (
                            <Badge variant={"secondary"} key={tag.tagId} className={"my-1 whitespace-nowrap"}>
                                {tag.tag.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
            {myfxbookTradesSuccess && myfxbookTradesData?.length > 0 && (
                <>
                    <H3>Ordres</H3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Symbole</TableHead>
                                <TableHead>Robot</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Taille</TableHead>
                                <TableHead>Profit</TableHead>
                            </TableRow>
                        </TableHeader>

                        {myfxbookTradesSuccess &&
                            myfxbookTradesData?.map((trade) => (
                                <TableBody>
                                    <TableRow>
                                        <TableCell className={"p-1"}>{trade.openTime}</TableCell>
                                        <TableCell className={"p-1"}>{trade.symbol}</TableCell>
                                        <TableCell className={"p-1"}>
                                            {trade.comment} - {trade.magic}
                                        </TableCell>
                                        <TableCell className={"p-1"}>{trade.action}</TableCell>
                                        <TableCell className={"p-1"}>
                                            {trade.sizing.type === "lots" ? (
                                                <span>{trade.sizing.value} lots</span>
                                            ) : (
                                                <span>{trade.sizing.value}%</span>
                                            )}
                                        </TableCell>
                                        <TableCell className={"p-1"}>
                                            <PriceFormatted valeur={trade.profit} withColors={true} />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            ))}
                    </Table>
                </>
            )}
        </div>
    );
};
