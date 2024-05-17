import { useGlobalStore } from "@/stores/global-store.ts";
import { useMount } from "react-use";
import useAppContext from "@/hooks/useAppContext.ts";
import { H2 } from "@/components/ui/typos.tsx";
import { createColumnHelper } from "@tanstack/react-table";
import { inferProcedureResult } from "@rspc/client";
import { Procedures } from "@/rspc_bindings.ts";
import { useMemo } from "react";
import { Button } from "@/components/ui/button.tsx";
import { ArrowUpDownIcon, EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
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
import { RobotsDataTable } from "@/components/ui/custom/robots/robots-datatable.tsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { rspcClient } from "@/helpers/rspc.ts";
import { $robotAddPopup, $robotEditPopup } from "@/signals/components/ui/popups.ts";
import { useNavigate } from "react-router-dom";
import { TourSteps } from "@/WelcomeTourSteps.ts";

export const RobotContentMain = () => {
    /** TOUR **/
    const {
        setState,
        state: { tourActive },
    } = useAppContext();

    useMount(() => {
        if (tourActive) {
            setTimeout(() => {
                setState({ run: true, stepIndex: TourSteps.TOUR_ROBOT });
            }, 200);
        }
    });
    /** END TOUR **/

    const { setCurrentRobot } = useGlobalStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["robots", "all"],
        queryFn: () => {
            if (!tourActive) return rspcClient.query(["robots.all"]);

            return new Promise<inferProcedureResult<Procedures, "queries", "robots.all">>((resolve) => {
                resolve([
                    {
                        id: 1,
                        name: "Robot test",
                        description: "Description",
                        json_settings: "{}",
                        tags: [{ robotId: 1, tagId: 1, tag: { name: "Tag test" } }],
                    },
                ]);
            });
        },
    });

    const handleAddRobot = () => {
        $robotAddPopup.set(true);
    };

    const handleEditRobot = async (id: number) => {
        $robotEditPopup.set(true);
        const robot = await rspcClient.query(["robots.get_by_id", { id: id }]);
        setCurrentRobot(robot || undefined);
    };

    const handleSelectRobot = (id: number) => {
        navigate(`/robots/${id}`);
    };

    const handleDeleteRobot = async (id: number) => {
        await rspcClient.mutation(["robots.delete", { id }]);
        await queryClient.invalidateQueries({
            queryKey: ["robots.all"],
        });
    };

    setCurrentRobot(undefined);

    const columnHelper = createColumnHelper<inferProcedureResult<Procedures, "queries", "robots.all">[0]>();

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
                                onClick={() => handleSelectRobot(row.original.id)}
                            >
                                <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                className={"w-10 p-0 hover:bg-accent hover:text-accent-foreground"}
                                variant={"secondary"}
                                onClick={() => handleEditRobot(row.original.id)}
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
                                        Voulez vous vraiment supprimer cette optimisation ?
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
        ],
        [columnHelper],
    );

    return (
        <div className="tour-robots flex flex-col overflow-y-scroll">
            <H2>Robots</H2>

            {data?.length === 0 && <p>Aucun robot.</p>}
            {data && data?.length > 0 && (
                <div className={"my-2"}>
                    <RobotsDataTable columns={columns} data={data!} isLoading={isLoading} />
                </div>
            )}

            <Button type={"button"} variant={"default"} className={"tour-robots-add"} onClick={handleAddRobot}>
                Ajouter un robot
            </Button>
        </div>
    );
};
