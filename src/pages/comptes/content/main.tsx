import { H2 } from "@/components/ui/typos.tsx";
import { Button } from "@/components/ui/button.tsx";
import { $compteAddPopup } from "@/signals/components/ui/popups.ts";
import { CompteContentDemo } from "@/pages/comptes/content/comptes/demo.tsx";
import { CompteContentReel } from "@/pages/comptes/content/comptes/reel.tsx";
import { CompteContentProp } from "@/pages/comptes/content/comptes/prop.tsx";
import useAppContext from "@/hooks/useAppContext.ts";
import { useMount } from "react-use";
import { TourSteps } from "@/WelcomeTourSteps.ts";

export const CompteContentMain = () => {
    /** TOUR **/
    const {
        setState,
        state: { tourActive },
    } = useAppContext();

    useMount(() => {
        if (tourActive) {
            setTimeout(() => {
                setState({ run: true, stepIndex: TourSteps.TOUR_COMPTE });
            }, 100);
        }
    });
    /** END TOUR **/

    const handleClickAjouterCompte = () => {
        $compteAddPopup.set(true);
    };

    return (
        <div className={"tour-comptes flex flex-col gap-2 overflow-y-scroll"}>
            <div className="rounded-md bg-gray-100 p-2 text-black">TODO: Editer les comptes.</div>

            <H2>Comptes réel</H2>
            <CompteContentReel />

            <H2>Comptes prop firm</H2>
            <CompteContentProp />

            <H2>Comptes démo</H2>
            <CompteContentDemo />

            <Button className={"tour-comptes-add self-center"} onClick={handleClickAjouterCompte}>
                Ajouter un compte
            </Button>
        </div>
    );
};
