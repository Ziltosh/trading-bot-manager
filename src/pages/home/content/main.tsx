import { Help } from "@/components/ui/custom/help";
import { H2 } from "@/components/ui/typos";

export const HomeContentMain = () => {
    // const [dbPath, setDbPath] = useState("");

    return (
        <div className={"tour-dashboard-page flex flex-col gap-2 overflow-y-scroll"}>
            <div className="flex items-center justify-between">
                <H2 className="flex-grow">Dashboard</H2>
                <Help section="dashboard" />
            </div>

            <div className="rounded-md bg-gray-100 p-2 text-black">
                TODO: Pouvoir avoir toujours le même Magic Number lors de la création d'un profil MT.
            </div>

            <div className="rounded-md bg-gray-100 p-2 text-black">
                TODO: Faire une aggrégation au mieux des différentes optimisations (dd/gains, etc...) sur chaque compte
                pour avoir une vue d'ensemble.
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
