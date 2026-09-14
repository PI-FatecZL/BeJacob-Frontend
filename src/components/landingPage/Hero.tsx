import Navbar from "./Navbar";

export default function Hero() {
    return(
        <header className="hero-section d-flex flex-column justify-content-between pb-5">
            <Navbar />

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