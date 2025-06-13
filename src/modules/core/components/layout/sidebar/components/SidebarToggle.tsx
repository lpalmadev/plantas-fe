import { ReactComponent as MenuIcon } from "../../../../../../assets/icons/MenuIcon.svg";

interface SidebarToggleProps {
    onClick: () => void;
}

const SidebarToggle = ({ onClick }: SidebarToggleProps) => {
    return (
        <button className="flex items-center justify-center h-20" onClick={onClick}>
            <MenuIcon className="w-6 h-6" />
        </button>
    );
};

export default SidebarToggle;