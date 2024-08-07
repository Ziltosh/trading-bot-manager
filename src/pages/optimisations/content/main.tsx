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
import { Help } from "@/components/ui/custom/help";
import { OptimisationDataTable } from "@/components/ui/custom/optimisations/optimisations-datatable.tsx";
import { PriceFormatted } from "@/components/ui/custom/price-formatted.tsx";
import { H2 } from "@/components/ui/typos.tsx";
import { convertToDate } from "@/helpers/periode.ts";
import { rspcClient } from "@/helpers/rspc.ts";
import useAppContext from "@/hooks/useAppContext.ts";
import { fakeOptimisations } from "@/lib/tours/optimisationsTour";
import { Procedures } from "@/rspc_bindings.ts";
import { $optimisationAddPopup, $optimisationEditPopup } from "@/signals/components/ui/popups.ts";
import { useGlobalStore } from "@/stores/global-store.ts";
import { inferProcedureResult } from "@rspc/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDownIcon, EyeIcon, PencilIcon, TrashIcon, XIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export const OptimisationContentMain = () => {
    /** TOUR **/
    const {
        state: { run, section },
    } = useAppContext();
    /** END TOUR **/

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { setCurrentOptimisation } = useGlobalStore();

    const handleAddOptimisation = async () => {
        $optimisationAddPopup.set(true);
        // console.log(await invoke("test"));
    };

    const handleEditOptimisation = useCallback(
        async (id: number) => {
            $optimisationEditPopup.set(true);
            const opti = await rspcClient.query(["optimisations.get_by_id", { id: id }]);
            setCurrentOptimisation(opti || undefined);
        },
        [setCurrentOptimisation],
    );

    const { data, isLoading } = useQuery({
        queryKey: ["optimisations", "all"],
        queryFn: () => {
            if (!run || section !== "optimisations") return rspcClient.query(["optimisations.all"]);

            return new Promise<inferProcedureResult<Procedures, "queries", "optimisations.all">>((resolve) => {
                resolve(fakeOptimisations);
            });
        },
    });

    const handleSelectOptimisation = useCallback(
        (id: number) => {
            navigate(`/optimisations/${id}`);
        },
        [navigate],
    );

    const handleDeleteOptimisation = useCallback(
        async (id: number) => {
            await rspcClient.mutation(["optimisations.delete", { id: id }]);
            await queryClient.invalidateQueries({
                queryKey: ["optimisations"],
            });
        },
        [queryClient],
    );

    const columnHelper = createColumnHelper<inferProcedureResult<Procedures, "queries", "optimisations.all">[0]>();

    const columns = useMemo(
        () => [
            columnHelper.display({
                id: "actions",
                cell: ({ row }) => {
                    return (
                        <div className="flex gap-1">
                            <Button
                                className={
                                    "tour-optimisations-view w-10 p-0 hover:bg-accent hover:text-accent-foreground"
                                }
                                variant={"secondary"}
                                onClick={() => handleSelectOptimisation(row.original.id)}
                            >
                                <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                className={
                                    "tour-optimisations-edit w-10 p-0 hover:bg-accent hover:text-accent-foreground"
                                }
                                variant={"secondary"}
                                onClick={() => handleEditOptimisation(row.original.id)}
                            >
                                <PencilIcon className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        className={
                                            "tour-optimisations-delete h-10 w-10 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                        }
                                        variant={"ghost"}
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>Confirmation</AlertDialogHeader>
                                    <AlertDialogDescription>
                                        Voulez vous vraiment supprimer cette optimisation ?
                                    </AlertDialogDescription>
                                    <AlertDialogFooter>
                                        <AlertDialogAction onClick={() => handleDeleteOptimisation(row.original.id)}>
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
            // columnHelper.accessor("robot", {
            //     id: "robot",
            //     header: ({ column }) => {
            //         return (
            //             <Button
            //                 variant="ghost"
            //                 size={"sm"}
            //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            //             >
            //                 Robot
            //                 <ArrowUpDownIcon className="ml-2 h-4 w-4" />
            //             </Button>
            //         );
            //     },
            //     cell: ({ row }) => {
            //         return <div className={"flex items-center gap-2"}>{row.original.robot.name}</div>;
            //     },
            // }),
            columnHelper.accessor("compte.name", {
                id: "compte",
                enableColumnFilter: true,
                filterFn: (row, filterValue) => {
                    return row.original.compte?.name.toLowerCase().includes(filterValue.toLowerCase()) ?? false;
                },
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            size={"sm"}
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Compte
                            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => {
                    // return <div className={"flex items-center gap-2"}>{row.original.compte?.name || "Aucun"}</div>;
                    return row.original.compte?.name;
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
                    return <PriceFormatted valeur={row.original.capital} />;
                },
            }),
            // columnHelper.accessor("paire", {
            //     id: "paire",
            //     header: ({ column }) => {
            //         return (
            //             <Button
            //                 variant="ghost"
            //                 size={"sm"}
            //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            //             >
            //                 Paire
            //                 <ArrowUpDownIcon className="ml-2 h-4 w-4" />
            //             </Button>
            //         );
            //     },
            //     cell: ({ row }) => {
            //         return <span>{row.original.paire}</span>;
            //     },
            // }),
            // columnHelper.accessor("timeframe", {
            //     id: "timeframe",
            //     header: ({ column }) => {
            //         return (
            //             <Button
            //                 variant="ghost"
            //                 size={"sm"}
            //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            //             >
            //                 TF
            //                 <ArrowUpDownIcon className="ml-2 h-4 w-4" />
            //             </Button>
            //         );
            //     },
            //     cell: ({ row }) => {
            //         return <span>{row.original.timeframe}</span>;
            //     },
            // }),
            columnHelper.accessor((row) => row.tags.map((tag) => tag.tag.name).join(", "), {
                id: "tags",
                filterFn: (row, filterValue) => {
                    console.log(row, filterValue);
                    return row.original.tags.some((tag) => tag.tag.name === filterValue);
                },
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
            columnHelper.accessor("date_debut", {
                id: "date_debut",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            size={"sm"}
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Début
                            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => {
                    return convertToDate(row.original.date_debut).toLocaleDateString();
                },
            }),
            columnHelper.accessor("decalage_ct", {
                id: "decalage_ct",
                header: ({ column }) => {
                    return (
                        <div className="text-center">
                            <Button
                                variant="ghost"
                                size={"sm"}
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            >
                                Déc. court
                                <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    );
                },
                cell: ({ row }) => {
                    return (
                        <div className="text-center">
                            <span>
                                {row.original.decalage_ct} {row.original.decalage_ct_unit}
                            </span>
                        </div>
                    );
                },
            }),
            columnHelper.accessor("decalage_lt", {
                id: "decalage_lt",
                header: ({ column }) => {
                    return (
                        <div className="text-center">
                            <Button
                                variant="ghost"
                                size={"sm"}
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            >
                                Déc. long
                                <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    );
                },
                cell: ({ row }) => {
                    return (
                        <div className={"text-center"}>
                            <div className={"flex flex-col items-center"}>
                                {row.original.decalage_lt === 0 && <XIcon className="h-6 w-6 text-red-500" />}
                            </div>
                            {row.original.decalage_lt > 0 && (
                                <span>
                                    {row.original.decalage_lt} {row.original.decalage_lt_unit}
                                </span>
                            )}
                        </div>
                    );
                },
            }),
        ],
        [columnHelper, handleDeleteOptimisation, handleEditOptimisation, handleSelectOptimisation],
    );

    return (
        <div className="tour-optimisations flex flex-col overflow-y-scroll">
            <div className="flex items-center justify-between">
                <H2 className="flex-grow">Les optimisations</H2>
                <Help section="optimisations" />
            </div>

            {data?.length === 0 && <p>Aucune optimisation.</p>}
            {data && data?.length > 0 && (
                <div className={"my-2"}>
                    <OptimisationDataTable columns={columns} data={data!} isLoading={isLoading} />
                </div>
            )}

            <Button
                className={"tour-optimisations-add"}
                type={"button"}
                variant={"default"}
                onClick={handleAddOptimisation}
            >
                Ajouter une optimisation
            </Button>
        </div>
    );
};
