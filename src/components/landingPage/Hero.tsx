import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

export default function Hero() {
    const estaAutenticado = authService.isAuthenticated();
    const navigate = useNavigate();

    const handleAcaoBotao = () => {
        if (!estaAutenticado) {
            const elementoContato = document.getElementById("contato");
            if (elementoContato) {
                elementoContato.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            navigate("/minha-conta");
        }
    };

    return (
        <header className="hero-section d-flex flex-column justify-content-between pb-5">
            <nav className="navbar navbar-dark navbar-expand-lg pt-4">
                <div className="container">

                    <Link className="navbar-brand cormorant-garamond-font fst-italic fs-3" to="/">
                        Be Jacob
                    </Link>

                    <button
                        className="navbar-toggler border-0"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <i className="bi bi-list fs-1"></i>
                    </button>

                    <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                        <ul className="navbar-nav mb-3 mb-lg-0">
                            <li className="nav-item me-2">
                                <a className="nav-link" href="#sobre">Sobre</a>
                            </li>
                            <li className="nav-item me-2">
                                <a className="nav-link" href="#servicos">Serviços</a>
                            </li>
                            <li className="nav-item me-2">
                                <a className="nav-link" href="#galeria">Galeria</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#contato">Contato</a>
                            </li>
                        </ul>

                        {/* Botão Mobile */}
                        <div className="d-lg-none mt-3">
                            <button
                                onClick={handleAcaoBotao}
                                className="btn btn-outline-warning text-uppercase fs-7 fw-semibold w-100 py-2"
                            >
                                {estaAutenticado ? "Minha Conta" : "Agendar"}
                            </button>
                        </div>
                    </div>

                    {/* Botão Desktop */}
                    <div className="d-none d-lg-block">
                        <button
                            onClick={handleAcaoBotao}
                            className="btn btn-outline-warning text-uppercase fs-7 fw-semibold px-3 py-2"
                        >
                            {estaAutenticado ? "Minha Conta" : "Agendar"}
                        </button>
                    </div>

                </div>
            </nav>

            <div className="container my-auto text-center text-white">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">

                        <div className="d-flex align-items-center justify-content-center gap-3 mb-3 text-warning">

                            <div className="border-bottom border-warning border-opacity-75 flex-grow-1" style={{ maxWidth: '40px' }}></div>

                            <p className="text-uppercase fs-7 fw-semibold m-0 text-center text-nowrap" style={{ letterSpacing: '2px' }}>
                                Estúdio de Beleza & Bem-Estar
                            </p>

                            <div className="border-bottom border-warning border-opacity-75 flex-grow-1" style={{ maxWidth: '40px' }}></div>
                        </div>

                        <h1 className="cormorant-garamond-font display-1 fw-normal mb-4">
                            Be Jacob Beauty Studio
                        </h1>

                        <p className="fs-6 fw-light text-white-50 mx-auto mb-5">
                            Um espaço exclusivo dedicado ao cuidado personalizado, combinando técnicas modernas e atendimento sofisticado para transformar o seu visual.
                        </p>

                        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                            <a href="#servicos" className="btn btn-warning btn-lg text-uppercase fs-6 fw-semibold px-4 py-3 text-primary">
                                Conheça nossos serviços
                            </a>
                            <a href="#contato" className="btn btn-outline-light btn-lg text-uppercase fs-6 fw-semibold px-4 py-3">
                                Agendar horário
                            </a>
                        </div>

                    </div>
                </div>
            </div>

            <div className="container text-center text-white-50 fs-7 fw-light">
                <span className="opacity-50">Role para explorar</span>
                <div className="mt-2 animate-bounce">↓</div>
            </div>
        </header>
    );
}