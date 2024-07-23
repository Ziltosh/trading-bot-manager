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
import { RobotsDataTable } from "@/components/ui/custom/robots/robots-datatable.tsx";
import { H2 } from "@/components/ui/typos.tsx";
import { rspcClient } from "@/helpers/rspc.ts";
import useAppContext from "@/hooks/useAppContext.ts";
import { fakeRobots } from "@/lib/tours/robotsTour";
import { Procedures } from "@/rspc_bindings.ts";
import { $robotAddPopup, $robotEditPopup } from "@/signals/components/ui/popups.ts";
import { useGlobalStore } from "@/stores/global-store.ts";
import { inferProcedureResult } from "@rspc/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDownIcon, EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const RobotContentMain = () => {
    /** TOUR **/
    const {
        state: { run, section },
    } = useAppContext();

    /** END TOUR **/

    const { setCurrentRobot } = useGlobalStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["robots", "all"],
        queryFn: () => {
            if (!run || section !== "robots") return rspcClient.query(["robots.all"]);

            return new Promise<inferProcedureResult<Procedures, "queries", "robots.all">>((resolve) => {
                resolve(fakeRobots);
            });
        },
    });

    const handleAddRobot = () => {
        $robotAddPopup.set(true);
    };

    const handleEditRobot = useCallback(
        async (id: number) => {
            const robot = data?.find((robot) => robot.id === id);
            setCurrentRobot(robot || undefined);
            $robotEditPopup.set(true);
        },
        [setCurrentRobot, data],
    );

    const handleSelectRobot = useCallback(
        (id: number) => {
            navigate(`/robots/${id}`);
        },
        [navigate],
    );

    const handleDeleteRobot = useCallback(
        async (id: number) => {
            await rspcClient.mutation(["robots.delete", { id }]);
            await queryClient.invalidateQueries({
                queryKey: ["robots"],
            });
        },
        [queryClient],
    );

    const columnHelper = createColumnHelper<inferProcedureResult<Procedures, "queries", "robots.all">[0]>();

    const columns = [
        columnHelper.display({
            id: "actions",
            cell: ({ row }) => {
                return (
                    <div className="flex gap-1">
                        <Button
                            className={"tour-robots-view w-10 p-0 hover:bg-accent hover:text-accent-foreground"}
                            variant={"secondary"}
                            onClick={() => handleSelectRobot(row.original.id)}
                        >
                            <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            className={"tour-robots-edit w-10 p-0 hover:bg-accent hover:text-accent-foreground"}
                            variant={"secondary"}
                            onClick={() => handleEditRobot(row.original.id)}
                        >
                            <PencilIcon className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    className={
                                        "tour-robots-delete h-10 w-10 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                    }
                                    variant={"ghost"}
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>Confirmation</AlertDialogHeader>
                                <AlertDialogDescription>
                                    Voulez vous vraiment supprimer ce robot ? Cette action supprimera toutes les
                                    optimisations liées à ce robot.
                                </AlertDialogDescription>
                                <AlertDialogFooter>
                                    <AlertDialogAction onClick={() => handleDeleteRobot(row.original.id)}>
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
    ];

    return (
        <div className="tour-robots flex flex-col overflow-y-scroll">
            <div className="flex items-center justify-between">
                <H2 className="flex-grow">Les robots</H2>
                <Help section="robots" />
            </div>

            {data?.length === 0 && <p>Aucun robot.</p>}
            {!isLoading && !isFetching && data && data.length > 0 && (
                <div className={"my-2"}>
                    <RobotsDataTable columns={columns} data={data} isLoading={isLoading} />
                </div>
            )}

            <Button type={"button"} variant={"default"} className={"tour-robots-add"} onClick={handleAddRobot}>
                Ajouter un robot
            </Button>
        </div>
    );
};
