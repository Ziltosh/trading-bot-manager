import { useGlobalStore } from "@/stores/global-store.ts";

export const RobotContentMain = () => {
    const { setCurrentRobot } = useGlobalStore();

    setCurrentRobot(undefined);

    return (
        <>
            <h1>Robot Content Main</h1>
        </>
    );
};
