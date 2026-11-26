export default function Footer() {
    return (
        <footer className="bg-info text-light pt-5 pb-4">
            <div className="container">
                {/* Adicionei justify-content-between e g-4 para espaçamento uniforme */}
                <div className="row justify-content-between g-4 pb-4">
                    
                    {/* Coluna da Marca */}
                    <div className="col-12 col-lg-5">
                        <h2 className="cormorant-garamond-font fs-3 fst-italic fw-normal mb-3">
                            Be Jacob
                        </h2>

                        <p className="small text-white-50 mb-3" style={{ maxWidth: "300px" }}>
                            Um refúgio dedicado ao realce da sua beleza natural
                            através de técnicas estéticas avançadas,
                            biossegurança rigorosa e atendimento humanizado
                            por Beatriz Jacob.
                        </p>

                        <div className="d-flex gap-2">
                            <a
                                href="https://www.instagram.com/bejacob.beauty/"
                                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center text-decoration-none"
                                style={{
                                    width: "32px",
                                    height: "32px"
                                }}
                                aria-label="Instagram"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <i className="bi bi-instagram"></i>
                            </a>

                            <a
                                href="https://wa.me/5511977229823?text=Ol%C3%A1%21%20Gostaria%20de%20solicitar%20um%20agendamento"
                                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center text-decoration-none"
                                style={{
                                    width: "32px",
                                    height: "32px"
                                }}
                                aria-label="WhatsApp"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <i className="bi bi-whatsapp"></i>
                            </a>
                        </div>
                    </div>

                    {/* Coluna do Menu */}
                    <div className="col-6 col-md-auto">
                        <h6
                            className="text-uppercase fw-semibold mb-3"
                            style={{
                                color: "#b49a58",
                                letterSpacing: "1px"
                            }}
                        >
                            Menu
                        </h6>

                        <ul className="list-unstyled mb-0">
                            <li className="mb-2">
                                <a
                                    href="#sobre"
                                    className="text-white-50 text-decoration-none small"
                                >
                                    Sobre o Espaço
                                </a>
                            </li>

                            <li className="mb-2">
                                <a
                                    href="#servicos"
                                    className="text-white-50 text-decoration-none small"
                                >
                                    Nossos Serviços
                                </a>
                            </li>

                            <li className="mb-2">
                                <a
                                    href="#galeria"
                                    className="text-white-50 text-decoration-none small"
                                >
                                    Galeria
                                </a>
                            </li>

                            <li>
                                <a
                                    href="#contato"
                                    className="text-white-50 text-decoration-none small"
                                >
                                    Contato
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Coluna de Atendimento */}
                    <div className="col-12 col-md-auto">
                        <h6
                            className="text-uppercase fw-semibold mb-3"
                            style={{
                                color: "#b49a58",
                                letterSpacing: "1px"
                            }}
                        >
                            Atendimento
                        </h6>

                        <div className="d-flex gap-2 mb-3">
                            <i
                                className="bi bi-geo-alt"
                                style={{ color: "#b49a58" }}
                            ></i>

                            <span className="small text-white-50">
                                Rua Torre da Lapela 267
                                <br />
                                Guaianases, São Paulo — SP
                            </span>
                        </div>

                        <div className="d-flex gap-2 mb-3">
                            <i
                                className="bi bi-telephone"
                                style={{ color: "#b49a58" }}
                            ></i>

                            <a
                                href="tel:+5511977229823"
                                className="small text-white-50 text-decoration-none"
                            >
                                +55 (11) 97722-9823
                            </a>
                        </div>

                        <div className="d-flex gap-2">
                            <i
                                className="bi bi-envelope"
                                style={{ color: "#b49a58" }}
                            ></i>

                            <a
                                href="mailto:bejacobfaedda@hotmail.com"
                                className="small text-white-50 text-decoration-none"
                            >
                                bejacobfaedda@hotmail.com
                            </a>
                        </div>
                    </div>
                </div>

                <hr className="border-secondary opacity-25 my-4" />

                <div className="row align-items-center">
                    <div className="col-12 col-md-6">
                        <p className="small text-white-50 mb-0">
                            © 2026 Be Jacob Beauty Studio.
                            Todos os direitos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
