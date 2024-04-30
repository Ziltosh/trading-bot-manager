import {RobotContentMain} from "@/pages/robots/content/main.tsx";
import {Outlet, useLocation} from "react-router-dom";

export const RobotsContent = () => {
    // const portfolioAddPopup = useSignal($portfolioAddPopup)
    const location = useLocation()

    return (
        <div className="h-full w-full p-2 flex flex-col relative">
            {location.pathname === '/robots' ? <RobotContentMain/> : <Outlet/>}
        </div>
    )
}