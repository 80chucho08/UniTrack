import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
    Home,
    ChevronLeft,
    Menu,
    LogOut,
    Calendar
} from "lucide-react";

export function Sidebar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside
            className={`h-screen bg-white-500 border-r shadow-sm transition-all duration-300 flex-shrink-0
        ${collapsed ? "w-16" : "w-64"}
      `}
        >
            <div className="flex flex-col h-full p-4">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    {!collapsed && (
                        <div>
                            <h2 className="text-lg font-bold">UniTrack</h2>
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        <Menu size={20} />
                    </button>
                </div>

                {/* User info */}
                {!collapsed && (
                    <div className="mb-6 px-2">
                        <p className="text-sm font-semibold truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex flex-col gap-2 flex-grow">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                            ${location.pathname === "/dashboard" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}
                        `}
                    >
                        <Home size={20} />
                        {!collapsed && <span className="text-sm font-medium">Inicio</span>}
                    </button>

                    {location.pathname !== "/dashboard" && (
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            <ChevronLeft size={20} />
                            {!collapsed && <span className="text-sm font-medium">Regresar</span>}
                        </button>
                    )}

                    <button
                        onClick={() => navigate("/dashboard/schedule")}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                            ${location.pathname === "/dashboard/schedule"
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:bg-gray-100"}
                            `}
                        >
                        <Calendar size={20} />
                        {!collapsed && <span className="text-sm font-medium">Horario</span>}
                    </button>
                </nav>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 py-2 rounded-lg transition-colors
                      ${collapsed ? "justify-center bg-gray-100 text-gray-600" : "px-3 bg-red-50 text-red-600 hover:bg-red-100"}
                    `}
                >
                    <LogOut size={20} />
                   {!collapsed && <span className="text-sm font-medium">Cerrar sesión</span>}
                </button>
            </div>
        </aside>
    );
}
