import { useState } from "react";
import DashboardSidebar from "../ui/DashboardSidebar";
import ServicosPanel from "../admin/ServicosPanel";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

type ActivePanel = 'none' | 'servicos';

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [activePanel, setActivePanel] = useState<ActivePanel>('none');

    return (
        <div className="d-flex w-100" style={{ minHeight: '100vh' }}>
            <DashboardSidebar
                activePanel={activePanel}
                onServicosClick={() => setActivePanel('servicos')}
            />

            <main
                className="flex-grow-1 p-4 bg-light d-flex flex-column"
                style={{ minHeight: '100vh', overflowX: 'hidden' }}
            >
                {activePanel === 'servicos' ? (
                    <ServicosPanel onClose={() => setActivePanel('none')} />
                ) : (
                    children
                )}
            </main>
        </div>
    );
}