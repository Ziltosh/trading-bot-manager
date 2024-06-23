import { useQuery } from "@tanstack/react-query";
import { rspcClient } from "@/helpers/rspc.ts";
import { HomeCompteSidebar } from "@/components/ui/compte/home-sidebar.tsx";
import useAppContext from "@/hooks/useAppContext";
import { fakeDashboardComptes } from "@/lib/tours/dashboardTour";
import { inferProcedureResult } from "@rspc/client";
import { Procedures } from "@/rspc_bindings";

export const HomeSidebar = () => {
    /** TOUR **/
    const {
        state: { run, section },
    } = useAppContext();

    /** END TOUR **/

    const { data, isSuccess } = useQuery({
        queryKey: ["comptes", "all"],
        queryFn: async () => {
            if (!run || section !== "dashboard") {
                const comptes = [];
                comptes.push(...(await rspcClient.query(["comptes.get_reel"])));
                comptes.push(...(await rspcClient.query(["comptes.get_prop"])));
                comptes.push(...(await rspcClient.query(["comptes.get_demo"])));
                return comptes;
            }

            return new Promise<inferProcedureResult<Procedures, "queries", "comptes.get_reel">>((resolve) => {
                resolve(fakeDashboardComptes);
            });
        },
    });

    if (isSuccess) {
        return (
            <div className={"tour-dashboard-sidebar flex flex-col gap-2"}>
                {data?.map((compte) => {
                    return <HomeCompteSidebar compte={compte} key={compte.id} />;
                })}
            </div>
        );
    }
};
