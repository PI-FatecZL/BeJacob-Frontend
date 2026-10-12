import { useEffect, useState } from "react";
import Navbar from "../components/landingPage/Navbar";
import Footer from "../components/landingPage/Footer";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import type { UserResponse } from "../types/user";
import type { AppointmentResponse } from "../types/appointment";
import { appointmentService } from "../services/appointmentService";
import Select from "../components/form/Select";

export default function MinhaConta() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState<UserResponse | null>(null);
    const [carregando, setCarregando] = useState<boolean>(true);

    const [agendamentos, setAgendamentos] = useState<AppointmentResponse[]>([]);

    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [periodFilter, setPeriodFilter] = useState<string>('ALL');

    useEffect(() => {
        loadInitialData();
    }, [navigate]);

    const loadInitialData = async () => {
        setCarregando(true);
        try {
            const userId = authService.getUserId();

            if (!userId) {
                navigate("/");
                return;
            }

            // Carrega o usuário e os agendamentos em paralelo
            const [dadosUsuario, dadosAgendamentos] = await Promise.all([
                userService.findById(userId),
                appointmentService.listMyAppointments()
            ]);

            // Trata caso a API retorne paginação (SpringPage) ou um array direto
            const typedAgendamentos = dadosAgendamentos as any;
            const listaAgendamentos = Array.isArray(typedAgendamentos)
                ? typedAgendamentos
                : typedAgendamentos?.content || [];

            setUsuario(dadosUsuario);
            setAgendamentos(listaAgendamentos);
        } catch (error) {
            console.error("Erro ao carregar dados iniciais:", error);
        } finally {
            setCarregando(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate("/");
    };

    const formatDateTime = (isoString: string) => {
        try {
            const date = new Date(isoString);
            return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
        } catch {
            return isoString;
        }
    };

    const agendamentosFiltrados = agendamentos.filter((appt) => {

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

        return matchesStatus && matchesPeriod;
    });

    if (carregando) {
        return (
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <div className="container py-5 text-center flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                    <p className="mt-2 text-muted">Carregando seus dados...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!usuario) {
        return (
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <div className="container py-5 text-center flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                    <p className="text-danger">Não foi possível carregar as informações do usuário.</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="container py-5 flex-grow-1">
                <h1 className="cormorant-garamond-font mb-4">Minha Conta</h1>

                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0 rounded-4 text-center p-4">
                            <div className="position-relative mx-auto mb-3" style={{ width: "120px", height: "120px" }}>
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.name)}&background=4F694F&color=fff&bold=true&size=128`}
                                    alt="Foto de perfil"
                                    className="rounded-circle img-fluid w-100 h-100 object-fit-cover shadow-sm"
                                />
                            </div>
                            <h5 className="fw-semibold mb-1">{usuario.name}</h5>
                            <p className="text-muted small mb-3">{usuario.email}</p>
                            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm w-100">
                                Sair da Conta
                            </button>
                        </div>
                    </div>

                    <div className="col-md-8">
                        <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
                            <h5 className="card-title mb-3 fw-bold">Informações Pessoais</h5>
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <label className="form-label text-muted small">Nome Completo</label>
                                    <input type="text" className="form-control" value={usuario.name} readOnly />
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label text-muted small">Telefone</label>
                                    <input type="text" className="form-control" value={usuario.phone} readOnly />
                                </div>
                                <div className="col-12">
                                    <label className="form-label text-muted small">E-mail</label>
                                    <input type="email" className="form-control" value={usuario.email} readOnly />
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-sm border-0 rounded-4 p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="card-title mb-0 fw-bold">Meus Agendamentos</h5>
                                <button
                                    type="button"
                                    className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm"
                                    style={{ width: "36px", height: "36px", backgroundColor: "#4F694F" }}
                                    onClick={() => navigate("/solicitar-agendamento")}
                                    aria-label="Novo agendamento"
                                    title="Novo agendamento"
                                >
                                    <i className="bi bi-plus-lg"></i>
                                </button>
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


                            {agendamentosFiltrados.length === 0 ? (
                                <p className="text-muted small mb-0">Você ainda não possui agendamentos.</p>
                            ) : (
                                <div className="list-group list-group-flush">
                                    {agendamentosFiltrados.map((ag) => (
                                        <div
                                            key={ag.id}
                                            className="list-group-item d-flex justify-content-between align-items-center px-0 py-3"
                                        >
                                            <div>
                                                <h6 className="mb-1 fw-semibold">{ag.service.name}</h6>
                                                <small className="text-muted">
                                                    {formatDateTime(ag.startsAt)}
                                                </small>
                                                {ag.notes && (
                                                    <div>
                                                        <small className="text-muted fst-italic">{ag.notes}</small>
                                                    </div>
                                                )}
                                            </div>
                                            {ag.status === 'SCHEDULED' && (
                                                <span className="badge bg-info-subtle text-info border border-info-subtle px-3 py-2 rounded-pill">
                                                    Agendamento Confirmado
                                                </span>
                                            )}
                                            {ag.status === 'CANCELED' && (
                                                <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 rounded-pill">
                                                    Agendamento Cancelado
                                                </span>
                                            )}
                                            {ag.status === 'COMPLETED' && (
                                                <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill">
                                                    Agendamento Concluído
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            {/*
            {modalAberto && (
                <ModalNovoAgendamento
                    nomeUsuario={usuario.name}
                    servicos={SERVICOS_MOCK}
                    horariosOcupados={horariosOcupados}
                    onSalvar={handleSalvarAgendamento}
                    onFechar={() => setModalAberto(false)}
                />
            )}
            */}
        </div>
    );
}