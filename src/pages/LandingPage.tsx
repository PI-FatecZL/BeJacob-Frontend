import Hero from "../components/Hero";

export default function LandingPage() {
    return (
        <>
            <Hero />
            <section id="sobre" className="container mt-5">
                <div className="row align-items-center mb-4">
                    <div className="col-6">
                        <p className="small text-uppercase mb-2 fw-semibold ls-2">Sobre o Espaço</p>
                        <h1 className="cormorant-garamond-font display-4">Conheça o Be Jacob Beauty Studio</h1>
                        <p className="text-justify">Localizado em um cenário singular que une a sofisticação do design contemporâneo ao calor da alma brasileira, 
                            nosso studio foi projetado para acolher rituais memoráveis de beleza e bem-estar. Com uma atmosfera minimalista, 
                            acolhedora e integrada ao conforto, proporcionamos o cenário ideal para quem busca um atendimento exclusivo e 
                            personalizado. Cada detalhe do ambiente foi pensado para oferecer uma experiência relaxante, onde a biossegurança 
                            e a alta tecnologia em estética não invasiva se encontram para transformar o seu momento de autocuidado em algo único.</p>
                    </div>
                    <div className="col-6">
                        <img src="https://placehold.co/600x400" className="rounded-4" alt="" />
                    </div>
                </div>
                <div className="row align-items-center">
                    <div className="col-6">
                        <p className="small text-uppercase mb-2 fw-semibold ls-2">Sobre a Profissional</p>
                        <h1 className="cormorant-garamond-font display-4">Prazer, Beatriz Jacob</h1>
                        <p className="text-justify">Há mais de 6 anos, dedico a minha vida à estética não invasiva e ao realce da beleza natural. Para mim, 
                            cada atendimento é único: combino sensibilidade e precisão técnica para entregar resultados harmônicos que respeitam 
                            a sua individualidade. Sou especialista em técnicas avançadas como Micropigmentação (labial e de sobrancelhas), 
                            Lash Lifting, Brow Lamination e Extensão de Cílios. Minha filosofia de trabalho prioriza a flexibilidade, o atendimento 
                            humanizado e o compromisso inegociável de traduzir a sua identidade e autoestima em um olhar marcante.</p>
                    </div>
                    <div className="col-6">
                        <img src="https://placehold.co/600x400" className="rounded-4" alt="" />
                    </div>
                </div>
            </section>
        </>
    );
}