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
import {Layout} from "@/pages/layout.tsx";
import {RobotsSidebar} from "@/pages/robots/sidebar.tsx";
import {RobotsContent} from "@/pages/robots/content.tsx";

export const RobotsPage = () => {
    return (
        /**
         * The `Layout` component is used here with `HomeSidebar` and `HomeContent` passed as props.
         * `HomeSidebar` will be displayed in the sidebar area of the layout.
         * `HomeContent` will be displayed in the content area of the layout.
         */
        <>
            <Layout sidebar={<RobotsSidebar/>} content={<RobotsContent/>}/>
        </>
    )
}