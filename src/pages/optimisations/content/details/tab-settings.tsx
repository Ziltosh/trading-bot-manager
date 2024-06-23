import { Button } from "@/components/ui/button.tsx";
import { RobotSettings } from "@/components/ui/custom/robot-settings.ts.tsx";
import { rspcClient } from "@/helpers/rspc.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
import { appDataDir } from "@tauri-apps/api/path";

interface OptimisationTabSettingsProps {
    dataOpById: { id: number; set_path: string; robot: { name: string }; name: string };
}

export const OptimisationTabSettings = ({ dataOpById }: OptimisationTabSettingsProps) => {
    const queryClient = useQueryClient();

    const { isSuccess: isSuccessSetData, data: dataSetData } = useQuery({
        queryKey: ["optimisations", "get_set_data", dataOpById?.id],
        queryFn: () => {
            return rspcClient.query(["optimisations.get_set_data", { path: dataOpById!.set_path }]);
        },
        // enabled: isSuccessOpById,
        retry: (failureCount) => failureCount < 1,
    });

    const updateSet = useMutation({
        mutationFn: async (path: string) => {
            await invoke("replace_file", {
                original: dataOpById?.set_path,
                nouveau: path,
            });
            await rspcClient.mutation([
                "optimisation_periodes.delete_for_optimisation_id",
                { optimisation_id: dataOpById!.id },
            ]);
        },
        onSuccess: () => {
            queryClient.resetQueries({
                queryKey: ["optimisations", "get_set_data"],
            });
        },
    });

    const handleClickRenvoyerSet = async () => {
        const path = await open({
            filters: [
                {
                    name: "Fichier .set",
                    extensions: ["set"],
                },
            ],
            defaultPath: (await appDataDir()) + dataOpById?.robot.name + "/" + dataOpById?.name,
        });
        if (path) {
            updateSet.mutate(path as string);
        }
    };

    return (
        <div className={"flex flex-col gap-2"}>
            <p>Il s'agit du .set envoyé lors de la création de l'optimisation et qui a servi pour le backtest.</p>
            <Button className={"self-center"} onClick={handleClickRenvoyerSet}>
                Renvoyer un .set
            </Button>
            {isSuccessSetData && <RobotSettings setFile={dataSetData} displayPassages={true} />}
        </div>
    );
};
