import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { PriceFormatted } from "@/components/ui/custom/price-formatted.tsx";
import { PercentFormatted } from "@/components/ui/custom/percent-formatted.tsx";
import { convertToDate } from "@/helpers/periode.ts";
import { Button } from "@/components/ui/button.tsx";
import { useQuery } from "@tanstack/react-query";
import { rspcClient } from "@/helpers/rspc.ts";
import { generateSetFromParams, mergeSetParams } from "@/helpers/setFiles.ts";
import { save } from "@tauri-apps/api/dialog";
import { documentDir } from "@tauri-apps/api/path";
import { writeTextFile } from "@tauri-apps/api/fs";

interface OptimisationTabLancementProps {
    dataOpById: { id: number; xlsm_path: string; name: string; paire: string; set_path: string };
}

export const OptimisationTabLancement = ({ dataOpById }: OptimisationTabLancementProps) => {
    const { isSuccess: isSuccessLancementData, data: dataLancementData } = useQuery({
        queryKey: ["optimisations", "get_xlsm_lancement_data", dataOpById?.id],
        queryFn: () => {
            return rspcClient.query(["optimisations.get_xlsm_lancement_data", { path: dataOpById!.xlsm_path }]);
        },
        // enabled: isSuccessOpById,
        retry: (failureCount) => failureCount < 1,
    });

    const { isSuccess: isSuccessOptimisationData } = useQuery({
        queryKey: ["optimisations", "get_xlsm_optimisation_data", dataOpById?.id],
        queryFn: async () => {
            const optimisationData = await rspcClient.query([
                "optimisations.get_xlsm_optimisation_data",
                {
                    path: dataOpById!.xlsm_path,
                    nb_periodes: dataLancementData!.nb_periodes,
                },
            ]);

            for (let i = 0; i < optimisationData.periodes.length; i++) {
                await rspcClient.mutation([
                    "optimisation_periodes.create",
                    {
                        optimisation_id: dataOpById!.id,
                        periode: optimisationData.periodes[i],
                        profit: parseFloat(optimisationData.resultats[i]),
                        drawdown: parseFloat(optimisationData.drawdowns[i]),
                    },
                ]);
            }

            return optimisationData;
        },
        enabled: isSuccessLancementData,
        retry: (failureCount) => failureCount < 1,
    });

    const handleSaveSet = async () => {
        const passageParamsStr = await rspcClient.query([
            "optimisations.get_xlsm_passage_data",
            {
                path: dataOpById!.xlsm_path,
                passage: dataLancementData!.check_passage,
            },
        ]);

        const optiSetParams = await rspcClient.query([
            "optimisations.get_set_data",
            {
                path: dataOpById!.set_path,
            },
        ]);

        const passageSetParams = generateSetFromParams(passageParamsStr);
        const file = mergeSetParams(optiSetParams, passageSetParams);
        const savePath = await save({
            defaultPath:
                (await documentDir()) +
                `/${dataOpById.name}_${dataOpById.paire}_PARAM_${dataLancementData!.check_passage}.set`,
        });
        if (savePath === null) {
            return;
        }
        await writeTextFile(savePath, file);
    };

    if (isSuccessLancementData && isSuccessOptimisationData) {
        return (
            <div className="grid grid-cols-2 gap-2">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead colSpan={2}>Résultats</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className={"p-1"}>Nombre de périodes</TableCell>
                            <TableCell className={"p-1"}>{dataLancementData?.nb_periodes}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={"p-1"}>% de périodes rentables</TableCell>
                            <TableCell className={"p-1"}>{dataLancementData?.pct_periodes_rentables}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={"p-1"}>Résultat total</TableCell>
                            <TableCell className={"p-1"}>
                                <PriceFormatted withColors={true} valeur={dataLancementData?.resultat_total} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={"p-1"}>Résultat moyen par période</TableCell>
                            <TableCell className={"p-1"}>
                                <PriceFormatted withColors={true} valeur={dataLancementData?.periode_resultat_moyen} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={"p-1"}>Meilleur résultat par période</TableCell>
                            <TableCell className={"p-1"}>
                                <PriceFormatted
                                    withColors={true}
                                    valeur={dataLancementData?.periode_meilleur_resultat}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={"p-1"}>Pire résultat par période</TableCell>
                            <TableCell className={"p-1"}>
                                <PriceFormatted withColors={true} valeur={dataLancementData?.periode_pire_resultat} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={"p-1"}>Drawdown maximal</TableCell>
                            <TableCell className={"p-1"}>
                                <PercentFormatted valeur={dataLancementData?.dd_max} />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead colSpan={2}>A valider en tick par tick</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className={"p-1"}>Période validation début</TableCell>
                            <TableCell className={"p-1"}>
                                {convertToDate(dataLancementData?.check_periode_validation_debut).toLocaleDateString()}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={"p-1"}>Période validation fin</TableCell>
                            <TableCell className={"p-1"}>
                                {convertToDate(dataLancementData?.check_periode_validation_fin).toLocaleDateString()}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={"p-1 font-bold"}>Passage</TableCell>
                            <TableCell className={"p-1 font-bold"}>{dataLancementData?.check_passage}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={"p-1"}>Résultat</TableCell>
                            <TableCell className={"p-1"}>
                                <PriceFormatted valeur={dataLancementData?.check_resultat} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={"p-1"}>Résultat mensuel</TableCell>
                            <TableCell className={"p-1"}>
                                <PriceFormatted
                                    valeur={parseFloat(dataLancementData?.check_resultat_mensuel)}
                                    withColors={true}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={"p-1"}>Drawdown</TableCell>
                            <TableCell className={"p-1"}>
                                <PercentFormatted valeur={dataLancementData?.check_dd} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={"p-1"}>Nombre de trades</TableCell>
                            <TableCell className={"p-1"}>{dataLancementData?.check_trades}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Button
                    className={"col-span-2 grow-0 grid-rows-2 justify-self-center"}
                    variant="default"
                    onClick={handleSaveSet}
                >
                    Enregistrer le .set du passage {dataLancementData!.check_passage}
                </Button>
            </div>
        );
    }

    return <div>Chargement...</div>;
};
