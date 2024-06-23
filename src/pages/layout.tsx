import React from "react";
import {ResizableHandle, ResizablePanel} from "@/components/ui/resizable.tsx";
import {LayoutSizes} from "@/pages/layout-sizes.ts";

type LayoutProps = {
    sidebar: React.ReactNode;
    content: React.ReactNode;
}

export const Layout = ({sidebar, content}: LayoutProps) => {

    return (
        <>
            <ResizablePanel defaultSize={LayoutSizes.sidebar.min} minSize={LayoutSizes.sidebar.min}
                            maxSize={LayoutSizes.sidebar.max} style={{
                overflowX: "hidden",
                overflowY: "scroll"
            }}>
                <div className="p-2">
                    {sidebar}
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle/>
            <ResizablePanel defaultSize={LayoutSizes.content.min} minSize={LayoutSizes.content.min}
                            maxSize={LayoutSizes.content.max} style={{
                overflowX: "hidden",
                overflowY: "scroll"
            }}>
                <div>
                    {content}
                </div>
            </ResizablePanel>
        </>
    )
}