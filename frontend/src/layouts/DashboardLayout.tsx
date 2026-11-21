import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { AppHeader } from "../components/AppHeader";
import { AppFooter } from "../components/AppFooter";

export default function DashboardLayout() {
  // Cajón del menú en móvil
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-canvas">

      {/* Sidebar */}
      <Sidebar mobileOpen={menuOpen} onCloseMobile={() => setMenuOpen(false)} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header global */}
        <AppHeader onMenuClick={() => setMenuOpen(true)} />

        {/* Page content */}
        <main className="flex-1">
          {/* Pagina actual */}
          <Outlet />
        </main>

        {/* Footer */}
        <AppFooter />
      </div>
    </div>
  );
}
