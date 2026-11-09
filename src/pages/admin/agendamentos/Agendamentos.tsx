import { useState, useEffect } from 'react';
import DashboardLayout from "../../../components/layout/DashboardLayout";

import ModalConfirmacao from '../../../components/ui/ModalConfirmacao';
import ResumoAgendamento from './ResumoAgendamento';
import type { AppointmentResponse, CancelAppointmentRequest, UpdateAppointmentRequest } from '../../../types/appointment';
import type { SpringPage } from '../../../types/pagination';
import { appointmentService } from '../../../services/appointmentService';
import { useNavigate } from 'react-router-dom';
import Select from '../../../components/form/Select';
import { ModalCancelamento } from '../../../components/agendamento/ModalCancelamento';

export default function Agendamentos() {
    const [pageData, setPageData] = useState<SpringPage<AppointmentResponse> | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [periodFilter, setPeriodFilter] = useState<string>('ALL');

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

    // função para filtrar agendamentos
    const filteredAppointments = appointmentsList.filter((appt) => {
        // filtro por cliente ou serviço
        const term = search.trim().toLowerCase();
        const clientName = appt.user?.name?.toLowerCase() || '';
        const serviceName = appt.service?.name?.toLowerCase() || '';
        const matchesSearch = !term || clientName.includes(term) || serviceName.includes(term);

        // filtro por status
        const matchesStatus = statusFilter === 'ALL' || appt.status === statusFilter;

        // filtro por periodo
        let matchesPeriod = true;
        if (periodFilter !== 'ALL' && appt.startsAt) {
            const apptDate = new Date(appt.startsAt);
            const today = new Date();

            today.setHours(0, 0, 0, 0);
            const apptDateOnly = new Date(apptDate.getFullYear(), apptDate.getMonth(), apptDate.getDate());

            if (periodFilter === 'TODAY') {
                matchesPeriod = apptDateOnly.getTime() === today.getTime();
            } else if (periodFilter === 'WEEK') {
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay());
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);

                matchesPeriod = apptDateOnly >= startOfWeek && apptDateOnly <= endOfWeek;
            } else if (periodFilter === 'MONTH') {
                matchesPeriod =
                    apptDate.getMonth() === today.getMonth() &&
                    apptDate.getFullYear() === today.getFullYear();
            }
        }

        return matchesSearch && matchesStatus && matchesPeriod;
    });

    // função para marcar agendamento como concluído
    const handleCompleteAppointment = async () => {
        if (!selectedAppointment) return;
        setError(null);
        try {
            const payload: UpdateAppointmentRequest = {
                status: 'COMPLETED',
            };
            await appointmentService.update(selectedAppointment.id, payload);
            loadAppointments();
            setSelectedAppointment(null);
        } catch {
            setError('Não foi possível concluir o agendamento.');
        }
    };

    // função para cancelar agendamento
    const handleCancelAppointment = async (motivo: string) => {
        if (!selectedAppointment) return;
        setError(null);
        try {
            const payload: CancelAppointmentRequest = {
                cancellationReason: motivo 
            };

            await appointmentService.cancel(selectedAppointment.id, payload);
            loadAppointments();
            setSelectedAppointment(null);
        } catch {
            setError('Não foi possível cancelar o agendamento.');
        }
    };


    // função para formatar a data para tabela geral
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
                        className="btn btn-outline-light"
                        onClick={() => navigate('/admin/agendamentos/novo')}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Novo agendamento
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
                                className="form-control input-custom-focus"
                                placeholder="Buscar por cliente ou serviço..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="d-flex flex-wrap gap-2">
                            <div style={{ width: '160px' }}>
                                <Select
                                    size="sm"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    placeholder=""
                                    options={[
                                        { label: 'Todos os status', value: 'ALL' },
                                        { label: 'Agendado', value: 'SCHEDULED' },
                                        { label: 'Concluído', value: 'COMPLETED' },
                                        { label: 'Cancelado', value: 'CANCELED' }
                                    ]}
                                />
                            </div>

                            <div style={{ width: '160px' }}>
                                <Select
                                    size="sm"
                                    value={periodFilter}
                                    onChange={(e) => setPeriodFilter(e.target.value)}
                                    placeholder=""
                                    options={[
                                        { label: 'Todo o período', value: 'ALL' },
                                        { label: 'Hoje', value: 'TODAY' },
                                        { label: 'Esta semana', value: 'WEEK' },
                                        { label: 'Este mês', value: 'MONTH' }
                                    ]}
                                />
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status" />
                        </div>
                    ) : filteredAppointments.length === 0 ? (
                        <p className="text-muted text-center py-3">
                            {search || statusFilter !== 'ALL' || periodFilter !== 'ALL'
                                ? 'Nenhum agendamento encontrado para esses filtros.'
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
                                            <th className="text-end">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAppointments.map((appt) => (
                                            <tr key={appt.id}>
                                                <td>
                                                    <div className="fw-medium">{appt.user.name}</div>
                                                    <div className="text-muted small">{appt.user.phone}</div>
                                                </td>
                                                <td>{appt.service.name}</td>
                                                <td className="small">{formatDateTime(appt.startsAt)}</td>
                                                <td className="text-end">
                                                    <div className="d-inline-flex gap-1">
                                                        <button
                                                            className="btn btn-sm btn-outline-info"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#modalResumoAgendamento"
                                                            onClick={() => setSelectedAppointment(appt)}
                                                            title="Ver Detalhes / Resumo"
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </button>

                                                        {appt.status === 'SCHEDULED' && (
                                                            <button
                                                                className="btn btn-sm btn-outline-primary"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#modalConcluirAgendamento"
                                                                onClick={() => setSelectedAppointment(appt)}
                                                                title="Concluir Agendamento"
                                                            >
                                                                <i className="bi bi-check-circle"></i>
                                                            </button>
                                                        )}

                                                        {appt.status === 'SCHEDULED' && (
                                                            <button
                                                                className="btn btn-sm btn-outline-warning"
                                                                onClick={() => navigate(`/admin/agendamentos/editar/${appt.id}`)}
                                                                title="Editar Agendamento"
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </button>
                                                        )}

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
                                                    </div>
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

            {/* modal para resumo do agendamento */}
            <ResumoAgendamento
                idModal="modalResumoAgendamento"
                appointment={selectedAppointment}
            />

            {/* modal para confirmar a conclusão de um agendamento */}
            <ModalConfirmacao
                id="modalConcluirAgendamento"
                titulo="Confirmar Conclusão"
                descricao={`Deseja marcar o agendamento de ${selectedAppointment?.user?.name} como concluído?`}
                tipo="success"
                onConfirmar={handleCompleteAppointment}
            />

            <ModalCancelamento
                id="modalCancelarAgendamento"
                titulo="Cancelar Agendamento"
                onConfirmar={handleCancelAppointment}
            />
        </DashboardLayout>
    );
}