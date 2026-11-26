import { useState } from "react";
import Hero from "../components/landingPage/Hero";
import ServiceCard from "../components/landingPage/ServiceCard";
import Footer from "../components/landingPage/Footer";
import { useNavigate } from "react-router-dom";
import { Modal } from "../components/ui/Modal";

export default function LandingPage() {
    const services = [
        {
            id: 1,
            title: "Micropigmentação Labial",
            description: "Técnicas avançadas para devolver simetria, cor natural e harmonia aos lábios.",
            price: "R$ 450,00",
            duration: "2h 30min",
            maintenance: "30 a 45 dias",
            image: "/galeria/img-galeria4.webp"
        },
        {
            id: 2,
            title: "Micropigmentação de Sobrancelhas",
            description:
                "Realce o formato das sobrancelhas com técnicas personalizadas e naturais.",
            price: "R$ 450,00",
            duration: "2h 30min",
            maintenance: "30 a 45 dias",
            image: "/galeria/img-galeria3.webp"
        },
        {
            id: 3,
            title: "Design de Sobrancelhas",
            description:
                "Design personalizado para valorizar a simetria e a harmonia do rosto.",
            price: "R$ 450,00",
            duration: "2h 30min",
            maintenance: "30 a 45 dias",
            image: "/galeria/img-galeria2.webp"
        },
        {
            id: 4,
            title: "Lash Lifting",
            description:
                "Realce os cílios naturais proporcionando curvatura e definição.",
            price: "R$ 450,00",
            duration: "2h 30min",
            maintenance: "30 a 45 dias",
            image: "/galeria/img-galeria1.webp"
        },
        {
            id: 5,
            title: "Henna",
            description:
                "Técnica para preencher e definir as sobrancelhas de maneira natural.",
            price: "R$ 450,00",
            duration: "2h 30min",
            maintenance: "30 a 45 dias",
            image: "/galeria/img-galeria2.webp"
        },
        {
            id: 6,
            title: "Extensão de cílios",
            description:
                "Técnica para preencher e definir os cílios de maneira natural.",
            price: "R$ 450,00",
            duration: "2h 30min",
            maintenance: "30 a 45 dias",
            image: "/galeria/img-galeria3.webp"
        }
    ];

    const [selectedService, setSelectedService] = useState<any>(null);

    const navigate = useNavigate();

    const chunkServices = (arr: any[], size: number) => {
        const groups = [];
        for (let i = 0; i < arr.length; i += size) {
            groups.push(arr.slice(i, i + size));
        }
        return groups;
    };

    const mobileGroups = chunkServices(services, 1);  // 1 card por slide (< 768px)
    const tabletGroups = chunkServices(services, 2);  // 2 cards por slide (768px a 991px)
    const desktopGroups = chunkServices(services, 3);

    const renderCarousel = (id: string, groups: any[][], colClass: string, wrapperClass: string) => (
        <div id={id} className={`carousel slide services-carousel ${wrapperClass}`} data-bs-ride="carousel">
            <div className="carousel-inner py-2">
                {groups.map((group, index) => (
                    <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                        <div className="row g-4 align-items-stretch justify-content-center">
                            {group.map((service) => (
                                <div key={service.id} className={`${colClass} d-flex`}>
                                    <ServiceCard
                                        title={service.title}
                                        description={service.description}
                                        image={service.image}
                                        onOpenModal={() => setSelectedService(service)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button
                className="carousel-control-prev services-control services-control-prev"
                type="button"
                data-bs-target={`#${id}`}
                data-bs-slide="prev"
            >
                <i className="bi bi-arrow-left fs-3"></i>
            </button>

            <button
                className="carousel-control-next services-control services-control-next"
                type="button"
                data-bs-target={`#${id}`}
                data-bs-slide="next"
            >
                <i className="bi bi-arrow-right fs-3"></i>
            </button>
        </div>
    );

    return (
        <>
            <Hero />

            <section id="sobre" className="container mb-5 py-5 mt-5">
                <div className="row align-items-center mb-4">
                    <div className="col-12 col-md-6">
                        <p className="small text-uppercase mb-2 fw-semibold ls-2">Sobre o Espaço</p>
                        <h1 className="cormorant-garamond-font display-4">Conheça o Be Jacob Beauty Studio</h1>
                        <p className="text-justify">Localizado em um cenário singular que une a sofisticação do design contemporâneo ao calor da alma brasileira,
                            nosso studio foi projetado para acolher rituais memoráveis de beleza e bem-estar. Com uma atmosfera minimalista,
                            acolhedora e integrada ao conforto, proporcionamos o cenário ideal para quem busca um atendimento exclusivo e
                            personalizado. Cada detalhe do ambiente foi pensado para oferecer uma experiência relaxante, onde a biossegurança
                            e a alta tecnologia em estética não invasiva se encontram para transformar o seu momento de autocuidado em algo único.</p>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="ratio ratio-4x3">
                            <img src="https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="rounded-4 img-fluid w-100 object-fit-cover overflow-hidden shadow-lg" alt="" />
                        </div>
                    </div>
                </div>
                <div className="row align-items-center">
                    <div className="col-12 col-md-6">
                        <p className="small text-uppercase mb-2 fw-semibold ls-2">Sobre a Profissional</p>
                        <h1 className="cormorant-garamond-font display-4">Prazer, Beatriz Jacob</h1>
                        <p className="text-justify">Há mais de 6 anos, dedico a minha vida à estética não invasiva e ao realce da beleza natural. Para mim,
                            cada atendimento é único: combino sensibilidade e precisão técnica para entregar resultados harmônicos que respeitam
                            a sua individualidade. Sou especialista em técnicas avançadas como Micropigmentação (labial e de sobrancelhas),
                            Lash Lifting, Brow Lamination e Extensão de Cílios. Minha filosofia de trabalho prioriza a flexibilidade, o atendimento
                            humanizado e o compromisso inegociável de traduzir a sua identidade e autoestima em um olhar marcante.</p>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="ratio ratio-4x3">
                            <img src="/galeria/perfil.webp" className="rounded-4 img-fluid w-100 object-fit-cover overflow-hidden shadow-lg" alt="" />
                        </div>
                    </div>
                </div>
            </section>

            <section id="servicos" className="mt-5 bg-success py-5">
                <div className="container text-center mb-3">
                    <div className="d-flex align-items-center justify-content-center gap-3 text-white">
                        <div className="border-bottom border-white border-opacity-75 flex-grow-1" style={{ maxWidth: '120px' }}></div>

                        <p className="text-uppercase fs-7 fw-semibold m-0 text-nowrap" style={{ letterSpacing: '2px' }}>
                            Conheça agora
                        </p>

                        <div className="border-bottom border-white border-opacity-75 flex-grow-1" style={{ maxWidth: '120px' }}></div>
                    </div>

                    <h2 className="cormorant-garamond-font display-4 text-white text-uppercase mb-3">Nossos Serviços</h2>

                    <p className="text-white">Explore tratamentos pensados para revelar a sua melhor versão. Unimos precisão técnica, segurança e acolhimento em uma verdadeira experiência sensorial.</p>
                </div>

                <div className="container">
                    {renderCarousel("servicesCarouselMobile", mobileGroups, "col-12", "d-block d-md-none")}

                    {renderCarousel("servicesCarouselTablet", tabletGroups, "col-md-6", "d-none d-md-block d-lg-none")}

                    {renderCarousel("servicesCarouselDesktop", desktopGroups, "col-lg-4", "d-none d-lg-block")}
                </div>
            </section>

            <section id="galeria" className="mt-5 py-5">
                <div className="container text-center mb-3">
                    <div className="d-flex align-items-center justify-content-center gap-3">
                        <div className="border-bottom border-dark border-opacity-75 flex-grow-1" style={{ maxWidth: '120px' }}></div>

                        <p className="text-uppercase fs-7 fw-semibold m-0 text-nowrap" style={{ letterSpacing: '2px' }}>
                            Galeria
                        </p>

                        <div className="border-bottom border-dark border-opacity-75 flex-grow-1" style={{ maxWidth: '120px' }}></div>
                    </div>

                    <h2 className="cormorant-garamond-font display-4 text-uppercase mb-3">Nossos Clientes</h2>

                    <p className="">Resultados reais, cuidadosamente registrados para mostrar a beleza natural que revelamos em cada atendimento.</p>
                </div>
                <div className="container">
                    <div className="row g-4 text-start align-items-center">
                        <div className="col-md-6">
                            <div id="carrosselEsquerdo" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="10000">
                                <div className="carousel-inner ratio ratio-4x3 overflow-hidden rounded-4 shadow-sm">
                                    <div className="carousel-item active">
                                        <img src="/galeria/img-galeria1.webp" alt="Resultado Labial 1" className="d-block w-100 h-100 object-fit-cover" />
                                    </div>

                                    <div className="carousel-item">
                                        <img src="/galeria/img-galeria2.webp" alt="Resultado Labial 2" className="d-block w-100 h-100 object-fit-cover" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="row g-4">
                                <div className="col-12">
                                    <div id="carrosselDireitoSuperior" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="10000">
                                        <div className="carousel-inner ratio ratio-21x9 overflow-hidden rounded-4 shadow-sm">
                                            <div className="carousel-item active">
                                                <img src="/galeria/img-galeria3.webp" alt="Sobrancelhas 1" className="d-block w-100 h-100 object-fit-cover" />
                                            </div>

                                            <div className="carousel-item">
                                                <img src="/galeria/img-galeria4.webp" alt="Sobrancelhas 2" className="d-block w-100 h-100 object-fit-cover" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div id="carrosselDireitoInferior" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="10000">
                                        <div className="carousel-inner ratio ratio-21x9 overflow-hidden rounded-4 shadow-sm">
                                            <div className="carousel-item active">
                                                <img src="/galeria/img-galeria2.webp" alt="Estética Facial 1" className="d-block w-100 h-100 object-fit-cover" />
                                            </div>

                                            <div className="carousel-item">
                                                <img src="/galeria/img-galeria1.webp" alt="Estética Facial 2" className="d-block w-100 h-100 object-fit-cover" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

            <section id="contato" className="container mb-5 py-5 mt-5">
                <div className="row align-items-center">
                    <div className="col-12 col-md-6">
                        <p className="small text-uppercase mb-2 fw-semibold ls-2">Contato</p>

                        <h1 className="cormorant-garamond-font display-4">Agende um serviço</h1>

                        <p className="text-justify">
                            Vivencie o equilíbrio perfeito entre sofisticação, bem-estar e exclusividade.
                            Nossa atmosfera minimalista e acolhedora foi planejada para oferecer um atendimento sob medida,
                            onde cada detalhe prioriza o seu conforto e o seu ritmo. Venha desfrutar de técnicas modernas
                            e transforme a sua rotina de autocuidado em um ritual inesquecível.
                        </p>

                        <button onClick={() => navigate("/solicitar-agendamento")} className="btn btn-warning w-100 py-2 fw-semibold text-uppercase">Solicitar Agendamento</button>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="ratio ratio-4x3 overflow-hidden rounded-4 shadow-sm mt-4 mt-md-0">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.5614242943857!2d-46.40461832478901!3d-23.548271661111233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce65aa1f78acbf%3A0x5e06356e9022cc71!2sR.%20Torre%20da%20Lapela%2C%20267%20-%20Jardim%20Soares%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2008460-210!5e0!3m2!1spt-BR!2sbr!4v1788640414293!5m2!1spt-BR!2sbr"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Localização do Studio no Google Maps"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            <Modal
                id="serviceModal"
                title={selectedService?.title || "Detalhes do Serviço"}
            >
                {selectedService && (
                    <div>
                        <div className="ratio ratio-16x9 rounded-3 overflow-hidden mb-3">
                            <img
                                src={selectedService.image}
                                alt={selectedService.title}
                                className="w-100 h-100 object-fit-cover"
                            />
                        </div>

                        <p className="text-muted mb-4" style={{ textAlign: "justify" }}>
                            {selectedService.description}
                        </p>

                        <div className="row g-2 text-center mb-4">
                            <div className="col-4">
                                <div className="p-2 p-sm-3 bg-light border rounded-3 h-100 d-flex flex-column justify-content-center align-items-center">
                                    <i className="bi bi-tag text-success fs-5 mb-1"></i>
                                    <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}>
                                        Investimento
                                    </span>
                                    <span className="fw-bold text-dark small mt-1">
                                        {selectedService.price || "Sob consulta"}
                                    </span>
                                </div>
                            </div>

                            <div className="col-4">
                                <div className="p-2 p-sm-3 bg-light border rounded-3 h-100 d-flex flex-column justify-content-center align-items-center">
                                    <i className="bi bi-clock text-success fs-5 mb-1"></i>
                                    <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}>
                                        Duração
                                    </span>
                                    <span className="fw-bold text-dark small mt-1">
                                        {selectedService.duration || "A definir"}
                                    </span>
                                </div>
                            </div>

                            <div className="col-4">
                                <div className="p-2 p-sm-3 bg-light border rounded-3 h-100 d-flex flex-column justify-content-center align-items-center">
                                    <i className="bi bi-calendar-check text-success fs-5 mb-1"></i>
                                    <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}>
                                        Manutenção
                                    </span>
                                    <span className="fw-bold text-dark small mt-1">
                                        {selectedService.maintenance || "Não requer"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            data-bs-dismiss="modal"
                            onClick={() => navigate("/solicitar-agendamento")}
                            className="btn btn-warning w-100 py-2 fw-semibold text-uppercase"
                        >
                            Solicitar Agendamento
                        </button>
                    </div>
                )}
            </Modal>
        </>
    );
}