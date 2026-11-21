import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CircleHelp, Menu } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { userInitials } from "../utils/user";

interface Props {
  onMenuClick: () => void;
}

// Título de la sección según la ruta actual
function pageTitle(path: string): string {
  if (path.startsWith("/dashboard/semester")) return "Semestre";
  if (path.startsWith("/dashboard/subject")) return "Materia";
  if (path.startsWith("/dashboard/schedule")) return "Horario";
  if (path.startsWith("/dashboard/todo")) return "To-Do List";
  return "Inicio";
}

export function AppHeader({ onMenuClick }: Props) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/dashboard";
  const today = new Date();
  const weekday = today.toLocaleDateString("es-MX", { weekday: "long" });
  const date = today.toLocaleDateString("es-MX", { day: "numeric", month: "long" });

  return (
    <header className="sticky top-0 z-30 h-16 shrink-0 border-b border-line bg-surface/85 backdrop-blur-md">
      <div className="flex h-full items-center justify-between gap-4 px-4 md:px-6">
        {/* Navegación y título */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-1 rounded-lg text-ink-muted hover:bg-canvas hover:text-ink transition-colors"
            title="Abrir menú"
          >
            <Menu size={20} />
          </button>

          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg text-ink-muted hover:bg-canvas hover:text-ink transition-colors"
              title="Regresar"
            >
              <ArrowLeft size={19} />
            </button>
          )}

          <h1 className="text-base font-semibold text-ink truncate">
            {pageTitle(location.pathname)}
          </h1>
        </div>

        {/* Fecha, ayuda y usuario */}
        <div className="flex items-center gap-1 sm:gap-3">
          <p className="hidden sm:block text-sm text-ink-muted">
            <span className="capitalize">{weekday}</span>,{" "}
            <span className="relative font-semibold text-ink whitespace-nowrap">
              {/* Trazo de resaltador detrás de la fecha */}
              <span
                aria-hidden
                className="absolute inset-x-[-3px] bottom-[1px] h-[0.55em] -skew-x-6 rounded-[3px] bg-highlight"
              />
              <span className="relative">{date}</span>
            </span>
          </p>

          <span className="hidden sm:block w-px h-6 bg-line" />

          <button
            className="p-2 rounded-lg text-ink-subtle hover:bg-canvas hover:text-ink transition-colors"
            title="Ayuda"
          >
            <CircleHelp size={19} />
          </button>

          <div className="flex items-center gap-2.5 pl-1">
            <span className="hidden lg:block text-sm font-medium text-ink">{user?.name}</span>
            <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">
              {userInitials(user?.name)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
