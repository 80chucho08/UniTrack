import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../services/http";


interface LoginResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                // p. ej. credenciales incorrectas (401) o demasiados intentos (429)
                throw new Error(data?.message ?? "Email o contraseña incorrectos");
            }

            const { token, user }: LoginResponse = data;

            //guardar token en localstorage
            login(token, user);
            navigate("/");


        } catch (err) {
            setError(err instanceof Error ? err.message : "Email o contraseña incorrectos");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold  mb-6 text-center">Iniciar Sesión</h2>
                {error && (<p className="text-red-500 text-sm mb-4 text-center">{error}</p>)}

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Contraseña</label>
                    <input
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Ingresando..." : "Entrar"}
                </button>
                <div>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        ¿No tienes una cuenta?{" "}
                        <a
                            href="/register"
                            className="text-blue-600 hover:underline"
                        >
                            Regístrate
                        </a>
                    </p>
                </div>
            </form>

        </div>
    );
}

export default Login;