import { Button } from "@/components/ui/button.tsx";
import { PlusIcon } from "lucide-react";
import { $robotAddPopup } from "@/signals/components/ui/popups.ts";
import { useQuery } from "@tanstack/react-query";
import { rspcClient } from "@/helpers/rspc.ts";
import { RobotSidebar } from "@/components/ui/robot/sidebar.tsx";
// import {Procedures} from "@/rspc_bindings.ts";

export const RobotsSidebar = () => {
    const { data } = useQuery({
        queryKey: ["robots.all"],
        queryFn: () => {
            return rspcClient.query(["robots.all"]);
        },
    });

    const handleAdd = () => {
        $robotAddPopup.set(true);
    };

    return (
        <>
            <div className="flex flex-col gap-2">
                {data?.map((robot) => {
                    return <RobotSidebar key={`robot_${robot.id}`} robot={robot} />;
                })}

                <Button disabled={false} onClick={handleAdd} variant={"outline"} className={"w-full"}>
                    <PlusIcon className={`h-6 w-6`} />
                </Button>
            </div>
        </>
    );
};
