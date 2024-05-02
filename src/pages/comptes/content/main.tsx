import { H2 } from "@/components/ui/typos.tsx";
import { Button } from "@/components/ui/button.tsx";
import { $compteAddPopup } from "@/signals/components/ui/popups.ts";
import { CompteContentDemo } from "@/pages/comptes/content/comptes/demo.tsx";
import { CompteContentReel } from "@/pages/comptes/content/comptes/reel.tsx";
import { CompteContentProp } from "@/pages/comptes/content/comptes/prop.tsx";

export const CompteContentMain = () => {
    const handleClickAjouterCompte = () => {
        $compteAddPopup.set(true);
    };

    return (
        <div className={"flex flex-col gap-2 overflow-y-scroll"}>
            <div className="rounded-md bg-gray-100 p-2 text-black">TODO: Editer les comptes.</div>

            <H2>Comptes réel</H2>
            <CompteContentReel />

            <H2>Comptes prop firm</H2>
            <CompteContentProp />

            <H2>Comptes démo</H2>
            <CompteContentDemo />

            <Button className={"self-center"} onClick={handleClickAjouterCompte}>
                Ajouter un compte
            </Button>
        </div>
    );
};
