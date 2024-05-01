import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";

export const HomeContentMain = () => {
    const [dbPath, setDbPath] = useState("");

    useEffect(() => {
        invoke("get_db_path").then((response) => {
            alert(response.path);
            alert(response.exists);
            setDbPath(response.path as string);
        });
    }, []);

    return (
        <div className={"flex flex-col gap-2 overflow-y-scroll"}>
            <p>{dbPath}</p>

            <div className="rounded-md bg-gray-100 p-2">
                TODO: Associer des optimisations a des comptes et avoir un dashboard de ce qui tourne sur chaque compte.
            </div>

            <div className="rounded-md bg-gray-100 p-2">
                TODO: Faire une aggrégation au mieux des différentes optimisations (dd/gains, etc...) sur chaque compte
                pour avoir une vue d'ensemble.
            </div>

            <div className="rounded-md bg-gray-100 p-2">
                TODO: Intégrer l'API myfxbook pour avoir les stats générales de chaque compte.
            </div>

            <div className="rounded-md bg-gray-100 p-2">TODO: Voir la diversification des comptes/paires.</div>
        </div>
    );
};
