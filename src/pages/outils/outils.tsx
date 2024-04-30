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
import { Layout } from "@/pages/layout.tsx";
import { OutilsSidebar } from "@/pages/outils/sidebar.tsx";
import { OutilsContent } from "@/pages/outils/content.tsx";

export const OutilsPage = () => {
    return (
        /**
         * The `Layout` component is used here with `HomeSidebar` and `HomeContent` passed as props.
         * `HomeSidebar` will be displayed in the sidebar area of the layout.
         * `HomeContent` will be displayed in the content area of the layout.
         */
        <>
            <Layout sidebar={<OutilsSidebar />} content={<OutilsContent />} />
        </>
    );
};
