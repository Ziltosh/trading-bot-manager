import { Footer } from "@/components/ui/footer/footer.tsx";
import { Header } from "@/components/ui/header/header.tsx";
import { PopupCompteAdd } from "@/components/ui/popup/compte-add.tsx";
import { PopupCompteEdit } from "@/components/ui/popup/compte-edit";
import { PopupOptimisationAdd } from "@/components/ui/popup/optimisation-add.tsx";
import { PopupOptimisationEdit } from "@/components/ui/popup/optimisation-edit.tsx";
import { PopupPortfolioAdd } from "@/components/ui/popup/portfolio-add.tsx";
import { PopupProfilCreation } from "@/components/ui/popup/profil-creation";
import { PopupRobotAdd } from "@/components/ui/popup/robot-add.tsx";
import { PopupRobotEdit } from "@/components/ui/popup/robot-edit";
import { PopupSettings } from "@/components/ui/popup/settings.tsx";
import { PopupWhatsNew } from "@/components/ui/popup/whats-new";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable.tsx";
import { useSignal } from "@/hooks/useSignal.ts";
import { queries } from "@/queries/queries";
import {
    $compteAddPopup,
    $compteEditPopup,
    $optimisationAddPopup,
    $optimisationEditPopup,
    $portfolioAddPopup,
    $profilCreationPopup,
    $robotAddPopup,
    $robotEditPopup,
    $settingsPopup,
    $whatsNewPopup,
} from "@/signals/components/ui/popups.ts";
import { ComptesTour } from "@/tours/ComptesTour";
import { DashboardTour } from "@/tours/DashboardTour";
import { OptimisationsTour } from "@/tours/OptimisationsTour";
import { OptimisationViewTour } from "@/tours/OptimisationViewTour";
import { RobotsTour } from "@/tours/RobotsTour";
import { RootTour } from "@/tours/RootTour";
import { ToursProvider } from "@/ToursProvider";
import { useQuery } from "@tanstack/react-query";
import { getVersion } from "@tauri-apps/api/app";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import "./assets/css/app.css";

function App() {
    const portfolioAddPopup = useSignal($portfolioAddPopup);
    const robotAddPopup = useSignal($robotAddPopup);
    const robotEditPopup = useSignal($robotEditPopup);
    const compteAddPopup = useSignal($compteAddPopup);
    const compteEditPopup = useSignal($compteEditPopup);
    const optimisationAddPopup = useSignal($optimisationAddPopup);
    const optimisationEditPopup = useSignal($optimisationEditPopup);
    const profilCreationPopup = useSignal($profilCreationPopup);
    const settingsPopup = useSignal($settingsPopup);
    const whatsNewPopup = useSignal($whatsNewPopup);

    const version = useQuery({ queryKey: [queries.version], queryFn: getVersion });

    useEffect(() => {
        if (version.data && localStorage.getItem("version") !== version.data) {
            $whatsNewPopup.set(true);
            localStorage.setItem("version", version.data);
        }
    }, [version.data]);

    return (
        <>
            <ToursProvider>
                <RootTour />
                <RobotsTour />
                <ComptesTour />
                <OptimisationsTour />
                <OptimisationViewTour />
                <DashboardTour />

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

                {robotEditPopup && (
                    <PopupRobotEdit
                        onClosePopup={() => {
                            $robotEditPopup.set(false);
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

                {compteEditPopup && (
                    <PopupCompteEdit
                        onClosePopup={() => {
                            $compteEditPopup.set(false);
                        }}
                    />
                )}

                {settingsPopup && (
                    <PopupSettings
                        onClosePopup={() => {
                            $settingsPopup.set(false);
                        }}
                    />
                )}

                {profilCreationPopup && (
                    <PopupProfilCreation
                        onClosePopup={() => {
                            $profilCreationPopup.set(false);
                        }}
                    />
                )}

                {whatsNewPopup && <PopupWhatsNew onClosePopup={() => $whatsNewPopup.set(false)} />}

                {optimisationAddPopup && <PopupOptimisationAdd onClosePopup={() => $optimisationAddPopup.set(false)} />}

                {optimisationEditPopup && (
                    <PopupOptimisationEdit onClosePopup={() => $optimisationEditPopup.set(false)} />
                )}

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
            </ToursProvider>
        </>
    );
}

export default App;
