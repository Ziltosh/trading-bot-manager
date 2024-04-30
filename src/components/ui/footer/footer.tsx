import {Copyright} from "@/components/ui/footer/copyright.tsx";
import {Versions} from "@/components/ui/footer/versions.tsx";

export const Footer = () => {
    return (
        <div className="flex px-4 w-full h-full grid-cols-3 grid-rows-1 border-t justify-between text-muted-foreground">
            <Versions/>

            <Copyright/>
        </div>
    )
}