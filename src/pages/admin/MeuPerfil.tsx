import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { authService } from "../../services/authService";
import { userService } from "../../services/userService";
import { Modal } from "../../components/ui/Modal";
import type { UserResponse } from "../../types/user";

export default function MeuPerfil() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState<UserResponse | null>(null);
    const [carregando, setCarregando] = useState<boolean>(true);

    // --- ESTADOS PARA O FLUXO DE EDIÇÃO ---
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editName, setEditName] = useState<string>("");
    const [editPhone, setEditPhone] = useState<string>("");
    const [editEmail, setEditEmail] = useState<string>("");
    const [salvando, setSalvando] = useState<boolean>(false);
    const [erroEdicao, setErroEdicao] = useState<string>("");
    const [sucessoEdicao, setSucessoEdicao] = useState<string>("");

    // --- ESTADOS PARA EXCLUSÃO DE CONTA ---
    const [confirmText, setConfirmText] = useState<string>("");
    const [excluindoConta, setExcluindoConta] = useState<boolean>(false);
    const [erroExclusao, setErroExclusao] = useState<string>("");

    useEffect(() => {
        loadInitialData();
    }, [navigate]);

    const loadInitialData = async () => {
        setCarregando(true);
        try {
            const dadosUsuario = await authService.getMe();
            setUsuario(dadosUsuario);

            if (dadosUsuario) {
                setEditName(dadosUsuario.name);
                setEditPhone(formatarTelefone(dadosUsuario.phone));
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

    const formatarTelefone = (valor: string): string => {
        const apenasNumeros = valor.replace(/\D/g, "").slice(0, 11);
        return apenasNumeros
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    };

    if (carregando) {
        return (
            <DashboardLayout>
                <div className="py-5 text-center d-flex flex-column justify-content-center align-items-center">
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                    <p className="mt-2 text-muted">Carregando seus dados...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!usuario) {
        return (
            <DashboardLayout>
                <div className="py-5 text-center d-flex flex-column justify-content-center align-items-center">
                    <p className="text-danger">Não foi possível carregar as informações do usuário.</p>
                </div>
            </DashboardLayout>
        );
    }

    const fraseConfirmacao = `eu, ${usuario.name}, desejo excluir minha conta`;

    return (
        <DashboardLayout>
            <h1 className="mb-4">Meu Perfil</h1>

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
                    <div className="card shadow-sm border-0 rounded-4 p-4">
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
                </div>
            </div>

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
        </DashboardLayout>
    );
}