export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-line px-4 md:px-6 py-5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-subtle">
        <p>
          © {currentYear} UniTrack, gestión académica. Desarrollado por Jesus Carbajal.
        </p>

        <nav className="flex items-center gap-5">
          <a href="#" className="hover:text-ink transition-colors">Soporte técnico</a>
          <a href="#" className="hover:text-ink transition-colors">Privacidad</a>
          <a href="#" className="hover:text-ink transition-colors">Términos</a>
        </nav>
      </div>
    </footer>
  );
}
