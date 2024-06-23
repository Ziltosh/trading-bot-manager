import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CompteReelDataTable } from "@/components/ui/custom/comptes/reel-datatable.tsx";
import { PriceFormatted } from "@/components/ui/custom/price-formatted.tsx";
import { rspcClient } from "@/helpers/rspc.ts";
import useAppContext from "@/hooks/useAppContext.ts";
import { fakeComptes } from "@/lib/tours/comptesTour";
import { Procedures } from "@/rspc_bindings.ts";
import { MyfxbookMyAccountsResponse } from "@/types/myfxbook.ts";
import { inferProcedureResult } from "@rspc/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDownIcon, EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export const CompteContentReel = () => {
    /** TOUR **/
    const {
        state: { run, section },
    } = useAppContext();
    /** END TOUR **/

    const {
        isSuccess: comptesIsSuccess,
        isPending: comptesIsPending,
        data,
    } = useQuery({
        queryKey: ["comptes", "get_reel"],
        queryFn: () => {
            if (!run || section !== "comptes") return rspcClient.query(["comptes.get_reel"]);

            return new Promise<inferProcedureResult<Procedures, "queries", "comptes.get_reel">>((resolve) => {
                resolve(fakeComptes);
            });
        },
    });

    const { isSuccess: myfxbookSuccess, data: myfxbookData } = useQuery<MyfxbookMyAccountsResponse>({
        queryKey: ["myfxbook", "my_accounts"],
        queryFn: async () => {
            const res = await fetch(
                `https://www.myfxbook.com/api/get-my-accounts.json?session=${localStorage.getItem("api-myfxbook-session")}`,
            );
            const data = await res.json();
            console.log(data);
            return data;
        },
    });

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const handleSelectCompte = useCallback(
        (id: number, myfxbookId?: number) => {
            navigate(`/comptes/${id}/${myfxbookId}`);
        },
        [navigate],
    );

    const handleDeleteCompte = useCallback(
        async (id: number) => {
            await rspcClient.mutation(["comptes.delete", { id: id }]);
            await queryClient.invalidateQueries({
                queryKey: ["comptes", "get_reel"],
            });
        },
        [queryClient],
    );

    const columnHelper = createColumnHelper<inferProcedureResult<Procedures, "queries", "comptes.get_reel">[0]>();

    const columns = useMemo(
        () => [
            columnHelper.display({
                id: "actions",
                cell: ({ row }) => {
                    const myfxbookAccount = myfxbookData?.accounts.find(
                        (acc) => acc.accountId === parseInt(row.original.numero, 10),
                    );
                    return (
                        <div className="flex gap-1">
                            <Button
                                className={"tour-comptes-view w-10 p-0 hover:bg-accent hover:text-accent-foreground"}
                                variant={"secondary"}
                                onClick={() => handleSelectCompte(row.original.id, myfxbookAccount?.id)}
                            >
                                <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                className={"tour-comptes-edit w-10 p-0 hover:bg-accent hover:text-accent-foreground"}
                                variant={"secondary"}
                                onClick={() => null}
                            >
                                <PencilIcon className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        className={
                                            "tour-comptes-delete h-10 w-10 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                        }
                                        variant={"ghost"}
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>Confirmation</AlertDialogHeader>
                                    <AlertDialogDescription>
                                        Voulez vous vraiment supprimer ce compte ?
                                    </AlertDialogDescription>
                                    <AlertDialogFooter>
                                        <AlertDialogAction onClick={() => handleDeleteCompte(row.original.id)}>
                                            Confirmer
                                        </AlertDialogAction>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    );
                },
            }),
            columnHelper.accessor("name", {
                id: "name",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            size={"sm"}
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Nom
                            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => {
                    return <div className={"flex items-center gap-2"}>{row.getValue("name")}</div>;
                },
            }),
            columnHelper.accessor("capital", {
                id: "capital",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            size={"sm"}
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Capital
                            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => {
                    const myfxbookAccount = myfxbookData?.accounts.find(
                        (acc) => acc.accountId === parseInt(row.original.numero, 10),
                    );
                    return (
                        <>
                            <PriceFormatted valeur={row.original.capital} currency={row.original.devise} />
                            {myfxbookSuccess && myfxbookAccount && (
                                <div className={"flex gap-1 text-xs"}>
                                    <PriceFormatted valeur={myfxbookAccount.balance} currency={row.original.devise} /> (
                                    <PriceFormatted
                                        valeur={myfxbookAccount.equity - myfxbookAccount.balance}
                                        withColors={true}
                                        currency={row.original.devise}
                                    />
                                    )
                                </div>
                            )}
                        </>
                    );
                },
            }),
            columnHelper.accessor("tags", {
                id: "tags",
                header: () => <span>Tags</span>,
                cell: ({ row }) => {
                    return (
                        <div className={"flex gap-2"}>
                            {row.original.tags.map((tag) => (
                                <Badge variant={"secondary"} key={tag.tagId} className={"whitespace-nowrap"}>
                                    {tag.tag.name}
                                </Badge>
                            ))}
                        </div>
                    );
                },
            }),
            columnHelper.accessor("courtier", {
                id: "courtier",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            size={"sm"}
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Courtier
                            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => {
                    return <div className={"flex items-center gap-2"}>{row.getValue("courtier")}</div>;
                },
            }),

            columnHelper.accessor("numero", {
                id: "numero",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            size={"sm"}
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Numéro
                            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => {
                    return (
                        <div className={"flex gap-2"}>
                            <Badge variant={"outline"}>{row.original.plateforme?.toUpperCase()}</Badge>
                            <div className={"flex items-center gap-2"}>{row.getValue("numero")}</div>
                        </div>
                    );
                },
            }),

            columnHelper.accessor("status", {
                id: "status",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            size={"sm"}
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Status
                            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => {
                    return <Badge variant={"secondary"}>{row.getValue("status")}</Badge>;
                },
            }),
        ],
        [columnHelper, handleDeleteCompte, handleSelectCompte, myfxbookData?.accounts, myfxbookSuccess],
    );

    if (comptesIsSuccess) return <CompteReelDataTable data={data} columns={columns} isLoading={comptesIsPending} />;

    return <p>Error</p>;
};
