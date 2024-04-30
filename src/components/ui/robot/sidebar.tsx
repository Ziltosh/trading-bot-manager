import { Procedures } from "@/rspc_bindings.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { inferProcedureResult } from "@rspc/client";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "@/stores/global-store.ts";

interface RobotSidebarProps {
    robot: inferProcedureResult<Procedures, "queries", "robots.all">[0];
}

export const RobotSidebar = ({ robot }: RobotSidebarProps) => {
    const navigate = useNavigate();
    const { currentRobot, setCurrentRobot } = useGlobalStore();

    const handleClick = () => {
        setCurrentRobot(robot);
        navigate("/robots/" + robot.id);
    };

    return (
        <div
            onClick={handleClick}
            className={`flex flex-col gap-2 rounded-lg border p-2 text-center ${currentRobot?.id === robot.id && "bg-secondary"} cursor-pointer hover:bg-accent hover:text-primary-foreground`}
        >
            <p className={"font-medium"}>{robot.name}</p>
            <div className="flex gap-1 overflow-x-hidden">
                {robot.tags.map((tag) => {
                    return (
                        <Badge key={tag.tagId} variant={"secondary"}>
                            {tag.tag.name}
                        </Badge>
                    );
                })}
            </div>
        </div>
    );
};
