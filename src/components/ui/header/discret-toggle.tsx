import { Button } from "@/components/ui/button.tsx";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { $discret } from "@/signals/components/ui/discret.ts";

export const DiscretToggle = () => {
    const [isDiscret, setIsDiscret] = useState(localStorage.getItem("discret") === "true");

    const handleClick = () => {
        setIsDiscret(!isDiscret);
        localStorage.setItem("discret", JSON.stringify(!isDiscret));
        $discret.set(!isDiscret);
    };

    return (
        <Button variant={"destructive"} onClick={handleClick} size={"icon"}>
            {isDiscret && <EyeOff className={"h-4 w-4"} />}
            {!isDiscret && <Eye className={"h-4 w-4"} />}
        </Button>
    );
};
