import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/landingPage/Navbar";
import Footer from "../components/landingPage/Footer";
import FormAgendamento from "../components/agendamento/Agendamento";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import type { UserResponse } from "../types/user";

export default function SolicitarAgendamento() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState<UserResponse | null>(null);
    const [carregando, setCarregando] = useState<boolean>(true);

    // nome aparece travado no formulário
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

    // Tela de carregamento
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

    // Tela de erro, não conseguiu carregar o usuário
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
                <div className="row justify-content-center">
                    <div className="col-lg-9">
                        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                            <div className="text-white px-4 py-3" style={{ backgroundColor: "#4F694F" }}>
                                <h5 className="mb-0 fw-bold">
                                    <i className="bi bi-calendar-plus me-2"></i>
                                    Novo Agendamento
                                </h5>
                            </div>
                            <div className="p-4">
                                <FormAgendamento />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}