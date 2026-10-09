import { useEffect, useState } from "react";
import Navbar from "../components/landingPage/Navbar";
import Footer from "../components/landingPage/Footer";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import type { UserResponse } from "../types/user";
import ModalNovoAgendamento from "../components/agendamento/ModalNovoAgendamento";
import type {
    DadosAgendamento,
    ServicoOpcao,
} from "../components/agendamento/Agendamento";

interface Agendamento {
    id: number;
    servico: string;
    data: string;
    horario: string; 
    observacao: string;
    status: "Pendente" | "Confirmado";
}

// Dado mokado
const SERVICOS_MOCK: ServicoOpcao[] = [
    { id: 1, nome: "Corte Feminino", preco: 90, duracaoMinutos: 60 },
    { id: 2, nome: "Escova", preco: 60, duracaoMinutos: 45 },
    { id: 3, nome: "Manicure", preco: 35, duracaoMinutos: 40 },
    { id: 4, nome: "Design de Sobrancelha", preco: 40, duracaoMinutos: 30 },
    { id: 5, nome: "Coloração", preco: 180, duracaoMinutos: 120 },
];

// Converte data
function formatarData(iso: string): string {
    const [ano, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${ano}`;
}

export default function MinhaConta() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState<UserResponse | null>(null);
    const [carregando, setCarregando] = useState<boolean>(true);

    const [modalAberto, setModalAberto] = useState<boolean>(false);

    // Lista de agendamentos do usuário
    // integração: carregar da API em vez de estado local (começa com o exemplo que já existia)
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([
        {
            id: 1,
            servico: "Serviço",
            data: "2026-10-15",
            horario: "14:00",
            observacao: "",
            status: "Confirmado",
        },
    ]);

    useEffect(() => {
        async function carregarUsuario() {
            try {
                setCarregando(true);
                const userId = authService.getUserId();

                if (!userId) {
                    navigate("/");
                    return;
                }

                const dadosUsuario = await userService.findById(userId);
                setUsuario(dadosUsuario);
            } catch (error) {
                console.error("Erro ao buscar usuário:", error);
            } finally {
                setCarregando(false);
            }
        }

        carregarUsuario();
    }, [navigate]);

    const handleLogout = () => {
        authService.logout();
        navigate("/");
    };

    const handleSalvarAgendamento = (dados: DadosAgendamento) => {
        const novo: Agendamento = {
            id: Date.now(), 
            servico: dados.servico,
            data: dados.data,
            horario: dados.horario,
            observacao: dados.observacao,
            // todo agendamento novo começa pendente, até o salão confirmar
            status: "Pendente",
        };
        setAgendamentos((atual) => [...atual, novo]);
        setModalAberto(false);
    };

    // Horários já usados numa data, para o modal marcar como "Ocupado"
    // integração: os horários ocupados virão da API (de todos os clientes, não só deste usuário)
    const horariosOcupados = (data: string): string[] =>
        agendamentos.filter((a) => a.data === data).map((a) => a.horario);

    // 1. CORREÇÃO DE ESTRUTURA PARA TELA DE CARREGAMENTO
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

    // 2. CORREÇÃO DE ESTRUTURA PARA TELA DE ERRO
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

    // Ordena do mais próximo para o mais distante (data e depois horário)
    const agendamentosOrdenados = [...agendamentos].sort((a, b) =>
        `${a.data} ${a.horario}`.localeCompare(`${b.data} ${b.horario}`)
    );

    // 3. CORREÇÃO DE ESTRUTURA PARA TELA PRINCIPAL
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
                                    onClick={() => setModalAberto(true)}
                                    aria-label="Novo agendamento"
                                    title="Novo agendamento"
                                >
                                    <i className="bi bi-plus-lg"></i>
                                </button>
                            </div>

                            {agendamentosOrdenados.length === 0 ? (
                                <p className="text-muted small mb-0">Você ainda não possui agendamentos.</p>
                            ) : (
                                <div className="list-group list-group-flush">
                                    {agendamentosOrdenados.map((ag) => (
                                        <div
                                            key={ag.id}
                                            className="list-group-item d-flex justify-content-between align-items-center px-0 py-3"
                                        >
                                            <div>
                                                <h6 className="mb-1 fw-semibold">{ag.servico}</h6>
                                                <small className="text-muted">
                                                    {formatarData(ag.data)} às {ag.horario}
                                                </small>
                                                {ag.observacao && (
                                                    <div>
                                                        <small className="text-muted fst-italic">{ag.observacao}</small>
                                                    </div>
                                                )}
                                            </div>
                                            {/* Selo de status: verde para confirmado, amarelo para pendente */}
                                            {ag.status === "Confirmado" ? (
                                                <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill">
                                                    Confirmado
                                                </span>
                                            ) : (
                                                <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-2 rounded-pill">
                                                    Pendente
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

            {/* O modal só existe na tela enquanto modalAberto for true */}
            {modalAberto && (
                <ModalNovoAgendamento
                    nomeUsuario={usuario.name}
                    servicos={SERVICOS_MOCK}
                    horariosOcupados={horariosOcupados}
                    onSalvar={handleSalvarAgendamento}
                    onFechar={() => setModalAberto(false)}
                />
            )}

            <Footer />
        </div>
    );
}