import { ThemeToggle } from "@/components/ui/header/theme-toggle.tsx";
import { DiscretToggle } from "@/components/ui/header/discret-toggle.tsx";
import { Menu } from "@/components/ui/header/menu.tsx";
import { TitleLogo } from "@/components/ui/header/title-logo.tsx";
import { Settings } from "@/components/ui/header/settings.tsx";

export const Header = () => {
    return (
        <div className="flex h-full w-full grid-cols-3 grid-rows-1  border-b">
            <div className="ml-2 flex h-full flex-grow items-center">
                <TitleLogo />
            </div>
            <div className="flex h-full flex-grow items-center">
                <Menu />
            </div>
            <div className="flex h-full items-center justify-center gap-2 px-3">
                <DiscretToggle key="discret-toggle" />
                <ThemeToggle key="theme-toggle" />
                <Settings key="settings" />
            </div>
        </div>
    );
};
