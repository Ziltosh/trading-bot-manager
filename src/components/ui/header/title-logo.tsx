import { H1 } from "@/components/ui/typos.tsx";
import { useNavigate } from "react-router-dom";

export const TitleLogo = () => {
    const navigate = useNavigate();

    return (
        <span className={"cursor-pointer"} onClick={() => navigate("/")}>
            <H1>TBM</H1>
        </span>
    );
};
