import { useNavigate, useParams } from "react-router-dom";
import { H2, H3 } from "@/components/ui/typos.tsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { rspcClient } from "@/helpers/rspc.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { RobotSettings } from "@/components/ui/custom/robot-settings.ts.tsx";
import { SetEntry } from "@/helpers/setFiles.ts";
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
import { Button } from "@/components/ui/button.tsx";

export const RobotDetails = () => {
    const { id } = useParams();

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { isSuccess, data } = useQuery({
        queryKey: ["robots.get_by_id", { id: parseInt(id!, 10) }],
        queryFn: () => {
            return rspcClient.query(["robots.get_by_id", { id: parseInt(id!, 10) }]);
        },
    });

    const handleDeleteRobot = async (id: number) => {
        await rspcClient.mutation(["robots.delete", { id: id }]);
        await navigate("/robots");
        await queryClient.invalidateQueries({
            queryKey: ["robots.all"],
        });
    };

    if (isSuccess && data) {
        return (
            <div className={"flex flex-col gap-2"}>
                <div className="flex">
                    <H2 className={"mr-2 flex-grow"}>{data?.name}</H2>
                    <div className="flex items-center justify-center gap-2">
                        {data.tags.map((tag) => {
                            return (
                                <Badge key={tag.tagId} variant={"secondary"}>
                                    {tag.tag.name}
                                </Badge>
                            );
                        })}
                    </div>
                </div>

                <p>{data?.description}</p>
                <H3>Paramètres</H3>
                <div className="rounded-lg bg-gray-100 p-2 text-black">
                    TODO: Pouvoir enregistrer des set de paramètres préconfigurés avec des tags pour vos robots et les
                    charger lors de la création d'une optimisation.
                </div>
                <RobotSettings
                    jsonData={JSON.parse(data.json_settings) as SetEntry[]}
                    displayAll={true}
                    displayPassages={false}
                />
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant={"destructive"}>Supprimer le robot</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>Confirmation</AlertDialogHeader>
                        <AlertDialogDescription>
                            Voulez vous vraiment supprimer ce robot ?
                            <br />
                            Cette action est irréversible et supprimera les données liées aux robots (optimisations,
                            fichier set).
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={() => handleDeleteRobot(data!.id)}>Confirmer</AlertDialogAction>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        );
    }

    return <div>Chargement...</div>;
};
