interface ServiceCardProps {
    title: string;
    description: string;
    link: string;
    image: string;
}

export default function ServiceCard({title, description, link, image}: ServiceCardProps) {
    return (
        <div className="card border-0 rounded-4 overflow-hidden bg-body shadow-sm h-100 d-flex flex-column">
            <div className="ratio ratio-4x3 overflow-hidden">
                <img 
                    src={image} 
                    className="card-img-top w-100 h-100 object-fit-cover" 
                    alt={title} 
                />
            </div>
            
            <div className="card-body p-4 text-start d-flex flex-column justify-content-between">
                <div>
                    <h5 className="card-title cormorant-garamond-font fs-3 text-dark mb-2">{title}</h5>
                    <p className="card-text text-muted small mb-3">
                        {description}
                    </p>
                </div>
                <a href={link} className="text-decoration-none text-success text-uppercase fw-semibold ls-2 fs-7 mt-auto">
                    Saiba mais <i className="bi bi-arrow-right-short"></i>
                </a>
            </div>
        </div>
    );
}