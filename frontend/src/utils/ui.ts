// Clases compartidas para botones del tema "Tinta" con toque neumórfico.

// Acción principal: color de marca con sombra suave teñida
export const btnPrimary =
    "inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl text-sm font-semibold " +
    "bg-brand-600 text-white shadow-neu-brand hover:bg-brand-700 active:translate-y-px " +
    "disabled:opacity-50 disabled:cursor-not-allowed transition";

// Acción secundaria: botón elevado que se hunde al presionarlo
export const btnSoft =
    "inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl text-sm font-semibold " +
    "neu-raised-sm text-ink-muted hover:text-ink active:shadow-neu-inset " +
    "disabled:opacity-50 disabled:cursor-not-allowed transition";

// Acción discreta sin relieve (cancelar, enlaces de texto)
export const btnGhost =
    "inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl text-sm font-semibold " +
    "text-ink-muted hover:text-ink hover:bg-white/60 transition-colors";

// Acción destructiva discreta
export const btnDanger =
    "inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl text-sm font-semibold " +
    "text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors";
