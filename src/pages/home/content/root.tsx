import { Help } from "@/components/ui/custom/help";
import { H2, H4 } from "@/components/ui/typos.tsx";

export const HomeContentRoot = () => {
    // const {
    //     setState,
    //     state: { run, tourActive },
    // } = useAppContext();

    // useMount(() => {
    //     if (tourActive) {
    //         setTimeout(() => {
    //             setState({ run: true, stepIndex: 0 });
    //         }, 200);
    //     }
    // });

    return (
        <div className={"tour-accueil flex h-full flex-col gap-2"}>
            <div className="mr-3 flex items-center justify-between">
                <H2 className="flex-grow">Bienvenue</H2>
                <Help section="root" />
            </div>

            <H4>Étape 1: Ajoutez vos robots</H4>
            <H4>Étape 2: Ajoutez vos comptes</H4>
            <H4>Étape 3: Ajoutez vos optimisations</H4>
        </div>
    );
};
