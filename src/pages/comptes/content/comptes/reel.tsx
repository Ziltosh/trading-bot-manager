import { createColumnHelper } from "@tanstack/react-table";
import { inferProcedureResult } from "@rspc/client";
import { Procedures } from "@/rspc_bindings.ts";
import { useMemo } from "react";
import { Button } from "@/components/ui/button.tsx";
import { ArrowUpDownIcon, EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { PriceFormatted } from "@/components/ui/custom/price-formatted.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { rspcClient } from "@/helpers/rspc.ts";
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
import { useNavigate } from "react-router-dom";
import { CompteReelDataTable } from "@/components/ui/custom/comptes/reel-datatable.tsx";
import useAppContext from "@/hooks/useAppContext.ts";

export const CompteContentReel = () => {
    /** TOUR **/
    const {
        state: { tourActive },
    } = useAppContext();
    /** END TOUR **/

    const { isSuccess, isPending, data } = useQuery({
        queryKey: ["comptes", "get_reel"],
        queryFn: () => {
            if (!tourActive) return rspcClient.query(["comptes.get_reel"]);

            return new Promise((resolve) => {
                resolve([
                    {
                        id: 1,
                        name: "Compte test",
                        capital: 1000,
                        devise: "USD",
                        courtier: "IC Markets",
                        numero: "123456",
                        plateforme: "mt4",
                        status: "Actif",
                        tags: [{ tagId: 1, tag: { name: "Tag 1" } }],
                    },
                ]);
            });
        },
    });

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const columnHelper = createColumnHelper<inferProcedureResult<Procedures, "queries", "comptes.get_reel">[0]>();

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
                                disabled={true}
                                className={"w-10 p-0 hover:bg-accent hover:text-accent-foreground"}
                                variant={"secondary"}
                                onClick={() => null}
                            >
                                <PencilIcon className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        className={
                                            "h-10 w-10 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
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

    const handleSelectCompte = (id: number) => {
        navigate(`/comptes/${id}`);
    };

    const handleDeleteCompte = async (id: number) => {
        await rspcClient.mutation(["comptes.delete", { id: id }]);
        await queryClient.invalidateQueries({
            queryKey: ["comptes", "get_reel"],
        });
    };

    if (status === "error") {
        return <p>Error</p>;
    }

    if (isSuccess) return <CompteReelDataTable data={data} columns={columns} isLoading={isPending} />;

    return <p>Error</p>;
};
