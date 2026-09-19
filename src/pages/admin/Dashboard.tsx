import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ServicosModal from "../../components/admin/ServicosModal";

export default function Dashboard() {
    const [showServicos, setShowServicos] = useState(false);

    return (
        <DashboardLayout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="m-0">Dashboard</h1>
                <button className="btn btn-primary" onClick={() => setShowServicos(true)}>
                    <i className="bi bi-grid me-2"></i>
                    Serviços
                </button>
            </div>

            <ServicosModal show={showServicos} onClose={() => setShowServicos(false)} />
        </DashboardLayout>
    );
}
