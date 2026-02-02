export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50/50 px-6 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Lado Izquierdo: Copyright */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="text-xs font-medium text-gray-600">
            © {currentYear} UniTrack — Sistema de Gestión Académica
          </p>
          <p className="text-[10px] text-gray-400">
            Desarrollado por Jesus Carbajal.
          </p>
        </div>

        {/* Lado Derecho: Enlaces de Utilidad */}
        <nav className="flex items-center gap-6 text-xs text-gray-500">
          <a href="#" className="hover:text-blue-600 transition-colors">Soporte Técnico</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Privacidad</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Términos</a>
          <span className="hidden md:inline text-gray-300">|</span>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider">Sistema Online</span>
          </div>
        </nav>

      </div>
    </footer>
  );
}