import "./assets/css/app.css";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable.tsx";
import { Header } from "@/components/ui/header/header.tsx";
import { Outlet } from "react-router-dom";
import { Footer } from "@/components/ui/footer/footer.tsx";
import { useSignal } from "@/hooks/useSignal.ts";
import {
    $compteAddPopup,
    $optimisationEditPopup,
    $optimisationPopup,
    $portfolioAddPopup,
    $robotAddPopup,
} from "@/signals/components/ui/popups.ts";
import { PopupPortfolioAdd } from "@/components/ui/popup/portfolio-add.tsx";
import { PopupRobotAdd } from "@/components/ui/popup/robot-add.tsx";
import { PopupOptimisationAdd } from "@/components/ui/popup/optimisation-add.tsx";
import { PopupCompteAdd } from "@/components/ui/popup/compte-add.tsx";
import { PopupOptimisationEdit } from "@/components/ui/popup/optimisation-edit.tsx";

function App() {
    const portfolioAddPopup = useSignal($portfolioAddPopup);
    const robotAddPopup = useSignal($robotAddPopup);
    const compteAddPopup = useSignal($compteAddPopup);
    const optimisationAddPopup = useSignal($optimisationPopup);
    const optimisationEditPopup = useSignal($optimisationEditPopup);

    return (
        <>
            {portfolioAddPopup && (
                <PopupPortfolioAdd
                    onClosePopup={() => {
                        $portfolioAddPopup.set(false);
                    }}
                />
            )}

            {robotAddPopup && (
                <PopupRobotAdd
                    onClosePopup={() => {
                        $robotAddPopup.set(false);
                    }}
                />
            )}

            {compteAddPopup && (
                <PopupCompteAdd
                    onClosePopup={() => {
                        $compteAddPopup.set(false);
                    }}
                />
            )}

            {optimisationAddPopup && <PopupOptimisationAdd onClosePopup={() => $optimisationPopup.set(false)} />}

            {optimisationEditPopup && <PopupOptimisationEdit onClosePopup={() => $optimisationEditPopup.set(false)} />}

            <ResizablePanelGroup direction="vertical" className="max-w-full bg-background">
                <ResizablePanel defaultSize={8} minSize={8}>
                    <Header />
                </ResizablePanel>
                <ResizablePanel defaultSize={92}>
                    <ResizablePanelGroup direction={"horizontal"} className={"h-full"}>
                        <Outlet />
                    </ResizablePanelGroup>
                </ResizablePanel>
                <ResizablePanel defaultSize={4}>
                    <ResizablePanelGroup direction={"vertical"} className={"w-full"}>
                        <Footer />
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    );
}

export default App;
