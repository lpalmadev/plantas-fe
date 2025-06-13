import { useState } from "react";

export const useSidebarState = () => {
    const [open, setOpen] = useState(true);
    const [faqOpen, setFaqOpen] = useState(false);
    const [usersOpen, setUsersOpen] = useState(false);

    const toggleSidebar = () => setOpen(!open);

    const toggleSubmenu = (menuId: string) => {
        if (menuId === 'faq') {
            setFaqOpen(prev => !prev);
        } else if (menuId === 'users') {
            setUsersOpen(prev => !prev);
        }
    };

    const getSubmenuState = (menuId: string) => {
        return menuId === 'faq' ? faqOpen : menuId === 'users' ? usersOpen : false;
    };

    return {
        open,
        faqOpen,
        usersOpen,
        toggleSidebar,
        toggleSubmenu,
        getSubmenuState
    };
};