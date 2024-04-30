import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { H2, H4 } from "@/components/ui/typos.tsx";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rspcClient } from "@/helpers/rspc.ts";
import { Button } from "@/components/ui/button.tsx";
import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
import { appDataDir } from "@tauri-apps/api/path";
import { OptimisationTabSettings } from "@/pages/optimisations/content/details/tab-settings.tsx";
import { OptimisationTabLancement } from "@/pages/optimisations/content/details/tab-lancement.tsx";
import { OptimisationTabOptimisation } from "@/pages/optimisations/content/details/tab-optimisation.tsx";
import { PriceFormatted } from "@/components/ui/custom/price-formatted.tsx";

export const OptimisationDetails = () => {
    const { id } = useParams();

    const queryClient = useQueryClient();

    const { isSuccess: isSuccessOpById, data: dataOpById } = useQuery({
        queryKey: ["optimisations", "get_by_id", parseInt(id!, 10)],
        queryFn: () => {
            return rspcClient.query(["optimisations.get_by_id", { id: parseInt(id!, 10) }]);
        },
        enabled: !!id,
    });

    const updateXlsm = useMutation({
        mutationFn: async (path: string) => {
            await invoke("replace_file", {
                original: dataOpById?.xlsm_path,
                nouveau: path,
            });
            await rspcClient.mutation([
                "optimisation_periodes.delete_for_optimisation_id",
                { optimisation_id: dataOpById!.id },
            ]);
        },
        onSuccess: () => {
            queryClient.resetQueries({
                queryKey: ["optimisations"],
            });
            // queryClient.invalidateQueries({
            //     queryKey: ["optimisations_periodes.get_by_optimisation_id", dataOpById?.id],
            // });
        },
    });

    const handleOpenExcel = async () => {
        await invoke("open_file", { path: dataOpById?.xlsm_path });
    };

    if (!dataOpById || !isSuccessOpById) {
        return <div>Chargement...</div>;
    }

    return (
        <div className={"flex flex-col gap-2 overflow-y-scroll"}>
            <H2>{dataOpById.name}</H2>
            <p className={"font-bold"}>Robot: {dataOpById.robot.name}</p>
            <p className={"font-bold"}>Timeframe: {dataOpById.timeframe}</p>
            <p className={"font-bold"}>Paire: {dataOpById.paire}</p>
            <p className={"font-bold"}>
                Capital: <PriceFormatted valeur={dataOpById.capital} />
            </p>
            <p>{dataOpById.description}</p>
            <div className={"my-2 flex flex-col gap-1 rounded-lg bg-secondary p-2 px-3 text-justify"}>
                Dans une prochaine version, l'optimisation pourra être faite directement avec ce logiciel, ce qui
                devrait être plus rapide qu'avec Excel. En attendant vous devez effectuer le traitement dans Excel comme
                d'habitude et le logiciel ira piocher dedans pour avoir les résultats.
                <H4>Étape 1</H4>
                <p>
                    Ouvrez le fichier Excel et lancer la récupération des données et l'optimisation. Vous pouvez
                    enregistrer le fichier dans un autre dossier si nécessaire.
                </p>
                <div className="flex justify-center gap-2">
                    <Button variant="outline" onClick={handleOpenExcel}>
                        Ouvrir le fichier Excel
                    </Button>
                </div>
                <H4>Étape 2</H4>
                <p>
                    Une fois satisfait du résultat. Renvoyez le fichier excel modifié en cliquant sur le bouton
                    ci-dessous.
                </p>
                <div className="flex justify-center gap-2">
                    <Button
                        variant={"outline"}
                        onClick={async () => {
                            const path = await open({
                                filters: [
                                    {
                                        name: "Fichier Excel",
                                        extensions: ["xlsm"],
                                    },
                                ],
                                defaultPath: (await appDataDir()) + dataOpById?.robot.name + "/" + dataOpById?.name,
                            });
                            if (path) {
                                updateXlsm.mutate(path as string);
                            }
                        }}
                    >
                        Renvoyer le fichier Excel
                    </Button>
                </div>
            </div>
            {/*{statusLancementData === "pending" && (*/}
            {/*    <div className="rounded-lg bg-amber-200 p-2">*/}
            {/*        <p>Chargement des données...</p>*/}
            {/*    </div>*/}
            {/*)}*/}
            {/*{statusLancementData === "error" && (*/}
            {/*    <div className="rounded-lg bg-red-200 p-2">*/}
            {/*        <p>*/}
            {/*            Aucune donnée d'optimisation trouvée, suivez la procédure en haut de cet écran pour effectuer*/}
            {/*            l'optimisation et mettre à jour l'Excel.*/}
            {/*        </p>*/}
            {/*    </div>*/}
            {/*)}*/}
            {/*{statusLancementData === "success" && (*/}
            <Tabs defaultValue="lancement">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="lancement">Lancement</TabsTrigger>
                    <TabsTrigger value="optimisation">Optimisation</TabsTrigger>
                </TabsList>
                <TabsContent value={"settings"}>
                    <OptimisationTabSettings dataOpById={dataOpById} />
                </TabsContent>
                <TabsContent value="lancement">
                    <OptimisationTabLancement dataOpById={dataOpById} />
                </TabsContent>
                <TabsContent value="optimisation">
                    <OptimisationTabOptimisation dataOpById={dataOpById} />
                </TabsContent>
            </Tabs>
            {/*)}*/}
        </div>
    );
};
