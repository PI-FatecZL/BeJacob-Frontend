import { useState } from "react";
import Navbar from "../components/landingPage/Navbar";
import Footer from "../components/landingPage/Footer";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function MinhaConta() {
    const navigate = useNavigate();

    const [usuario] = useState({
        nome: "Usuário",
        email: "usuario@email.com",
        telefone: "(11) 99999-9999"
    });

    const handleLogout = () => {
        authService.logout();
        navigate("/");
    }

    return (
        <>
            <Navbar />
            <div className="container py-5">
                <h1 className="cormorant-garamond-font mb-4">Minha Conta</h1>

                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0 rounded-4 text-center p-4">
                            <div className="position-relative mx-auto mb-3" style={{ width: "120px", height: "120px" }}>
                                <img
                                    src="/perfil.png"
                                    alt="Foto de perfil"
                                    className="rounded-circle img-fluid w-100 h-100 object-fit-cover"
                                />
                                <button
                                    type="button"
                                    className="btn btn-warning position-absolute bottom-0 end-0 rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm"
                                    style={{ width: "36px", height: "36px" }}
                                >
                                    <i className="bi bi-camera-fill fs-6"></i>
                                </button>
                            </div>
                            <h5 className="fw-semibold mb-1">{usuario.nome}</h5>
                            <p className="text-muted small mb-3">{usuario.email}</p>
                            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm w-100">
                                Sair da Conta
                            </button>
                        </div>
                    </div>

                    {/* Informações Pessoais e Histórico */}
                    <div className="col-md-8">
                        {/* Dados Cadastrais */}
                        <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
                            <h5 className="card-title mb-3 fw-bold">Informações Pessoais</h5>
                            <div className="row g-3">
                                <div className="col-sm-6">
                                    <label className="form-label text-muted small">Nome Completo</label>
                                    <input type="text" className="form-control" value={usuario.nome} readOnly />
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label text-muted small">Telefone</label>
                                    <input type="text" className="form-control" value={usuario.telefone} readOnly />
                                </div>
                                <div className="col-12">
                                    <label className="form-label text-muted small">E-mail</label>
                                    <input type="email" className="form-control" value={usuario.email} readOnly />
                                </div>
                            </div>
                        </div>

                        {/* Agendamentos */}
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
        </>
    );
}