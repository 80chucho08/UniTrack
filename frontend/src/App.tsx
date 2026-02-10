import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SemesterDashboard from "./pages/SemesterDashboard";
import PrivateRoute from "./routes/PrivateRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Schedule from "./pages/Schedule";
import Todo from "./pages/Todo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Redirección raíz */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Rutas protegidas */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route
              path="semester/:semesterId"
              element={<SemesterDashboard />}
            />
            <Route path="schedule" element={<Schedule />} />
            <Route path="todo" element={<Todo />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;