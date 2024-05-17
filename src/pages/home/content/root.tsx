import { H2, H4 } from "@/components/ui/typos.tsx";
import { Button } from "@/components/ui/button.tsx";
import useAppContext from "@/hooks/useAppContext.ts";
import { useMount } from "react-use";

export const HomeContentRoot = () => {
    const {
        setState,
        state: { run, tourActive },
    } = useAppContext();

    useMount(() => {
        if (tourActive) {
            setTimeout(() => {
                setState({ run: true, stepIndex: 0 });
            }, 200);
        }
    });

    return (
        <>
            {!run && (
                <Button className={"my-3"} onClick={() => setState({ run: true, tourActive: true })}>
                    Voir la visite guidée
                </Button>
            )}

            <H2 className={"tour-accueil"}>Bienvenue</H2>
            <H4>Étape 1: Ajoutez vos robots</H4>
            <H4>Étape 2: Ajoutez vos comptes</H4>
            <H4>Étape 3: Ajoutez vos optimisations</H4>
        </>
    );
};
