import { useLocation, useNavigate } from "react-router-dom";
import { MenuItem } from "../types";

interface SidebarBottomItemProps {
    item: MenuItem;
    isOpen: boolean;
}

const SidebarBottomItem = ({ item, isOpen }: SidebarBottomItemProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const isActive = pathname === item.route;

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
        ${isActive ? "bg-green-700" : "hover:bg-green-500/70"}
      `}
        >
      <span className="flex items-center justify-center text-white w-8 h-8">
        {item.icon}
      </span>
            {isOpen && (
                <span className="text-white font-semibold text-base text-left flex-1 truncate">
          {item.label}
        </span>
            )}
        </button>
    );
};

export default SidebarBottomItem;