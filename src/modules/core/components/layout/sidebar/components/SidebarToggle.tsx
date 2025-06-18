import { ReactComponent as MenuIcon } from "../../../../../../assets/icons/MenuIcon.svg";
import { useThemeStore } from "../../../../states/themeStore";

interface SidebarToggleProps {
    onClick: () => void;
}

const SidebarToggle = ({ onClick }: SidebarToggleProps) => {
    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    return (
        <button
            className={`flex items-center justify-center h-20 ${
                isDark ? 'text-gray-300 hover:text-white' : 'text-white'
            }`}
            onClick={onClick}
            aria-label="Toggle sidebar"
        >
            <MenuIcon className="w-6 h-6" />
        </button>
    );
};

export default SidebarToggle;