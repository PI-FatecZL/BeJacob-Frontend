import { useEffect, useState } from "react";
import Navbar from "../components/landingPage/Navbar";
import Footer from "../components/landingPage/Footer";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import type { UserResponse } from "../types/user";

export default function MinhaConta() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState<UserResponse | null>(null);
    const [carregando, setCarregando] = useState<boolean>(true);

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
                            <h5 className="card-title mb-3 fw-bold">Meus Agendamentos</h5>
                            <div className="list-group list-group-flush">
                                <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                                    <div>
                                        <h6 className="mb-1 fw-semibold">Serviço</h6>
                                        <small className="text-muted">15/10/2026 às 14:00</small>
                                    </div>
                                    <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill">
                                        Confirmado
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
