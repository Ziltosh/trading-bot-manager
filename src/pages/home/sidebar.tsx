import { useQuery } from "@tanstack/react-query";
import { rspcClient } from "@/helpers/rspc.ts";
import { HomeCompteSidebar } from "@/components/ui/compte/home-sidebar.tsx";

export const HomeSidebar = () => {
    const { data, isSuccess } = useQuery({
        queryKey: ["comptes.all"],
        queryFn: async () => {
            const comptes = [];
            comptes.push(...(await rspcClient.query(["comptes.get_reel"])));
            comptes.push(...(await rspcClient.query(["comptes.get_prop"])));
            comptes.push(...(await rspcClient.query(["comptes.get_demo"])));
            return comptes;
        },
    });

    if (isSuccess) {
        return (
            <div className={"flex flex-col gap-2"}>
                {data?.map((compte) => {
                    return <HomeCompteSidebar compte={compte} key={compte.id} />;
                })}
            </div>
        );
    }
};
