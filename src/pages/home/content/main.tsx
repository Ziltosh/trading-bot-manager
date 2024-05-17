import { useEffect } from "react";
import { useMount } from "react-use";
import useAppContext from "@/hooks/useAppContext.ts";

export const HomeContentMain = () => {
    // const [dbPath, setDbPath] = useState("");

    /** TOUR **/
    const {
        setState,
        state: { tourActive },
    } = useAppContext();

    useMount(() => {
        if (tourActive) {
            setTimeout(() => {
                setState({ run: true, stepIndex: 4 });
            }, 200);
        }
    });
    /** END TOUR **/

    useEffect(() => {
        // invoke<{ path: string; exists: boolean }>("get_db_path").then((response) => {
        //     // setDbPath(response.path as string);
        // });
    }, []);

    return (
        <div className={"tour-home flex flex-col gap-2 overflow-y-scroll"}>
            {/*<p>{dbPath}</p>*/}

            <div className="flex flex-col gap-2 rounded-md bg-gray-100 p-2 text-black">
                TODO: Faire une checklist a valider au lancement d'un robot.
                <ul>
                    <li>✔ Mettre la bonne unité de temps</li>
                    <li>✔ Préparer le .set du passage voulu</li>
                    <li>✔ Charger le bon robot</li>
                    <li>✔ Changer le Magic Number</li>
                    <li>✔ Mettre le non trading dd si besoin</li>
                </ul>
            </div>

            <div className="rounded-md bg-gray-100 p-2 text-black">
                TODO: Faire une aggrégation au mieux des différentes optimisations (dd/gains, etc...) sur chaque compte
                pour avoir une vue d'ensemble.
            </div>

            <div className="rounded-md bg-gray-100 p-2 text-black">
                TODO: Intégrer l'API myfxbook pour avoir les stats générales de chaque compte.
            </div>

            <div className="rounded-md bg-gray-100 p-2 text-black">
                TODO: Intégrer l'API myfxbook pour avoir les stats générales de chaque compte.
            </div>

            <div className="rounded-md bg-gray-100 p-2 text-black">
                TODO: Voir la diversification des comptes/paires.
            </div>

            <div className="rounded-md bg-gray-100 p-2 text-black">
                TODO: Intégrer les règles des différentes props firms HFT.
            </div>
        </div>
    );
};
