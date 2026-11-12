import { useState, useEffect } from 'react';
import DashboardLayout from "../../components/layout/DashboardLayout";
import { userService } from '../../services/userService';
import { serviceService } from '../../services/serviceService';
import { statisticService } from '../../services/statisticService';
import type { RevenueResponse } from '../../types/statistics';
import { appointmentService } from '../../services/appointmentService';
import type { AppointmentResponse } from '../../types/appointment';
import Select, { type SelectOption } from "../../components/form/Select";

type PeriodOption = 'ALL' | 'TODAY' | 'WEEK' | 'MONTH' | 'LAST_90_DAYS';

const PERIOD_OPTIONS: SelectOption[] = [
    { label: 'Todo o período', value: 'ALL' },
    { label: 'Hoje', value: 'TODAY' },
    { label: 'Esta semana', value: 'WEEK' },
    { label: 'Este mês', value: 'MONTH' },
    { label: 'Últimos 90 dias', value: 'LAST_90_DAYS' }
];


const formatISODate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getDateRange = (period: PeriodOption) => {
    const now = new Date();
    const endDate = formatISODate(now);
    const start = new Date(now);

    switch (period) {
        case 'TODAY':
            return { startDate: endDate, endDate };

        case 'WEEK': {
            // Início da semana atual (Domingo) até hoje
            const dayOfWeek = now.getDay();
            start.setDate(now.getDate() - dayOfWeek);
            return { startDate: formatISODate(start), endDate };
        }

        case 'MONTH': {
            // Primeiro dia do mês atual até hoje
            start.setDate(1);
            return { startDate: formatISODate(start), endDate };
        }

        case 'LAST_90_DAYS': {
            // 90 dias atrás até hoje
            start.setDate(now.getDate() - 90);
            return { startDate: formatISODate(start), endDate };
        }

        case 'ALL':
        default:
            // Todo o período (data inicial bem antiga até hoje)
            return { startDate: '2020-01-01', endDate };
    }
};

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [loadingReport, setLoadingReport] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [totalClients, setTotalClients] = useState(0);
    const [totalServices, setTotalServices] = useState(0);
    const [revenueData, setRevenueData] = useState<RevenueResponse | null>(null);
    const [nextAppointment, setNextAppointment] = useState<AppointmentResponse | null>(null);

    const [periodFilter, setPeriodFilter] = useState<PeriodOption>('MONTH');

    const [canceledAppointments, setCanceledAppointments] = useState(0);

    const [pendingAppointments, setPendingAppointments] = useState(0);

    useEffect(() => {
        loadDashboardData();
    }, [periodFilter]);

    const loadDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const { startDate, endDate } = getDateRange(periodFilter);

            const [clientsData, servicesData, statsData, appointmentsPage] = await Promise.all([
                userService.findAll(),
                serviceService.findAll(),
                statisticService.getRevenue(startDate, endDate),
                appointmentService.findAll(0, 100, 'startsAt,asc')
            ]);

            setTotalClients(clientsData?.totalElements || 0);
            setTotalServices(servicesData?.length || 0);
            setRevenueData(statsData);

            const now = new Date();
            const futureAppointments = appointmentsPage?.content?.filter((apt: AppointmentResponse) => {
                const aptDate = new Date(apt.startsAt);
                return aptDate > now && apt.status !== 'CANCELED';
            }) || [];

            setNextAppointment(futureAppointments[0] || null);

            setPendingAppointments(futureAppointments.length);

            const canceledCount = appointmentsPage?.content?.filter((apt: AppointmentResponse) => {
                if (apt.status !== 'CANCELED') return false;

                const aptDateStr = apt.startsAt.split('T')[0]; // Pega apenas 'YYYY-MM-DD'
                return aptDateStr >= startDate && aptDateStr <= endDate;
            }).length || 0;

            setCanceledAppointments(canceledCount);
        } catch (err) {
            console.error(err);
            setError('Não foi possível carregar os dados consolidados do dashboard.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = async () => {
        setLoadingReport(true);
        try {
            const { startDate, endDate } = getDateRange(periodFilter);
            await statisticService.downloadReport(startDate, endDate);
        } catch (err) {
            console.error(err);
            alert('Não foi possível gerar o relatório em PDF.');
        } finally {
            setLoadingReport(false);
        }
    };

    const formatPaymentMethod = (method: string | null) => {
        if (!method) return 'Não Especificado';

        const paymentMap: Record<string, string> = {
            PIX: 'PIX',
            CREDIT: 'Cartão de Crédito',
            DEBIT: 'Cartão de Débito',
            CASH: 'Dinheiro'
        };

        // Normaliza para maiúsculo para evitar problemas caso venha em minúsculo
        const normalized = method.toUpperCase();

        // Retorna o nome traduzido ou formata automaticamente se não estiver no mapa
        return paymentMap[normalized] || method
            .toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                    <p className="text-muted mt-2">Carregando métricas do dashboard...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="container-fluid p-0 pb-5 mb-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
                    <h4 className="m-0 text-dark fw-bold">Visão Geral</h4>

                    <div className="d-flex align-items-center gap-2">
                        <Select
                            size="sm"
                            margin="mb-0"
                            placeholder=""
                            options={PERIOD_OPTIONS}
                            value={periodFilter}
                            onChange={(e) => setPeriodFilter(e.target.value as PeriodOption)}
                        />

                        <button
                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2 text-nowrap"
                            onClick={handleDownloadReport}
                            disabled={loadingReport}
                        >
                            {loadingReport ? (
                                <span className="spinner-border spinner-border-sm" role="status" />
                            ) : (
                                <i className="bi bi-file-earmark-pdf"></i>
                            )}
                            {loadingReport ? 'Gerando...' : 'Exportar PDF'}
                        </button>
                    </div>
                </div>

                {error && <div className="alert alert-danger py-2 mb-4">{error}</div>}

                <div className="row g-3 mb-4">
                    <div className="col-12 col-sm-6">
                        <div className="card border-0 shadow-sm p-3 bg-white rounded-3 h-100">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <span className="text-muted small fw-medium d-block mb-1">Clientes Cadastrados</span>
                                    <h3 className="m-0 fw-bold text-dark">{totalClients}</h3>
                                </div>
                                <div className="p-3 bg-primary-subtle text-primary rounded-3 fs-4">
                                    <i className="bi bi-people"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6">
                        <div className="card border-0 shadow-sm p-3 bg-white rounded-3 h-100">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <span className="text-muted small fw-medium d-block mb-1">Serviços Ativos</span>
                                    <h3 className="m-0 fw-bold text-dark">{totalServices}</h3>
                                </div>
                                <div className="p-3 bg-success-subtle text-success rounded-3 fs-4">
                                    <i className="bi bi-gear"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-3">
                        <div className="card border-0 shadow-sm p-3 bg-white rounded-3 h-100">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <span className="text-muted small fw-medium d-block mb-1">Agendamentos Concluídos</span>
                                    <h3 className="m-0 fw-bold text-dark">{revenueData?.totalAppointments || 0}</h3>
                                </div>
                                <div className="p-3 bg-info-subtle text-info rounded-3 fs-4">
                                    <i className="bi bi-calendar-check"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-3">
                        <div className="card border-0 shadow-sm p-3 bg-white rounded-3 h-100">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <span className="text-muted small fw-medium d-block mb-1">Agendamentos Cancelados</span>
                                    <h3 className="m-0 fw-bold text-danger">{canceledAppointments}</h3>
                                </div>
                                <div className="p-3 bg-danger-subtle text-danger rounded-3 fs-4">
                                    <i className="bi bi-calendar-x"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6">
                        <div className="card border-0 shadow-sm p-3 bg-white rounded-3 h-100">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <span className="text-muted small fw-medium d-block mb-1">Receita Total</span>
                                    <h3 className="m-0 fw-bold text-success">
                                        R$ {revenueData?.totalRevenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                                    </h3>
                                </div>
                                <div className="p-3 bg-success-subtle text-success rounded-3 fs-4">
                                    <i className="bi bi-cash-coin"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-3">
                    <div className="col-12 col-lg-7">
                        <div className="card border-0 shadow-sm p-3 bg-white rounded-3 h-100">
                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                                <h6 className="text-primary fw-bold m-0">
                                    <i className="bi bi-clock-history me-2"></i> Próximo Agendamento Cadastrado
                                </h6>
                                {pendingAppointments > 0 && (
                                    <span className="text-muted small">
                                        {pendingAppointments} {pendingAppointments === 1 ? 'agendamento pendente no total' : 'agendamentos pendentes no total'}
                                    </span>
                                )}
                            </div>

                            {nextAppointment ? (
                                <div className="p-3 bg-light rounded-3">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className="m-0 fw-bold text-dark">{nextAppointment.user.name}</h5>
                                        <span className="badge bg-primary">
                                            {new Date(nextAppointment.startsAt).toLocaleTimeString('pt-BR', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-muted small mb-1">
                                        <strong>Serviço:</strong> {nextAppointment.service.name}
                                    </p>
                                    <p className="text-muted small mb-0">
                                        <strong>Data:</strong>{' '}
                                        {new Date(nextAppointment.startsAt).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-4 my-auto">
                                    <p className="text-muted small mb-0">
                                        Não há agendamentos futuros confirmados para os próximos dias.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-12 col-lg-5">
                        <div className="card border-0 shadow-sm p-3 bg-white rounded-3 h-100">
                            <h6 className="text-dark fw-bold mb-3">Distribuição por Forma de Pagamento</h6>
                            {revenueData?.byPaymentMethod && revenueData.byPaymentMethod.length > 0 ? (
                                <ul className="list-group list-group-flush small">
                                    {revenueData.byPaymentMethod.map((item, idx) => (
                                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center gap-2 px-0 bg-transparent">
                                            <div className="text-truncate">
                                                <span className="text-dark fw-medium d-block text-truncate">
                                                    {formatPaymentMethod(item.paymentMethod)}
                                                </span>
                                                <span className="text-muted small">
                                                    {item.appointments} {item.appointments === 1 ? 'atendimento' : 'atendimentos'}
                                                </span>
                                            </div>
                                            <span className="text-dark fw-bold text-nowrap">
                                                R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-4 my-auto">
                                    <p className="text-muted small mb-0">Nenhuma movimentação registrada.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}