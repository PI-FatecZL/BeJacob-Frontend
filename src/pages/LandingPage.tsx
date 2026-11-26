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
            title: "Volume Luxo (Russo Tecnológico)",
            description: "Técnica volumosa impactante com múltiplos fios leves, ideal para quem busca cílios cheios e expressivos, sem perder a leveza. Perfeito para clientes que gostam de destaque e sofisticação no olhar.",
            price: "R$ 160,00",
            duration: "1h a 2h",
            maintenance: "R$ 120,00 até 25 dias",
            image: "/servicos/volume-russo.webp"
        },
        {
            id: 2,
            title: "Brasileiro",
            description: "Os Cílios em Y, são ideais para construir volume moderado na extensão de cílios, nem exagerado, nem tão discreto, o ideal para quem deseja um visual mais equilibrado.",
            price: "R$ 120,00",
            duration: "1h a 2h",
            maintenance: "R$ 90,00 até 20 dias",
            image: "/servicos/brasileiro.webp"
        },
        {
            id: 3,
            title: "Fox Eyes",
            description: "Técnica com fios alongados no canto externo, criando um efeito de olhar puxado e elegante. Realça a expressão com sensualidade e definição, perfeito para quem busca um estilo marcante e moderno.",
            price: "R$ 160,00",
            duration: "1h a 2h",
            maintenance: "R$ 120,00 até 25 dias",
            image: "/servicos/fox-eyes.webp"
        },
        {
            id: 4,
            title: "Volume Egípcio",
            description: "Alongamento com efeito arqueado, que levanta o olhar e valoriza os cílios externos. Traz um resultado sensual, elegante e marcante, ideal para clientes que buscam um olhar mais poderoso e definido.",
            price: "R$ 140,00",
            duration: "1h a 2h",
            maintenance: "R$ 110,00 até 25 dias",
            image: "/servicos/volume-egipcio.webp"
        },
        {
            id: 5,
            title: "Fio a Fio",
            description: "Uma técnica delicada e natural para os seus olhos, personalizável e duradoura, essa técnica garante conforto e beleza, realçando o olhar de forma sutil e discreta. Ideal para quem deseja cílios mais definidos sem exagero!",
            price: "R$ 120,00",
            duration: "1h a 2h",
            maintenance: "R$ 90,00 até 15 dias",
            image: "/servicos/fio-a-fio.webp"
        },
        {
            id: 6,
            title: "Efeito Sirena",
            description: "O efeito Sirena é uma técnica que alonga e valoriza o formato dos olhos, criando um visual sofisticado, leve e cheio de personalidade. Sua principal característica é o início dos cílios menos preenchidos, proporcionando uma transição delicada e um efeito mais alongado e misterioso ao olhar.",
            price: "R$ 120,00",
            duration: "1h a 2h",
            maintenance: "Sem manutenção",
            image: "/servicos/efeito-sirena.webp"
        },
        {
            id: 7,
            title: "Efeito Malibu",
            description: "É a escolha perfeita para quem deseja um olhar mais destacado e moderno. Com um acabamento sofisticado, essa técnica com dois tipos de fios entrega um resultado marcante na medida certa, valorizando a beleza com um toque charmoso, único e cheio de personalidade.",
            price: "R$ 160,00",
            duration: "1h a 2h",
            maintenance: "R$ 120,00 até 20 dias",
            image: "/servicos/efeito-malibu.webp"
        },
        {
            id: 8,
            title: "Mangá Lashes",
            description: "O Mangá Lashes é uma técnica inspirada no olhar das personagens dos animes, criando um efeito marcante, delicado e cheio de personalidade. O resultado é um olhar expressivo, moderno e encantador, com um acabamento único que destaca os olhos de forma leve e sofisticada.",
            price: "R$ 150,00",
            duration: "1h a 2h",
            maintenance: "R$ 100,00 até 20 dias",
            image: "/servicos/manga-lashes.webp"
        },
        {
            id: 9,
            title: "Design Simples",
            description: "É a remodelação do desenho natural das sobrancelhas para valorizar o olhar e o rosto. A famosa “limpeza”, com visagismo.",
            price: "R$ 30,00",
            duration: "20 min",
            maintenance: "Quando necessário",
            image: "/servicos/design-simples.webp"
        },
        {
            id: 10,
            title: "Design com Henna",
            description: "É uma técnica que combina a modelagem das sobrancelhas com a aplicação de henna, para preencher falhas, realçar os fios e definir o formato. O objetivo é valorizar o olhar e trazer mais definição e harmonia ao rosto",
            price: "R$ 40,00",
            duration: "40 min",
            maintenance: "Quando necessário",
            image: "/servicos/henna.webp"
        },
        {
            id: 11,
            title: "Micropigmentação Shadow Makeup",
            description: "Procedimento que corrige falhas, realça o formato natural e proporciona mais definição e simetria ao olhar. O resultado é elegante, duradouro e personalizado, trazendo praticidade para o dia a dia e reduzindo a necessidade de maquiagem. Efeito Esfumado.",
            price: "R$ 300,00",
            duration: "1h a 2h",
            maintenance: "1 a 2 anos",
            image: "/servicos/micropigmentacao-shadow.webp"
        },
        {
            id: 12,
            title: "Micropigmentação Fio a Fio",
            description: "Procedimento que corrige falhas, realça o formato natural e proporciona mais definição e simetria ao olhar. O resultado é elegante, duradouro e personalizado, trazendo praticidade para o dia a dia. A Fio a Fio imita fios naturais, mais indicado para quem tem poucas falhas para que o fio artístico se mescle ao fio natural.",
            price: "R$ 300,00",
            duration: "1h a 2h",
            maintenance: "8 meses a 1 ano e meio",
            image: "/servicos/micropigmentacao-fio-a-fio.webp"
        },
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

    const mobileGroups = chunkServices(services, 1);
    const tabletGroups = chunkServices(services, 2);
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