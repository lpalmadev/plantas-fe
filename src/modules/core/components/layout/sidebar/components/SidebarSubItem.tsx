import { useLocation, useNavigate } from "react-router-dom";
import { SubMenuItem } from "../types";

interface SidebarSubItemProps {
    subItem: SubMenuItem;
}

const SidebarSubItem = ({ subItem }: SidebarSubItemProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const isActive = pathname === subItem.route;

    const handleClick = () => {
        if (subItem.route) {
            navigate(subItem.route);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`
        flex items-center gap-2 w-full rounded-md px-2 py-2
        ${isActive ? "bg-green-700" : "hover:bg-green-500/70"}
      `}
        >
            <span className="text-white">{subItem.icon}</span>
            <span className="text-white text-sm">{subItem.label}</span>
        </button>
    );
};

export default SidebarSubItem;