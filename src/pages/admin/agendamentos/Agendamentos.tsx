import { useState, useEffect } from 'react';
import DashboardLayout from "../../../components/layout/DashboardLayout";

import ModalConfirmacao from '../../../components/ui/ModalConfirmacao';
import type { AppointmentResponse } from '../../../types/appointment';
import type { SpringPage } from '../../../types/pagination';
import { appointmentService } from '../../../services/appointmentService';
import { useNavigate } from 'react-router-dom';

export default function Agendamentos() {
    const [pageData, setPageData] = useState<SpringPage<AppointmentResponse> | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentResponse | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        loadAppointments();
    }, [currentPage]);

    const loadAppointments = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await appointmentService.findAll(currentPage, 10, 'startsAt');
            setPageData(data);
        } catch {
            setError('Não foi possível carregar os agendamentos.');
        } finally {
            setLoading(false);
        }
    };

    const appointmentsList = pageData?.content || [];

    // filtrar agendamentos pelo nome do cliente ou nome do serviço
    const filteredAppointments = appointmentsList.filter((appt) => {
        const term = search.trim().toLowerCase();
        if (!term) return true;

        const clientName = appt.user?.name?.toLowerCase() || '';
        const serviceName = appt.service?.name?.toLowerCase() || '';

        return clientName.includes(term) || serviceName.includes(term);
    });

    const handleCancelAppointment = async () => {
        if (!selectedAppointment) return;
        setError(null);
        try {
            await appointmentService.cancel(selectedAppointment.id);
            loadAppointments(); // Recarrega a lista atualizada
            setSelectedAppointment(null);
        } catch {
            setError('Não foi possível cancelar o agendamento.');
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'SCHEDULED': return 'Agendado';
            case 'COMPLETED': return 'Concluído';
            case 'CANCELED': return 'Cancelado';
            case 'NO_SHOW': return 'Não Compareceu';
            default: return status;
        }
    };

    const formatDateTime = (isoString: string) => {
        try {
            const date = new Date(isoString);
            return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
        } catch {
            return isoString;
        }
    };

    return (
        <DashboardLayout>
            <div className="bg-white rounded-3 shadow-sm">
                <div className="bg-primary text-white d-flex justify-content-between align-items-center p-3 rounded-top-3">
                    <h5 className="m-0">
                        <i className="bi bi-calendar-event me-2"></i>
                        Agendamentos
                    </h5>
                    <button
                        className="btn btn-light btn-sm fw-semibold"
                        onClick={() => navigate('/admin/agendamentos/novo')}
                    >
                        <i className="bi bi-plus-lg me-1"></i>
                        Novo Agendamento
                    </button>
                </div>

                <div className="p-3">
                    {error && <div className="alert alert-danger py-2">{error}</div>}

                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                        <div className="input-group input-group-sm" style={{ maxWidth: '280px' }}>
                            <span className="input-group-text bg-white">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por cliente ou serviço..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status" />
                        </div>
                    ) : filteredAppointments.length === 0 ? (
                        <p className="text-muted text-center py-3">
                            {search
                                ? 'Nenhum agendamento encontrado para essa busca.'
                                : 'Nenhum agendamento cadastrado.'}
                        </p>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead>
                                        <tr>
                                            <th>Cliente</th>
                                            <th>Serviço</th>
                                            <th>Data / Hora</th>
                                            <th>Status</th>
                                            <th>Notas</th>
                                            <th className="text-end">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAppointments.map((appt) => (
                                            <tr key={appt.id}>
                                                <td>
                                                    <div className="fw-medium">{appt.user?.name}</div>
                                                    <div className="text-muted small">{appt.user?.phone}</div>
                                                </td>
                                                <td>{appt.service?.name}</td>
                                                <td className="small">{formatDateTime(appt.startsAt)}</td>
                                                <td>
                                                    <span className="badge bg-primary">
                                                        {getStatusLabel(appt.status)}
                                                    </span>
                                                </td>
                                                <td className="text-muted small text-truncate" style={{ maxWidth: '150px' }} title={appt.notes}>
                                                    {appt.notes || ' '}
                                                </td>
                                                <td className="text-end">
                                                    {appt.status === 'SCHEDULED' && (
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#modalCancelarAgendamento"
                                                            onClick={() => setSelectedAppointment(appt)}
                                                            title="Cancelar Agendamento"
                                                        >
                                                            <i className="bi bi-x-circle"></i>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mt-3 field-pagination">
                                <span className="text-muted small">
                                    Mostrando {filteredAppointments.length} de {pageData?.totalElements || 0} agendamentos
                                </span>
                                <nav>
                                    <ul className="pagination pagination-sm m-0">
                                        <li className={`page-item ${pageData?.first ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentPage(prev => prev - 1)}
                                                disabled={pageData?.first}
                                            >
                                                Anterior
                                            </button>
                                        </li>
                                        <li className="page-item disabled">
                                            <span className="page-link text-dark fw-medium">
                                                Página {currentPage + 1} de {pageData?.totalPages || 1}
                                            </span>
                                        </li>
                                        <li className={`page-item ${pageData?.last ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentPage(prev => prev + 1)}
                                                disabled={pageData?.last}
                                            >
                                                Próximo
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <ModalConfirmacao
                id="modalCancelarAgendamento"
                titulo="Confirmar Cancelamento"
                descricao={`Deseja realmente cancelar o agendamento do cliente ${selectedAppointment?.user?.name}?`}
                onConfirmar={handleCancelAppointment}
            />
        </DashboardLayout>
    );
}

