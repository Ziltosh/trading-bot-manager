import { PercentFormatted } from "@/components/ui/custom/percent-formatted.tsx";
import { PriceFormatted } from "@/components/ui/custom/price-formatted.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { optimisationMax, optimisationMin, optimisationMoyenne, optimisationSomme } from "@/helpers/calculs.ts";
import { convertToDate } from "@/helpers/periode.ts";
import { rspcClient } from "@/helpers/rspc.ts";
import { useQuery } from "@tanstack/react-query";

interface OptimisationTabOptimisationProps {
    dataOpById: { id: number; xlsm_path: string };
}

export const OptimisationTabOptimisation = ({ dataOpById }: OptimisationTabOptimisationProps) => {
    const { isSuccess: isSuccessOptimisationPeriodes, data: dataOptimisationPeriodes } = useQuery({
        queryKey: ["optimisation_periodes", "get_by_optimisation_id", dataOpById?.id],
        queryFn: () => {
            return rspcClient.query([
                "optimisation_periodes.get_by_optimisation_id",
                { optimisation_id: dataOpById!.id },
            ]);
        },
        // enabled: isSuccessOptimisationData,
    });

    if (isSuccessOptimisationPeriodes) {
        return (
            <>
                <div className="grid grid-cols-2 gap-2">
                    <Table className={"grid-cols-1"}>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Période</TableHead>
                                <TableHead>Résultat</TableHead>
                                <TableHead>Drawdown</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dataOptimisationPeriodes?.map((periode, index) => (
                                <TableRow key={`op_${index}`}>
                                    <TableCell className={"p-1"}>
                                        {convertToDate(periode.periode).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className={"p-1"}>
                                        <PriceFormatted withColors={true} valeur={periode.profit} />
                                    </TableCell>
                                    <TableCell className={"p-1"}>
                                        <PercentFormatted valeur={periode.drawdown} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Table className={"grid-cols-1"}>
                        <TableHeader>
                            <TableRow>
                                <TableHead colSpan={2}>Statistiques</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Résultat total</TableCell>
                                <TableCell>
                                    <PriceFormatted
                                        withColors={true}
                                        valeur={optimisationSomme(dataOptimisationPeriodes?.map((p) => p.profit) || [])}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Résultat minimum</TableCell>
                                <TableCell>
                                    <PriceFormatted
                                        withColors={true}
                                        valeur={optimisationMin(dataOptimisationPeriodes!.map((p) => p.profit) || [])}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Résultat maximum</TableCell>
                                <TableCell>
                                    <PriceFormatted
                                        withColors={true}
                                        valeur={optimisationMax(dataOptimisationPeriodes!.map((p) => p.profit) || [])}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Résultat moyen</TableCell>
                                <TableCell>
                                    <PriceFormatted
                                        withColors={true}
                                        valeur={optimisationMoyenne(
                                            dataOptimisationPeriodes!.map((p) => p.profit) || [],
                                        )}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Drawdown maximum</TableCell>
                                <TableCell>
                                    <PercentFormatted
                                        valeur={optimisationMax(dataOptimisationPeriodes!.map((p) => p.drawdown) || [])}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Drawdown minimum</TableCell>
                                <TableCell>
                                    <PercentFormatted
                                        valeur={optimisationMin(dataOptimisationPeriodes!.map((p) => p.drawdown) || [])}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Drawdown moyen</TableCell>
                                <TableCell>
                                    <PercentFormatted
                                        valeur={optimisationMoyenne(
                                            dataOptimisationPeriodes!.map((p) => p.drawdown) || [],
                                        )}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </>
        );
    }

    return <div>Chargement...</div>;
};
