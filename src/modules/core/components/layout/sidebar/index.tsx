import { useLocation } from "react-router-dom";

// Hooks
import { useSidebarState } from "./hooks/useSidebarState";

// Components
import SidebarToggle from "./components/SidebarToggle";
import SidebarItem from "./components/SidebarItem";
import SidebarSubItem from "./components/SidebarSubItem";
import SidebarBottomItem from "./components/SidebarBottomItem";


import { MenuItem, SidebarProps, User } from "./types";

import { ReactComponent as StatsIcon } from "../../../../../assets/icons/StatsIcon.svg";
import { ReactComponent as PlantIcon } from "../../../../../assets/icons/PlantIcon.svg";
import { ReactComponent as FaqIcon } from "../../../../../assets/icons/FaqIcon.svg";
import { ReactComponent as UserIcon } from "../../../../../assets/icons/UserIcon.svg";
import { ReactComponent as UserGeneralIcon } from "../../../../../assets/icons/UserGeneralIcon.svg";
import { ReactComponent as UserAdminIcon } from "../../../../../assets/icons/UserAdminIcon.svg";
import { ReactComponent as LogoutIcon } from "../../../../../assets/icons/LogoutIcon.svg";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { useNavigate } from "react-router-dom";

// Constants
const SIDEBAR_WIDTH_OPEN = "w-64";
const SIDEBAR_WIDTH_CLOSED = "w-16";

const SubIcon = () => (
    <div className="w-5 h-5 rounded bg-green-500/30" />
);

const mockUser: User = {
    name: "Deisy López",
    avatarUrl: "",
};

const Sidebar = ({ user = mockUser }: SidebarProps) => {
    const { open, getSubmenuState, toggleSidebar, toggleSubmenu } = useSidebarState();
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;

    const userType = localStorage.getItem("type");

    const handleLogout = () => {
        localStorage.removeItem("type");
        localStorage.removeItem("token");
        navigate("/login");
    };

    const menuItems: MenuItem[] = [
        {
            id: "plants",
            icon: <PlantIcon className="w-6 h-6" />,
            label: "Catálogo de plantas",
            route: "/catalogo-plantas",
        },
        {
            id: "stats",
            icon: <StatsIcon className="w-6 h-6" />,
            label: "Estadísticas",
        },
        {
            id: "users",
            icon: <UserIcon className="w-6 h-6" />,
            label: "Gestión de usuarios",
            subItems: [
                { id: "user-general", label: "General", icon: <UserGeneralIcon className="w-5 h-5" /> },
                ...(userType === "superadmin"
                    ? [
                        {
                            id: "user-admin",
                            label: "Administrador",
                            icon: <UserAdminIcon className="w-5 h-5" />,
                            route: "/users/admin",
                        },
                    ]
                    : []),
            ],
        },
        {
            id: "faq",
            icon: <FaqIcon className="w-6 h-6" />,
            label: "FAQ",
            subItems: [
                { id: "user-reports", label: "Reportes de usuario", icon: <SubIcon /> },
                { id: "plant-reports", label: "Reportes de personal", icon: <SubIcon /> },
                { id: "resolved-reports", label: "Reportes atendidos", icon: <SubIcon /> },
                { id: "faq-program", label: "Programación de FAQ", icon: <SubIcon /> },
            ],
        },
    ];

    const bottomItems: MenuItem[] = [
        {
            id: "profile",
            icon: (
                <Avatar className="w-6 h-6">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>
                        {user.name
                            ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
                            : "US"}
                    </AvatarFallback>
                </Avatar>
            ),
            label: "Perfil",
            route: "/perfil",
        },
        {
            id: "logout",
            icon: <LogoutIcon className="w-6 h-6" />,
            label: "Cerrar sesión",
            onClick: handleLogout,
        },
    ];

    const isSubActive = (subItems: any[]) =>
        subItems?.some(sub => sub.route && pathname.startsWith(sub.route));

    return (
        <nav
            className={`flex flex-col h-screen 
      ${open ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED}
      bg-green-600 transition-all duration-300`}
        >
            <SidebarToggle onClick={toggleSidebar} />

            <div className="flex-1 overflow-y-auto">
                <ul className="flex flex-col gap-2 mt-2 pb-4">
                    {menuItems.map((item) => {
                        if (item.subItems) {
                            if (!item.subItems.length) return null;
                            const isSubmenuOpen = getSubmenuState(item.id);
                            const subActive = isSubActive(item.subItems);

                            return (
                                <li key={item.id}>
                                    <SidebarItem
                                        item={item}
                                        isOpen={open}
                                        isSubmenuOpen={isSubmenuOpen}
                                        toggleSubmenu={toggleSubmenu}
                                        hasSubItems={true}
                                        subActive={subActive}
                                    />
                                    {open && isSubmenuOpen && (
                                        <ul className="ml-8 mt-1 flex flex-col gap-1">
                                            {item.subItems.map((subItem) => (
                                                <li key={subItem.id}>
                                                    <SidebarSubItem subItem={subItem} />
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        }
                        return (
                            <li key={item.id}>
                                <SidebarItem item={item} isOpen={open} />
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="flex flex-col gap-2 p-3 border-t border-green-500/40">
                {bottomItems.map(item => (
                    <SidebarBottomItem key={item.id} item={item} isOpen={open} />
                ))}
            </div>
        </nav>
    );
};

export default Sidebar;