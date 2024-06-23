import { Button } from "@/components/ui/button.tsx";
import { Help } from "@/components/ui/custom/help";
import { H2, H3 } from "@/components/ui/typos.tsx";
import { CompteContentDemo } from "@/pages/comptes/content/comptes/demo.tsx";
import { CompteContentProp } from "@/pages/comptes/content/comptes/prop.tsx";
import { CompteContentReel } from "@/pages/comptes/content/comptes/reel.tsx";
import { $compteAddPopup } from "@/signals/components/ui/popups.ts";

export const CompteContentMain = () => {
    const handleClickAjouterCompte = () => {
        $compteAddPopup.set(true);
    };

    return (
        <div className={"tour-comptes flex flex-col gap-2 overflow-y-scroll"}>
            <div className="flex items-center justify-between">
                <H2 className="flex-grow">Les comptes</H2>
                <Help section="comptes" />
            </div>

            <H3>Comptes réel</H3>
            <CompteContentReel />

            <H3>Comptes prop firm</H3>
            <CompteContentProp />

            <H3>Comptes démo</H3>
            <CompteContentDemo />

            <Button className={"tour-comptes-add self-center"} onClick={handleClickAjouterCompte}>
                Ajouter un compte
            </Button>
        </div>
    );
};
