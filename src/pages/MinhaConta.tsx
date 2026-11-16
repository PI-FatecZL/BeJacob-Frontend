import { useEffect, useState } from "react";
import Navbar from "../components/landingPage/Navbar";
import Footer from "../components/landingPage/Footer";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import type { UserResponse } from "../types/user";
import type { AppointmentResponse } from "../types/appointment";
import { appointmentService } from "../services/appointmentService";
import Select from "../components/form/Select";
import { userService } from "../services/userService";
import { Modal } from "../components/ui/Modal";

export default function MinhaConta() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState<UserResponse | null>(null);
    const [carregando, setCarregando] = useState<boolean>(true);

    const [agendamentos, setAgendamentos] = useState<AppointmentResponse[]>([]);

    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [periodFilter, setPeriodFilter] = useState<string>('ALL');

    // --- NOVOS ESTADOS PARA O FLUXO DE EDIÇÃO ---
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editName, setEditName] = useState<string>("");
    const [editPhone, setEditPhone] = useState<string>("");
    const [editEmail, setEditEmail] = useState<string>("");
    const [salvando, setSalvando] = useState<boolean>(false);
    const [erroEdicao, setErroEdicao] = useState<string>("");
    const [sucessoEdicao, setSucessoEdicao] = useState<string>("")
    const [confirmText, setConfirmText] = useState<string>("");
    const [excluindoConta, setExcluindoConta] = useState<boolean>(false);
    const [erroExclusao, setErroExclusao] = useState<string>("");

    useEffect(() => {
        loadInitialData();
    }, [navigate]);

    const loadInitialData = async () => {
        setCarregando(true);
        try {
            const [dadosUsuario, dadosAgendamentos] = await Promise.all([
                authService.getMe(),
                appointmentService.listMyAppointments()
            ]);

            const typedAgendamentos = dadosAgendamentos as any;
            const listaAgendamentos = Array.isArray(typedAgendamentos)
                ? typedAgendamentos
                : typedAgendamentos?.content || [];

            setUsuario(dadosUsuario);
            setAgendamentos(listaAgendamentos);

            // Inicializa os estados de edição com os dados que vieram do banco
            if (dadosUsuario) {
                setEditName(dadosUsuario.name);
                setEditPhone(formatarTelefone(dadosUsuario.phone));;
                setEditEmail(dadosUsuario.email);
            }
        } catch (error) {
            console.error("Erro ao carregar dados iniciais:", error);
        } finally {
            setCarregando(false);
        }
    };

    const handleStartEditing = () => {
        if (usuario) {
            setEditName(usuario.name);
            setEditPhone(formatarTelefone(usuario.phone));
            setEditEmail(usuario.email);
        }
        setErroEdicao("");
        setIsEditing(true);
    };

    // Cancela as alterações e fecha o formulário
    const handleCancelEditing = () => {
        setIsEditing(false);
        setErroEdicao("");
    };

    const handleSaveProfile = async () => {
        if (!editName.trim() || !editEmail.trim()) {
            setErroEdicao("Nome e E-mail são obrigatórios.");
            return;
        }

        setSalvando(true);
        setErroEdicao("");
        setSucessoEdicao("");

        const telefoneApenasNumeros = editPhone.replace(/\D/g, "");

        try {
            const emailFoiAlterado = editEmail.trim().toLowerCase() !== usuario?.email.trim().toLowerCase();

            // Chamando o método unificado do serviço de autenticação
            const dadosAtualizados = await authService.updateMe({
                name: editName,
                phone: telefoneApenasNumeros,
                email: editEmail
            });

            if (emailFoiAlterado) {
                setSucessoEdicao("E-mail alterado com sucesso! Redirecionando para o login em instantes...");
                setIsEditing(false);

                setTimeout(() => {
                    authService.logout();
                    navigate("/login");
                }, 3500);

                return;
            }

            setUsuario(dadosAtualizados);
            setIsEditing(false);
        } catch (error) {
            console.error("Erro ao atualizar dados do perfil:", error);
            setErroEdicao("Não foi possível salvar as alterações. Verifique os dados inseridos.");
        } finally {
            setSalvando(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate("/");
    };

    const handleDeleteAccount = async () => {
        if (!usuario || confirmText !== fraseConfirmacao) return;

        setExcluindoConta(true);
        setErroExclusao("");

        try {
            await userService.delete(usuario.id);

            // Fecha o modal do Bootstrap antes de redirecionar
            const modalElement = document.getElementById("modalExcluirConta");
            const closeBtn = modalElement?.querySelector<HTMLButtonElement>('[data-bs-dismiss="modal"]');
            closeBtn?.click();

            authService.logout();
            navigate("/");
        } catch (error: any) {
            console.error("Erro ao excluir conta:", error);
            if (error?.response?.status === 409) {
                setErroExclusao("Você possui agendamentos futuros pendentes. Cancele-os antes de excluir sua conta.");
            } else {
                setErroExclusao("Não foi possível excluir sua conta no momento. Tente novamente.");
            }
        } finally {
            setExcluindoConta(false);
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

    const formatarTelefone = (valor: string): string => {
        const apenasNumeros = valor.replace(/\D/g, "").slice(0, 11);
        return apenasNumeros
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
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

    const fraseConfirmacao = `eu, ${usuario.name}, desejo excluir minha conta`;

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

                            <div className="d-grid gap-2">
                                <button
                                    type="button"
                                    onClick={() => navigate("/alterar-senha")}
                                    className="btn btn-outline-secondary btn-sm"
                                >
                                    <i className="bi bi-key me-1"></i> Alterar Senha
                                </button>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="btn btn-outline-danger btn-sm"
                                >
                                    <i className="bi bi-box-arrow-right me-1"></i> Sair da Conta
                                </button>
                            </div>

                            <hr className="my-3 text-muted opacity-25" />

                            <button
                                type="button"
                                className="btn btn-link text-danger text-decoration-none btn-sm p-0"
                                data-bs-toggle="modal"
                                data-bs-target="#modalExcluirConta"
                                onClick={() => {
                                    setConfirmText("");
                                    setErroExclusao("");
                                }}
                            >
                                <i className="bi bi-trash me-1"></i> Excluir minha conta
                            </button>
                        </div>
                    </div>

                    <div className="col-md-8">
                        <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="card-title mb-0 fw-bold">Informações Pessoais</h5>

                                {!isEditing ? (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={handleStartEditing}
                                    >
                                        <i className="bi bi-pencil me-1"></i> Alterar Dados
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={handleCancelEditing}
                                        disabled={salvando}
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>

                            {erroEdicao && <div className="alert alert-danger py-2 small mb-3">{erroEdicao}</div>}

                            {/* Se o seu componente <Alert /> aceitar uma prop de variante/tipo (ex: tipo="success"), você pode usá-lo. 
    Caso contrário, usamos a estrutura padrão do Bootstrap para mensagens verdes de sucesso: */}
                            {sucessoEdicao && (
                                <div className="alert alert-success py-2 small mb-3 d-flex align-items-center gap-2">
                                    <i className="bi bi-check-circle-fill"></i>
                                    <span>{sucessoEdicao}</span>
                                </div>
                            )}

                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <label className="form-label text-muted small">Nome Completo</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={isEditing ? editName : usuario.name}
                                        onChange={(e) => setEditName(e.target.value)}
                                        readOnly={!isEditing}
                                    />
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label text-muted small">Telefone</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={isEditing ? editPhone : formatarTelefone(usuario.phone)}
                                        onChange={(e) => setEditPhone(formatarTelefone(e.target.value))}
                                        readOnly={!isEditing}
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label text-muted small">E-mail</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={isEditing ? editEmail : usuario.email}
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        readOnly={!isEditing}
                                    />
                                </div>
                            </div>

                            {/* Exibe o botão de salvar apenas quando estiver editando */}
                            {isEditing && (
                                <div className="d-flex justify-content-end mt-3">
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm px-4"
                                        onClick={handleSaveProfile}
                                        disabled={salvando}
                                    >
                                        {salvando ? "Salvando..." : "Salvar Alterações"}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="card shadow-sm border-0 rounded-4 p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="card-title mb-0 fw-bold">Meus Agendamentos</h5>

                                <button
                                    type="button"
                                    className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
                                    onClick={() => navigate("/solicitar-agendamento")}
                                    aria-label="Novo agendamento"
                                    title="Novo agendamento"
                                    style={{ width: "35px", height: "35px", padding: 0 }}
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

            <Modal id="modalExcluirConta" title="Excluir Conta">
                <div>
                    {erroExclusao && (
                        <div className="alert alert-danger py-2 small mb-3">
                            {erroExclusao}
                        </div>
                    )}

                    <p className="text-muted mb-3">
                        Esta ação excluirá permanentemente o seu acesso e histórico na plataforma.
                        Para confirmar, digite <strong>{fraseConfirmacao}</strong> no campo abaixo:
                    </p>

                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder=""
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        disabled={excluindoConta}
                    />

                    <div className="d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            data-bs-dismiss="modal"
                            disabled={excluindoConta}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={handleDeleteAccount}
                            disabled={confirmText !== fraseConfirmacao || excluindoConta}
                        >
                            {excluindoConta ? "Excluindo..." : "Confirmar Exclusão"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}