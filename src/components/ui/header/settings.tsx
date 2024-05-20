import { Button } from "@/components/ui/button.tsx";
import { SettingsIcon } from "lucide-react";
import { $settingsPopup } from "@/signals/components/ui/popups.ts";

export const Settings = () => {
    const handleClick = () => {
        $settingsPopup.set(true);
    };

    return (
        <Button variant={"outline"} onClick={handleClick} size={"icon"}>
            <SettingsIcon className={"h-4 w-4"} />
        </Button>
    );
};
