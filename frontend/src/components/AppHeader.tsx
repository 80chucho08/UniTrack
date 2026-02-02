export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-6">
        {/* Lado Izquierdo: Branding */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-black-600">UniTrack</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-medium text-gray-500">Gestión Académica</span>
        </div>

        {/* Lado Derecho: Acciones (Espacio para Avatar, Notificaciones, etc.) */}
        <div className="flex items-center gap-4">
          <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Ayuda
          </button>
          <div className="h-8 w-8 rounded-full bg-gray-200 border" /> {/* Placeholder para Avatar */}
        </div>
      </div>
    </header>
  );
}