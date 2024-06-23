import useAppContext from "@/hooks/useAppContext";
import { Tours } from "@/types/tours";
import { HelpCircleIcon } from "lucide-react";

type HelpProps = {
    section: keyof Tours;
};

export const Help = ({ section }: HelpProps) => {
    const { setState } = useAppContext();

    return (
        <div>
            <div className="relative ml-2 mr-3 flex h-6 w-6 items-center justify-center">
                <div className="absolute h-6 w-6 animate-ping rounded-full border border-accent opacity-100"></div>
                {/* <div className="absolute h-6 w-6 animate-ping rounded-full border border-accent opacity-100 delay-300"></div> */}

                <HelpCircleIcon
                    className="relative h-6 w-6 cursor-pointer text-gray-500"
                    onClick={() => setState({ run: true, section })}
                />
            </div>
        </div>
    );
};
