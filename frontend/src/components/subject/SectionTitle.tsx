interface Props {
    icon: React.ReactNode;
    title: string;
    detail?: string;
    tone: string; // color del ícono, p. ej. "text-emerald-600"
}

// Título de sección con el ícono en un pozo hundido
export function SectionTitle({ icon, title, detail, tone }: Props) {
    return (
        <div className="flex items-center gap-3 min-w-0">
            <span className={`neu-inset w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tone}`}>
                {icon}
            </span>
            <div className="min-w-0">
                <h2 className="text-lg font-bold text-ink leading-tight">{title}</h2>
                {detail && <p className="text-sm text-ink-subtle">{detail}</p>}
            </div>
        </div>
    );
}
