import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { AppHeader } from "../components/AppHeader";
import { AppFooter } from "../components/AppFooter";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header global */}
        <AppHeader />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {/* Pagina actual */}
          <Outlet />
        </main>

        {/* Footer */}
        <AppFooter />
      </div>
    </div>
  );
}
