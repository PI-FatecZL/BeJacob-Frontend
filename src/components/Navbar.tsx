export default function Navbar() {
    return (
        <nav className="navbar navbar-dark navbar-expand-lg pt-4">
            <div className="container">

                <a className="navbar-brand cormorant-garamond-font fst-italic fs-3" href="#home">
                    Be Jacob
                </a>

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
                    <ul className="navbar-nav">
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
                </div>

                <div className="d-none d-lg-block">
                    <a href="#agendar" className="btn btn-outline-warning text-uppercase fs-7 fw-semibold px-3 py-2">
                        Agendar
                    </a>
                </div>

            </div>
        </nav>
    );
}