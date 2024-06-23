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
import { Help } from "@/components/ui/custom/help";
import useAppContext from "@/hooks/useAppContext";
import { inferProcedureResult } from "@rspc/client";
import { Procedures } from "@/rspc_bindings";
import { fakeOptimisationViewInfos } from "@/lib/tours/optimisationViewTour";

export const OptimisationDetails = () => {
    /** TOUR **/
    const {
        state: { run, section },
    } = useAppContext();
    /** END TOUR **/

    const { id } = useParams();

    const queryClient = useQueryClient();

    const { isSuccess: isSuccessOpById, data: dataOpById } = useQuery({
        queryKey: ["optimisations", "get_by_id", parseInt(id!, 10)],
        queryFn: () => {
            if (!run || section !== "optimisationView")
                return rspcClient.query(["optimisations.get_by_id", { id: parseInt(id!, 10) }]);

            return new Promise<inferProcedureResult<Procedures, "queries", "optimisations.get_by_id">>((resolve) => {
                resolve(fakeOptimisationViewInfos);
            });
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
            <div className="mr-2 flex items-center justify-between">
                <H2 className="flex-grow">{dataOpById.name}</H2>
                <Help section="optimisationView" />
            </div>
            <div className="tour-optimisationview-infos space-y-2">
                <p className={"font-bold"}>Timeframe: {dataOpById.timeframe}</p>
                <p className={"font-bold"}>Paire: {dataOpById.paire}</p>
                <p className={"font-bold"}>
                    Capital: <PriceFormatted valeur={dataOpById.capital} />
                </p>
                <p>{dataOpById.description}</p>
            </div>
            <div className={"my-2 flex flex-col gap-1 rounded-lg bg-secondary p-2 px-3 text-justify"}>
                <H4>Étape 1</H4>
                <p>
                    Si la récupération des données depuis Metatrader n'a pas été faite, ouvrez le fichier Excel et
                    lancer la récupération des données et l'optimisation. Vous pouvez enregistrer le fichier dans un
                    autre dossier si nécessaire.
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
            <Tabs defaultValue="lancement" className="tour-optimisationview-tabs">
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
