import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export function Sidebar () {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside className="bg-white p-6 rounded-xl shadow-md h-fit">
            <h2 className="text-xl font-bold mb-2">
                Bienvenido
            </h2>
            <p className="text-gray-500 text-sm mb-6">
                {user?.name}
            </p>
            <p className="text-gray-500 text-sm mb-6">
                {user?.email}
            </p>

            <button 
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition">
                Cerrar sesión
            </button>
        </aside>
    );
}