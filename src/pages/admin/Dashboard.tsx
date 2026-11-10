import { useState, useEffect } from 'react';
import DashboardLayout from "../../components/layout/DashboardLayout";
import { userService } from '../../services/userService';
import { serviceService } from '../../services/serviceService';
import { statisticService } from '../../services/statisticService';
import type { RevenueResponse } from '../../types/statistics';

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [loadingReport, setLoadingReport] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [totalClients, setTotalClients] = useState(0);
    const [totalServices, setTotalServices] = useState(0);
    const [revenueData, setRevenueData] = useState<RevenueResponse | null>(null);
    const [nextAppointment, setNextAppointment] = useState<any>(null);

    const startDate = '2026-01-01';
    const endDate = '2026-11-10';

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [clientsData, servicesData, statsData] = await Promise.all([
                userService.findAll(),
                serviceService.findAll(),
                statisticService.getRevenue(startDate, endDate)
            ]);

            setTotalClients(clientsData?.totalElements || 0);
            setTotalServices(servicesData?.length || 0);
            setRevenueData(statsData);

            setNextAppointment(null);
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
        return method.replace('_', ' ');
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
            <div className="container-fluid p-0">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="m-0 text-dark fw-bold">Visão Geral</h4>

                    <button 
                        className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2"
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

                {error && <div className="alert alert-danger py-2 mb-4">{error}</div>}

                <div className="row g-3 mb-4">
                    <div className="col-12 col-sm-6 col-xl-3">
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

                    <div className="col-12 col-sm-6 col-xl-3">
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
                                    <span className="text-muted small fw-medium d-block mb-1">Total de Atendimentos</span>
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
                            <h6 className="text-primary fw-bold mb-3">
                                <i className="bi bi-clock-history me-2"></i> Próximo Agendamento Cadastrado
                            </h6>
                            {nextAppointment ? (
                                <div className="p-3 bg-light rounded-3">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className="m-0 fw-bold text-dark">{nextAppointment.clientName}</h5>
                                        <span className="badge bg-primary">{nextAppointment.time}</span>
                                    </div>
                                    <p className="text-muted small mb-1"><strong>Serviço:</strong> {nextAppointment.serviceName}</p>
                                    <p className="text-muted small mb-0"><strong>Data:</strong> {nextAppointment.date}</p>
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
                                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                                            <div>
                                                <span className="text-dark fw-medium d-block">
                                                    {formatPaymentMethod(item.paymentMethod)}
                                                </span>
                                                <span className="text-muted small">
                                                    {item.appointments} {item.appointments === 1 ? 'atendimento' : 'atendimentos'}
                                                </span>
                                            </div>
                                            <span className="text-dark fw-bold">
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