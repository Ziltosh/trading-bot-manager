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
import { ComptePropDataTable } from "@/components/ui/custom/comptes/prop-datatable.tsx";
import { PriceFormatted } from "@/components/ui/custom/price-formatted.tsx";
import { rspcClient } from "@/helpers/rspc.ts";
import useAppContext from "@/hooks/useAppContext.ts";
import { Procedures } from "@/rspc_bindings.ts";
import { $compteEditPopup } from "@/signals/components/ui/popups";
import { useGlobalStore } from "@/stores/global-store";
import { inferProcedureResult } from "@rspc/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDownIcon, EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export const CompteContentProp = () => {
    /** TOUR **/
    const {
        state: { run, section },
    } = useAppContext();
    /** END TOUR **/

    const { setCurrentCompte } = useGlobalStore();

    const { isSuccess, isPending, data } = useQuery({
        queryKey: ["comptes", "get_prop"],
        queryFn: () => {
            if (!run || section !== "comptes") return rspcClient.query(["comptes.get_prop"]);

            return new Promise<inferProcedureResult<Procedures, "queries", "comptes.get_prop">>((resolve) => {
                resolve([]);
            });
        },
    });

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const handleSelectCompte = useCallback(
        (id: number) => {
            navigate(`/comptes/${id}`);
        },
        [navigate],
    );

    const handleEditCompte = useCallback(
        (id: number) => {
            setCurrentCompte(data?.find((compte) => compte.id === id));
            $compteEditPopup.set(true);
        },
        [data, setCurrentCompte],
    );

    const handleDeleteCompte = useCallback(
        async (id: number) => {
            await rspcClient.mutation(["comptes.delete", { id: id }]);
            await queryClient.invalidateQueries({
                queryKey: ["comptes", "get_prop"],
            });
        },
        [queryClient],
    );

    const columnHelper = createColumnHelper<inferProcedureResult<Procedures, "queries", "comptes.get_prop">[0]>();

    const columns = useMemo(
        () => [
            columnHelper.display({
                id: "actions",
                cell: ({ row }) => {
                    return (
                        <div className="flex gap-1">
                            <Button
                                className={"w-10 p-0 hover:bg-accent hover:text-accent-foreground"}
                                variant={"secondary"}
                                onClick={() => handleSelectCompte(row.original.id)}
                            >
                                <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                className={"w-10 p-0 hover:bg-accent hover:text-accent-foreground"}
                                variant={"secondary"}
                                onClick={() => handleEditCompte(row.original.id)}
                            >
                                <PencilIcon className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        className={
                                            "w-10 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
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
                    return <PriceFormatted valeur={row.original.capital} currency={row.original.devise} />;
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
                            <Badge variant={"outline"}>{row.original.plateforme.toUpperCase()}</Badge>
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
        [columnHelper],
    );

    if (isSuccess) return <ComptePropDataTable data={data} columns={columns} isLoading={isPending} />;

    return <p>Error</p>;
};
