import { Button } from "@/components/ui/button";
import { H2 } from "@/components/ui/typos";
import updates from "@/updates.json";
import { useQuery } from "@tanstack/react-query";
import { getVersion } from "@tauri-apps/api/app";

type PopupWhatsNewProps = {
    onClosePopup: () => void;
};

export const PopupWhatsNew = ({ onClosePopup }: PopupWhatsNewProps) => {
    const version = useQuery({
        queryKey: ["version"],
        queryFn: () => getVersion(),
    });

    return (
        <div
            className="absolute z-20 flex h-full w-full items-center overflow-y-scroll backdrop-blur-md transition-all"
            onClick={onClosePopup}
        >
            <div
                className="m-auto w-1/2 flex-col gap-2 rounded-lg border bg-background p-4 shadow-md"
                onClick={(e) => e.stopPropagation()}
            >
                <H2 className={"tour-comptes-add-popup"}>Quoi de neuf dans la version {version.data} ?</H2>

                <ul className="my-4 flex flex-col gap-2">
                    {version.data &&
                        typeof updates[version.data as keyof typeof updates] !== "undefined" &&
                        updates[version.data as keyof typeof updates].map((update) => (
                            <li className="ml-4 list-disc" key={update}>
                                {update}
                            </li>
                        ))}
                </ul>

                <div className="flex items-center justify-center gap-2">
                    <Button
                        type="button"
                        onClick={() => onClosePopup()}
                        className={"tour-comptes-add-create justify-center"}
                    >
                        Fermer
                    </Button>
                </div>
            </div>
        </div>
    );
};
