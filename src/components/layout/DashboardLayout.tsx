import DashboardSidebar from "../ui/DashboardSidebar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="d-flex w-100" style={{ minHeight: '100vh' }}>
            <DashboardSidebar />
            <main 
                className="flex-grow-1 p-4 bg-light d-flex flex-column" 
                style={{ minHeight: '100vh', overflowX: 'hidden' }}
            >
                {children}
            </main>
        </div>
    );
}
