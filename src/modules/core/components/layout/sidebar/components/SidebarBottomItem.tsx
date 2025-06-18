import { useLocation, useNavigate } from "react-router-dom";
import { MenuItem } from "../lib/types.ts";
import { useThemeStore } from "../../../../states/themeStore";

interface SidebarBottomItemProps {
    item: MenuItem;
    isOpen: boolean;
}

const SidebarBottomItem = ({ item, isOpen }: SidebarBottomItemProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const isActive = pathname === item.route;

    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    const handleClick = () => {
        if (item.route) {
            navigate(item.route);
        }
        if (item.onClick) {
            item.onClick();
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`
                flex items-center rounded-lg transition-colors
                ${isOpen ? "pl-5 pr-3 py-3 gap-4 w-full" : "justify-center p-0 w-full h-14"}
                ${isActive
                ? isDark
                    ? "bg-green-800"
                    : "bg-green-700"
                : isDark
                    ? "hover:bg-green-700/50"
                    : "hover:bg-green-500/70"
            }
            `}
        >
            <span className={`flex items-center justify-center ${isDark ? 'text-gray-200' : 'text-white'} w-8 h-8`}>
                {item.icon}
            </span>
            {isOpen && (
                <span className={`${isDark ? 'text-gray-200' : 'text-white'} font-semibold text-base text-left flex-1 truncate`}>
                    {item.label}
                </span>
            )}
        </button>
    );
};

export default SidebarBottomItem;