// src/components/DashboardHeader.tsx
interface HeaderProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode; 
}

export const DashboardHeader = ({ title, subtitle, children }: HeaderProps) => {
    return (
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    {title}
                </h1>
                {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-3">
                {children}
            </div>
        </header>
    );
};