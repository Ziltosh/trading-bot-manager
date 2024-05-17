/**
 * `HomePage` is a functional component that renders the home page of the application.
 * It uses the `Layout` component and passes `HomeSidebar` and `HomeContent` as props to it.
 *
 * @component
 * @example
 * return (
 *   <HomePage />
 * )
 */
import { Outlet, useLocation } from "react-router-dom";
import { RobotContentMain } from "@/pages/robots/content/main.tsx";

export const RobotsPage = () => {
    const location = useLocation();

    return (
        <div className="relative flex h-full w-full flex-col p-2">
            {location.pathname === "/robots" ? <RobotContentMain /> : <Outlet />}
        </div>
    );
};
