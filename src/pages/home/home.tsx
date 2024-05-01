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
import { HomeSidebar } from "@/pages/home/sidebar.tsx";
import { HomeContent } from "@/pages/home/content.tsx";
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api";

export const HomePage = () => {
    useEffect(() => {
        invoke("get_db_path").then((response) => {
            alert(response);
        });
    }, []);

    return (
        /**
         * The `Layout` component is used here with `HomeSidebar` and `HomeContent` passed as props.
         * `HomeSidebar` will be displayed in the sidebar area of the layout.
         * `HomeContent` will be displayed in the content area of the layout.
         */
        <>
            <Layout sidebar={<HomeSidebar />} content={<HomeContent />} />
        </>
    );
};
