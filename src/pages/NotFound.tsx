import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();

    const handleGoBack = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate(-1);
    };

    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light text-center px-3">
            <div className="mb-3">
                <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '4.5rem' }}></i>
            </div>
            
            <h1 className="display-2 fw-bold text-dark mb-1">404</h1>
            <h2 className="fs-3 fw-semibold text-secondary mb-3">Página Não Encontrada</h2>
            
            <p className="text-muted mb-4" style={{ maxWidth: '400px' }}>
                Desculpe, a página que você está tentando acessar não existe ou foi movida para outro endereço.
            </p>

            <a 
                href="#/"
                onClick={handleGoBack} 
                className="text-primary text-decoration-none fw-semibold d-inline-flex align-items-center gap-2 fs-5 opacity-75 opacity-100-hover"
            >
                <i className="bi bi-arrow-left"></i>
                Voltar para a página anterior
            </a>
        </div>
    );
}
