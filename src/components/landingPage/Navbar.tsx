import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

export default function Navbar() {
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
    );
}