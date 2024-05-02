import { useEffect } from "react";

export const HomeContentMain = () => {
    // const [dbPath, setDbPath] = useState("");

    useEffect(() => {
        // invoke<{ path: string; exists: boolean }>("get_db_path").then((response) => {
        //     // setDbPath(response.path as string);
        // });
    }, []);

    return (
        <div className={"flex flex-col gap-2 overflow-y-scroll"}>
            {/*<p>{dbPath}</p>*/}

            <div className="rounded-md bg-gray-100 p-2 text-black">
                TODO: Faire une checklist a valider au lancement d'un robot.
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
        </div>
    );
};
