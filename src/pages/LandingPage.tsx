import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import ServiceCard from "../components/ServiceCard";
import Footer from "../components/Footer";

export default function LandingPage() {
    const services = [
        {
            id: 1,
            title: "Micropigmentação Labial",
            description:
                "Técnicas avançadas para devolver simetria, cor natural e harmonia aos lábios.",
            link: "#"
        },
        {
            id: 2,
            title: "Micropigmentação de Sobrancelhas",
            description:
                "Realce o formato das sobrancelhas com técnicas personalizadas e naturais.",
            link: "#"
        },
        {
            id: 3,
            title: "Design de Sobrancelhas",
            description:
                "Design personalizado para valorizar a simetria e a harmonia do rosto.",
            link: "#"
        },
        {
            id: 4,
            title: "Lash Lifting",
            description:
                "Realce os cílios naturais proporcionando curvatura e definição.",
            link: "#"
        },
        {
            id: 5,
            title: "Henna",
            description:
                "Técnica para preencher e definir as sobrancelhas de maneira natural.",
            link: "#"
        }
    ];

    const [servicesPerSlide, setServicesPerSlide] = useState(3);

    useEffect(() => {
        const updateServicesPerSlide = () => {
            if (window.innerWidth < 768) {
                setServicesPerSlide(1);
            } else if (window.innerWidth < 992) {
                setServicesPerSlide(2);
            } else {
                setServicesPerSlide(3);
            }
        };

        updateServicesPerSlide();

        window.addEventListener("resize", updateServicesPerSlide);

        return () => {
            window.removeEventListener("resize", updateServicesPerSlide);
        };
    }, []);

    const serviceGroups = [];

    for (let i = 0; i < services.length; i += servicesPerSlide) {
        serviceGroups.push(
            services.slice(i, i + servicesPerSlide)
        );
    }

    return (
        <>
            <Hero />
            <section id="sobre" className="container mt-5">
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
                        <img src="https://placehold.co/600x400" className="rounded-4" alt="" />
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
                        <img src="https://placehold.co/600x400" className="rounded-4 img-fluid" alt="" />
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
                    <div
                        id="servicesCarousel"
                        className="carousel slide services-carousel"
                        data-bs-ride="carousel"
                    >

                        <div className="carousel-inner">

                            {serviceGroups.map((group, index) => (

                                <div
                                    key={index}
                                    className={`carousel-item ${index === 0 ? "active" : ""
                                        }`}
                                >

                                    <div className="row align-items-stretch justify-content-center">

                                        {group.map((service) => (

                                            <div
                                                key={service.id}
                                                className="col-12 col-md-6 col-lg-3"
                                            >

                                                <ServiceCard
                                                    title={service.title}
                                                    description={service.description}
                                                    link={service.link}
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
                            data-bs-target="#servicesCarousel"
                            data-bs-slide="prev"
                        >
                            <i className="bi bi-arrow-left fs-3"></i>
                        </button>

                        <button
                            className="carousel-control-next services-control services-control-next"
                            type="button"
                            data-bs-target="#servicesCarousel"
                            data-bs-slide="next"
                        >
                            <i className="bi bi-arrow-right fs-3"></i>
                        </button>

                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}