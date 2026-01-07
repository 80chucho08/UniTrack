import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
      className={`h-screen bg-white border-r shadow-sm transition-all duration-300
        ${collapsed ? "w-16" : "w-64"}
      `}
    >
      <div className="flex flex-col h-full p-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <h2 className="text-lg font-bold">UniTrack</h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-gray-800"
          >
            ☰
          </button>
        </div>

        {/* User info */}
        {!collapsed && (
          <div className="mb-6">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-grow">
          <button
            onClick={() => navigate("/")}
            className="text-left px-3 py-2 rounded hover:bg-gray-100"
          >
            🏠 {!collapsed && "Inicio"}
          </button>

          {location.pathname !== "/dashboard" && (
            <button
              onClick={() => navigate(-1)}
              className="text-left px-3 py-2 rounded hover:bg-gray-100"
            >
              🔙 {!collapsed && "Regresar"}
            </button>
          )}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          {!collapsed ? "Cerrar sesión" : "⏻"}
        </button>
      </div>
    </aside>
  );
}
