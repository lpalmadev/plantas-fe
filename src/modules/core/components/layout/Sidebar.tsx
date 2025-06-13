import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as MenuIcon } from "../../../../assets/icons/MenuIcon.svg";
import { ReactComponent as StatsIcon } from "../../../../assets/icons/StatsIcon.svg";
import { ReactComponent as PlantIcon } from "../../../../assets/icons/PlantIcon.svg";
import { ReactComponent as FaqIcon } from "../../../../assets/icons/FaqIcon.svg";
import { ReactComponent as UserIcon } from "../../../../assets/icons/UserIcon.svg";
import { ReactComponent as UserGeneralIcon } from "../../../../assets/icons/UserGeneralIcon.svg";
import { ReactComponent as UserAdminIcon } from "../../../../assets/icons/UserAdminIcon.svg";
import { ReactComponent as LogoutIcon } from "../../../../assets/icons/LogoutIcon.svg";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const SubIcon = () => (
    <div className="w-5 h-5 rounded bg-green-500/30" />
);

const SIDEBAR_WIDTH_OPEN = "w-64";
const SIDEBAR_WIDTH_CLOSED = "w-16";

const mockUser = {
    name: "Deisy López",
    avatarUrl: "",
};

const Sidebar = ({ user = mockUser }) => {
    const [open, setOpen] = useState(true);
    const [faqOpen, setFaqOpen] = useState(false);
    const [usersOpen, setUsersOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const userType = localStorage.getItem("type");

    const menuItems = [
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
                // SOLO mostrar si es superadmin:
                ...(userType === "superadmin"
                    ? [{ id: "user-admin", label: "Administrador", icon: <UserAdminIcon className="w-5 h-5" />, route: "/users/admin" }]
                    : [])
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

    const bottomItems = [
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
            onClick: () => {},
        },
    ];

    const pathname = location.pathname;

    const isSubActive = (subItems) => subItems?.some(sub => sub.route && pathname.startsWith(sub.route));

    return (
        <nav
            className={`flex flex-col h-screen 
        ${open ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED}
        bg-green-600 transition-all duration-300`}
        >
            <button
                className="flex items-center justify-center h-20"
                onClick={() => setOpen(!open)}
            >
                <MenuIcon className="w-6 h-6" />
            </button>

            <div className="flex-1 overflow-y-auto">
                <ul className="flex flex-col gap-2 mt-2 pb-4">
                    {menuItems.map((item) => {
                        if (item.subItems) {
                            // No mostrar el menú si no hay subItems
                            if (!item.subItems.length) return null;
                            const isOpen = item.id === "faq" ? faqOpen : usersOpen;
                            const setOpenFn = item.id === "faq" ? setFaqOpen : setUsersOpen;
                            const subActive = isSubActive(item.subItems);

                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => setOpenFn((prev) => !prev)}
                                        className={`
                                            flex items-center rounded-lg transition-colors
                                            ${open ? "pl-5 pr-3 py-3 gap-4 w-full" : "justify-center p-0 w-full h-14"}
                                            ${subActive ? "bg-green-700" : "hover:bg-green-500/70"}
                                        `}
                                    >
                                        <span className={`flex items-center justify-center text-white w-8 h-8`}>
                                            {item.icon}
                                        </span>
                                        {open && (
                                            <span className="text-white font-semibold text-base text-left flex-1 truncate">
                                                {item.label}
                                            </span>
                                        )}
                                        {open && (
                                            <svg
                                                className={`w-4 h-4 ml-auto transition-transform ${isOpen ? "rotate-90" : ""}`}
                                                fill="none"
                                                stroke="white"
                                                strokeWidth={2}
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M9 5l7 7-7 7" />
                                            </svg>
                                        )}
                                    </button>
                                    {open && isOpen && (
                                        <ul className="ml-8 mt-1 flex flex-col gap-1">
                                            {item.subItems.map((sub) => (
                                                <li key={sub.id}>
                                                    <button
                                                        onClick={() => {
                                                            if (sub.route) navigate(sub.route);
                                                        }}
                                                        className={`
                                                            flex items-center gap-2 w-full rounded-md px-2 py-2
                                                            ${pathname === sub.route ? "bg-green-700" : "hover:bg-green-500/70"}
                                                        `}
                                                    >
                                                        <span className="text-white">{sub.icon}</span>
                                                        <span className="text-white text-sm">{sub.label}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        }
                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => {
                                        if (item.route) navigate(item.route);
                                    }}
                                    className={`
                                        flex items-center rounded-lg transition-colors
                                        ${open ? "pl-5 pr-3 py-3 gap-4 w-full" : "justify-center p-0 w-full h-14"}
                                        ${pathname === item.route ? "bg-green-700" : "hover:bg-green-500/70"}
                                    `}
                                >
                                    <span className={`flex items-center justify-center text-white w-8 h-8`}>
                                        {item.icon}
                                    </span>
                                    {open && (
                                        <span className="text-white font-semibold text-base text-left flex-1 truncate">
                                            {item.label}
                                        </span>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="flex flex-col gap-2 p-3 border-t border-green-500/40">
                {bottomItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => {
                            if (item.route) navigate(item.route);
                            if (item.onClick) item.onClick();
                        }}
                        className={`
                            flex items-center rounded-lg transition-colors
                            ${open ? "pl-5 pr-3 py-3 gap-4 w-full" : "justify-center p-0 w-full h-14"}
                            ${pathname === item.route ? "bg-green-700" : "hover:bg-green-500/70"}
                        `}
                    >
                        <span className="flex items-center justify-center text-white w-8 h-8">
                            {item.icon}
                        </span>
                        {open && (
                            <span className="text-white font-semibold text-base text-left flex-1 truncate">
                                {item.label}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default Sidebar;