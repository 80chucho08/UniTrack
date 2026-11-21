import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
    Calendar,
    Home,
    LayoutList,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
    X,
} from "lucide-react";
import { userInitials } from "../utils/user";

interface Props {
    mobileOpen: boolean;
    onCloseMobile: () => void;
}

interface NavItem {
    label: string;
    to: string;
    icon: React.ReactNode;
    isActive: (path: string) => boolean;
}

// "Inicio" también queda activo dentro de un semestre o una materia
const NAV_ITEMS: NavItem[] = [
    {
        label: "Inicio",
        to: "/dashboard",
        icon: <Home size={19} strokeWidth={1.9} />,
        isActive: (p) =>
            p === "/dashboard" ||
            p.startsWith("/dashboard/semester") ||
            p.startsWith("/dashboard/subject"),
    },
    {
        label: "Horario",
        to: "/dashboard/schedule",
        icon: <Calendar size={19} strokeWidth={1.9} />,
        isActive: (p) => p.startsWith("/dashboard/schedule"),
    },
    {
        label: "To-Do List",
        to: "/dashboard/todo",
        icon: <LayoutList size={19} strokeWidth={1.9} />,
        isActive: (p) => p.startsWith("/dashboard/todo"),
    },
];

export function Sidebar({ mobileOpen, onCloseMobile }: Props) {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Solo aplica en escritorio; en móvil el menú siempre se muestra completo
    const [collapsed, setCollapsed] = useState(false);
    const hideWhenCollapsed = collapsed ? "md:hidden" : "";

    const go = (to: string) => {
        navigate(to);
        onCloseMobile();
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            {/* Fondo del cajón en móvil */}
            <div
                onClick={onCloseMobile}
                className={`fixed inset-0 z-40 bg-ink/30 backdrop-blur-[2px] md:hidden transition-opacity duration-200
                    ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            />

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 md:sticky md:top-0 md:z-auto md:h-screen
                    flex flex-col shrink-0 bg-surface border-r border-line
                    transition-[transform,width] duration-200 ease-out
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
                    ${collapsed ? "md:w-[76px]" : "md:w-64"}`}
            >
                {/* Marca */}
                <div className={`flex items-center h-16 px-4 border-b border-line ${collapsed ? "md:justify-center md:px-0" : "justify-between"}`}>
                    <button
                        onClick={() => go("/dashboard")}
                        className="flex items-center gap-2.5 rounded-lg"
                        title="Ir al inicio"
                    >
                        <span className="relative w-9 h-9 rounded-[10px] bg-brand-600 text-white flex items-center justify-center font-extrabold text-lg shadow-[inset_0_-2px_0_rgb(0_0_0/0.15)]">
                            U
                        </span>
                        <span className={`text-left leading-tight ${hideWhenCollapsed}`}>
                            <span className="block text-[15px] font-bold text-ink tracking-tight">UniTrack</span>
                            <span className="block text-xs text-ink-subtle">Tu espacio académico</span>
                        </span>
                    </button>

                    <button
                        onClick={onCloseMobile}
                        className="md:hidden p-2 rounded-lg text-ink-muted hover:bg-canvas hover:text-ink transition-colors"
                        title="Cerrar menú"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navegación */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
                    {NAV_ITEMS.map((item) => {
                        const active = item.isActive(location.pathname);
                        return (
                            <button
                                key={item.to}
                                onClick={() => go(item.to)}
                                title={collapsed ? item.label : undefined}
                                aria-current={active ? "page" : undefined}
                                className={`group relative flex items-center gap-3 h-10 rounded-lg text-sm font-medium transition-colors
                                    ${collapsed ? "md:justify-center px-3 md:px-0" : "px-3"}
                                    ${active
                                        ? "bg-brand-50 text-brand-700"
                                        : "text-ink-muted hover:bg-canvas hover:text-ink"}`}
                            >
                                {/* Indicador del elemento activo */}
                                <span
                                    className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-brand-600 transition-opacity
                                        ${active ? "opacity-100" : "opacity-0"}`}
                                />
                                <span className={active ? "text-brand-600" : "text-ink-subtle group-hover:text-ink-muted"}>
                                    {item.icon}
                                </span>
                                <span className={hideWhenCollapsed}>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Contraer (solo escritorio) */}
                <div className="hidden md:block px-3 pb-2">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        title={collapsed ? "Expandir menú" : "Contraer menú"}
                        className={`w-full flex items-center gap-3 h-9 rounded-lg text-sm text-ink-subtle hover:bg-canvas hover:text-ink transition-colors
                            ${collapsed ? "justify-center" : "px-3"}`}
                    >
                        {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                        {!collapsed && <span>Contraer menú</span>}
                    </button>
                </div>

                {/* Usuario y cierre de sesión */}
                <div className={`border-t border-line p-3 flex items-center gap-3 ${collapsed ? "md:flex-col md:gap-2" : ""}`}>
                    <span
                        className="w-9 h-9 shrink-0 rounded-full bg-brand-100 text-brand-700 text-sm font-bold flex items-center justify-center"
                        title={user?.name}
                    >
                        {userInitials(user?.name)}
                    </span>
                    <div className={`flex-1 min-w-0 ${hideWhenCollapsed}`}>
                        <p className="text-sm font-semibold text-ink truncate">{user?.name}</p>
                        <p className="text-xs text-ink-subtle truncate">{user?.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Cerrar sesión"
                        className="p-2 rounded-lg text-ink-subtle hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>
        </>
    );
}
