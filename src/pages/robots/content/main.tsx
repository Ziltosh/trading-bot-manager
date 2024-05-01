import { useGlobalStore } from "@/stores/global-store.ts";

export const RobotContentMain = () => {
    const { setCurrentRobot } = useGlobalStore();

    setCurrentRobot(undefined);

    return (
        <>
            <div className="rounded-md bg-gray-100 p-2">TODO: Pouvoir supprimer un robot.</div>
        </>
    );
};
