import { Button } from "@/components/ui/button.tsx";
import { PercentFormatted } from "@/components/ui/custom/percent-formatted.tsx";
import { PriceFormatted } from "@/components/ui/custom/price-formatted.tsx";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table.tsx";
import { H2, H3 } from "@/components/ui/typos.tsx";
import { rspcClient } from "@/helpers/rspc.ts";
import useAppContext from "@/hooks/useAppContext";
import { fakeDashboardComptes, fakeDashboardLancementData, fakeDashboardOptimisationData, fakeDashboardOptimisations } from "@/lib/tours/dashboardTour";
import { Optimisation, Procedures, XlsmBasicData, XlsmLancementData, XlsmOptimisationData } from "@/rspc_bindings.ts";
import { $profilCreationPopup } from "@/signals/components/ui/popups";
import { inferProcedureResult } from "@rspc/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface AllOptiData {
    infos: Optimisation;
    basic?: XlsmBasicData;
    lancement: XlsmLancementData;
    opti: XlsmOptimisationData;
}

export const HomeContentDetails = () => {
    /** TOUR **/
    const {
        state: { run, section },
    } = useAppContext();

    /** END TOUR **/

    const { id } = useParams();
    const [allPeriodes, setAllPeriodes] = useState<{ periode: string; resultat: number; dd: number }[]>([]);
    const navigate = useNavigate();

    const { isSuccess: isSuccessCompteById, data: dataCompteById } = useQuery({
        queryKey: ["comptes.get_by_id", { id: parseInt(id!, 10) }],
        queryFn: () => {
            if (!run || section !== "dashboard")
                return rspcClient.query(["comptes.get_by_id", { id: parseInt(id!, 10) }]);

            return new Promise<inferProcedureResult<Procedures, "queries", "comptes.get_by_id">>((resolve) => {
                resolve(fakeDashboardComptes[0]);
            });
        },
    });

    const { isSuccess: isSuccessOptiByCompte, data: dataOptiByCompte } = useQuery({
        queryKey: ["optimisations.get_by_compte_id", { id: parseInt(id!, 10) }],
        queryFn: () => {
            if (!run || section !== "dashboard")
                return rspcClient.query(["optimisations.get_by_compte_id", { compte_id: parseInt(id!, 10) }]);

            return new Promise<inferProcedureResult<Procedures, "queries", "optimisations.get_by_compte_id">>(
                (resolve) => {
                    resolve(fakeDashboardOptimisations);
                },
            );
        },
    });

    const { isSuccess: isSuccessOptiData } = useQuery({
        queryKey: ["all_opti_data", id],
        queryFn: async () => {
            const allOptiData: AllOptiData[] = [];
            const periodes: { periode: string; resultat: number; dd: number }[] = [];
            for (const opti of dataOptiByCompte!) {
                // const basic = await rspcClient.query(["optimisations.get_xlsm_basic_data", { path: opti.xlsm_path }]);
                let lancement;
                if (!run || section !== "dashboard") {
                    lancement = await rspcClient.query([
                        "optimisations.get_xlsm_lancement_data",
                        { path: opti.xlsm_path },
                    ]);
                } else {
                    lancement = fakeDashboardLancementData;
                }

                let optiData;
                if (!run || section !== "dashboard") {
                    optiData = await rspcClient.query([
                        "optimisations.get_xlsm_optimisation_data",
                        {
                            path: opti.xlsm_path,
                            nb_periodes: lancement.nb_periodes,
                        },
                    ]);
                } else {
                    optiData = fakeDashboardOptimisationData;
                }

                // allOptiData.push({ lancement, infos: opti, opti: optiData });
                let index = 0;
                for (const periode of optiData.periodes) {
                    if (opti.decalage_ct_unit !== "mois") continue;
                    // check si existe déjà
                    const indexExists = periodes.findIndex((p) => p.periode === periode);
                    if (indexExists !== -1) {
                        periodes[indexExists].resultat += parseFloat(optiData.resultats.at(index)!);
                        periodes[indexExists].dd += parseFloat(optiData.drawdowns.at(index)!);
                        index++;
                        continue;
                    }
                    periodes.push({
                        periode: periode,
                        resultat: parseFloat(optiData.resultats.at(index)!),
                        dd: parseFloat(optiData.drawdowns.at(index)!),
                    });
                    index++;
                }
            }
            setAllPeriodes(periodes);

            return allOptiData;
        },
        enabled: isSuccessOptiByCompte,
    });

    // useEffect(() => {
    //     console.log(dataOptiByCompte);
    // }, [dataOptiByCompte]);

    if (!isSuccessCompteById) {
        return null;
    }

    const handleViewOptimisation = (optimisationId: number) => {
        navigate(`/optimisations/${optimisationId}`);
    };

    return (
        <div className={"flex flex-col gap-2 overflow-y-scroll"}>
            <H2>{dataCompteById?.name}</H2>

            <H3>Récapitulatif</H3>
            <p>Les optimisations en mode "jours" ne sont pour le moment pas prise en charge.</p>
            <p>
                Pour une vision plus juste, des optimisations avec le même décalage court terme et la même date de
                départ sont conseillés.
            </p>
            <p>
                Le drawdown indiqué en seconde ligne est a prendre comme indication, en effet il s'agit du cumul max des
                drawdowns de chaque période mais il peut très bien ne pas arriver au même moment pour chaque robot.
                Globalement, si il ne dépasse pas 100, le compte n'aurait très probabement pas cramé.
            </p>
            {isSuccessOptiData && (
                <Table className="tour-dashboard-recapitulatif">
                    <TableBody>
                        <TableRow>
                            {allPeriodes.map((periode, index) => {
                                return (
                                    <TableCell key={`row-date-${index}`}>
                                        {new Date(Date.parse(periode.periode)).toLocaleDateString()}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                        <TableRow>
                            {allPeriodes.map((periode, index) => {
                                return (
                                    <TableCell key={`row-prix-${index}`}>
                                        <PriceFormatted valeur={periode.resultat} withColors={true} />
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                        <TableRow>
                            {allPeriodes.map((periode, index) => {
                                return (
                                    <TableCell key={`row-percent-${index}`}>
                                        <PercentFormatted valeur={periode.dd} />
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableBody>
                </Table>
            )}

            <Button className="tour-dashboard-profil" onClick={() => $profilCreationPopup.set(true)}>
                Générer le profil Metatrader 4
            </Button>

            <div className="tour-dashboard-robots">
                <H3>Liste des robots sur le compte</H3>

                {isSuccessOptiByCompte &&
                    dataOptiByCompte?.map((opti, index) => (
                        <Table key={`opti-${index}`}>
                            <TableBody>
                                <TableRow
                                    className={"cursor-pointer hover:bg-accent"}
                                    onClick={() => handleViewOptimisation(opti.id)}
                                >
                                    <TableCell className={"w-1/3 p-1"}>{opti.name}</TableCell>
                                    <TableCell className={"w-1/3 p-1 text-center"}>{opti.paire}</TableCell>
                                    <TableCell className={"w-1/3 p-1 text-center"}>{opti.timeframe}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    ))}
            </div>
        </div>
    );
};
