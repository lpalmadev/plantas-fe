import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as MenuIcon } from "../../../../assets/icons/MenuIcon.svg";
import { ReactComponent as PlantIcon } from "../../../../assets/icons/PlantIcon.svg";
import { ReactComponent as StatsIcon } from "../../../../assets/icons/StatsIcon.svg";
import { ReactComponent as FaqIcon } from "../../../../assets/icons/FaqIcon.svg";
import { ReactComponent as UserIcon } from "../../../../assets/icons/UserIcon.svg";
import { ReactComponent as UserGeneralIcon } from "../../../../assets/icons/UserGeneralIcon.svg";
import { ReactComponent as UserAdminIcon } from "../../../../assets/icons/UserAdminIcon.svg";
import { ReactComponent as ProfileIcon } from "../../../../assets/icons/ProfileIcon.svg";
import { ReactComponent as LogoutIcon } from "../../../../assets/icons/LogoutIcon.svg";

const SubIcon = () => (
    <div className="w-5 h-5 rounded bg-green-500/30" />
);

const Sidebar = () => {
    const [open, setOpen] = useState(false);
    const [faqOpen, setFaqOpen] = useState(false);
    const [usersOpen, setUsersOpen] = useState(false);
    const [active, setActive] = useState<string | null>("plants");
    const navigate = useNavigate();

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
                { id: "user-admin", label: "Administrador", icon: <UserAdminIcon className="w-5 h-5" />, route: "/users/admin" },
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
        {
            id: "profile",
            icon: <ProfileIcon className="w-6 h-6" />,
            label: "Perfil",
            route: "/perfil",
        },
        {
            id: "logout",
            icon: <LogoutIcon className="w-6 h-6" />,
            label: "Cerrar sesión",
        },
    ];

    return (
        <nav
            className={`flex flex-col justify-between h-screen ${
                open ? "w-56" : "w-16"
            } bg-green-600 transition-all duration-300`}
        >
            <div className="flex flex-col">
                <button
                    className="flex items-center justify-center h-16"
                    onClick={() => setOpen(!open)}
                >
                    <MenuIcon className="w-8 h-8" />
                </button>

                <ul className="flex flex-col gap-2 mt-4">
                    {menuItems.map((item) => {
                        if (item.id === "faq") {
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => {
                                            setFaqOpen((prev) => !prev);
                                            setActive("faq");
                                        }}
                                        className={`flex items-center gap-4 w-full px-3 py-3 rounded-lg
                                            ${
                                            active === "faq"
                                                ? "bg-green-700"
                                                : "hover:bg-green-500/70"
                                        }
                                        `}
                                    >
                                        <span className="text-white">{item.icon}</span>
                                        {open && (
                                            <span className="text-white font-medium">{item.label}</span>
                                        )}
                                        {open && (
                                            <svg
                                                className={`w-4 h-4 ml-auto transform transition-transform ${
                                                    faqOpen ? "rotate-90" : ""
                                                }`}
                                                fill="none"
                                                stroke="white"
                                                strokeWidth={2}
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M9 5l7 7-7 7" />
                                            </svg>
                                        )}
                                    </button>
                                    {open && faqOpen && (
                                        <ul className="pl-6">
                                            {item.subItems?.map((sub) => (
                                                <li key={sub.id}>
                                                    <button
                                                        onClick={() => setActive(sub.id)}
                                                        className={`flex items-center gap-3 w-full px-2 py-2 rounded-md
                                                            ${
                                                            active === sub.id
                                                                ? "bg-green-700"
                                                                : "hover:bg-green-500/70"
                                                        }
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

                        if (item.id === "users") {
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => {
                                            setUsersOpen((prev) => !prev);
                                            setActive("users");
                                        }}
                                        className={`flex items-center gap-4 w-full px-3 py-3 rounded-lg
                                            ${
                                            active === "users"
                                                ? "bg-green-700"
                                                : "hover:bg-green-500/70"
                                        }
                                        `}
                                    >
                                        <span className="text-white">{item.icon}</span>
                                        {open && (
                                            <span className="text-white font-medium">{item.label}</span>
                                        )}
                                        {open && (
                                            <svg
                                                className={`w-4 h-4 ml-auto transform transition-transform ${
                                                    usersOpen ? "rotate-90" : ""
                                                }`}
                                                fill="none"
                                                stroke="white"
                                                strokeWidth={2}
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M9 5l7 7-7 7" />
                                            </svg>
                                        )}
                                    </button>
                                    {open && usersOpen && (
                                        <ul className="pl-6">
                                            {item.subItems?.map((sub) => (
                                                <li key={sub.id}>
                                                    <button
                                                        onClick={() => {
                                                            setActive(sub.id);
                                                            if (sub.route) {
                                                                navigate(sub.route);
                                                            }
                                                        }}
                                                        className={`flex items-center gap-3 w-full px-2 py-2 rounded-md
                                                            ${
                                                            active === sub.id
                                                                ? "bg-green-700"
                                                                : "hover:bg-green-500/70"
                                                        }
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
                                        setActive(item.id);
                                        if (item.route) {
                                            navigate(item.route);
                                        }
                                    }}
                                    className={`flex items-center gap-4 w-full px-3 py-3 rounded-lg 
                                        ${
                                        active === item.id
                                            ? "bg-green-700"
                                            : "hover:bg-green-500/70"
                                    }
                                    `}
                                >
                                    <span className="text-white">{item.icon}</span>
                                    {open && (
                                        <span className="text-white font-medium">{item.label}</span>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="flex flex-col items-center mb-4"></div>
        </nav>
    );
};

export default Sidebar;