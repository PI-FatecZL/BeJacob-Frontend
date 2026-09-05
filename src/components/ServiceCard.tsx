interface ServiceCardProps {
    title: string;
    description: string;
    link: string;
}

export default function ServiceCard({title, description, link}: ServiceCardProps) {
    return (
        <div className="card border-0 rounded-4 overflow-hidden bg-body shadow-sm h-100">
            <img src="https://placehold.co/600x400" className="card-img-top img-fluid" alt={title} />
            <div className="card-body p-4 text-start">
                <h5 className="card-title cormorant-garamond-font fs-3 text-dark">{title}</h5>
                <p className="card-text text-muted small text-truncate">
                    {description}
                </p>
                <a href={link} className="text-decoration-none text-success text-uppercase fw-semibold ls-2 fs-7">
                    Saiba mais <i className="bi bi-arrow-right-short"></i>
                </a>
            </div>
        </div>
    );
}