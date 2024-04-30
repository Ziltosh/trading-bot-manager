import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu.tsx";
import { CustomLink } from "@/components/ui/custom-link.tsx";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";

export const Menu = () => {
    return (
        <TooltipProvider delayDuration={200}>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <CustomLink href={"/home"}>Dashboard</CustomLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <CustomLink href={"/robots"}>Robots</CustomLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <CustomLink href={"/comptes"}>Comptes</CustomLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <CustomLink href={"/optimisations"}>Optimisations</CustomLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <CustomLink href={"/outils"}>Outils</CustomLink>
                    </NavigationMenuItem>
                    {/*<NavigationMenuItem className={"text-muted-foreground"}>*/}
                    {/*    <Tooltip>*/}
                    {/*        <TooltipTrigger>*/}
                    {/*            <div className={navigationMenuTriggerStyle()}>*/}
                    {/*                Alertes<InfoIcon className={"h-4 w-4 ml-2"}/>*/}
                    {/*            </div>*/}
                    {/*        </TooltipTrigger>*/}
                    {/*        <TooltipContent>*/}
                    {/*            <p>Sera disponible dans la version 1.5</p>*/}
                    {/*        </TooltipContent>*/}
                    {/*    </Tooltip>*/}
                    {/*</NavigationMenuItem>*/}

                    {/*{import.meta.env.DEV && (*/}
                    {/*    <NavigationMenuItem>*/}
                    {/*        <CustomLink href={"/dev"}>*/}
                    {/*            Dev*/}
                    {/*        </CustomLink>*/}
                    {/*    </NavigationMenuItem>*/}
                    {/*)}*/}
                </NavigationMenuList>
            </NavigationMenu>
        </TooltipProvider>
    );
};
