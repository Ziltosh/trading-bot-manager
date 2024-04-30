import {NavigationMenuLink, navigationMenuTriggerStyle} from "@/components/ui/navigation-menu.tsx";
import {Link, useLocation} from "react-router-dom";

type CustomLinkProps = {
    href: string
    children: React.ReactNode
    className?: string
}

export const CustomLink = ({href, children, className}: CustomLinkProps) => {
    const location = useLocation()
    const pathPartsLocation = location.pathname.split('/')
    const pathParts = href.split('/')
    const isActive = (href === location.pathname) || (pathParts.length === 2 && pathParts[1] === pathPartsLocation[1])
    const classes = navigationMenuTriggerStyle()


    return (
        <div className={"w-full flex flex-grow"}>
        <Link to={href}>
            <NavigationMenuLink className={classes + ' ' + className}
                                active={isActive}>{children}</NavigationMenuLink>
        </Link>
        </div>
    )
}