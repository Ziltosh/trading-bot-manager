import {ThemeToggle} from "@/components/ui/header/theme-toggle.tsx";
import {DiscretToggle} from "@/components/ui/header/discret-toggle.tsx";
import {Menu} from "@/components/ui/header/menu.tsx";
import {TitleLogo} from "@/components/ui/header/title-logo.tsx";

export const Header = () => {
    return (
        <div className="flex w-full h-full grid-cols-3 grid-rows-1  border-b">
            <div className="flex-grow flex items-center h-full ml-2">
                <TitleLogo/>
            </div>
            <div className="flex-grow flex items-center h-full">
                <Menu/>
            </div>
            <div className="px-3 flex justify-center items-center h-full gap-2">
                <DiscretToggle key="discret-toggle"/>
                <ThemeToggle key="theme-toggle"/>
            </div>
        </div>
    )
}