interface RequirementItemProps {
    isValid: boolean;
    text: string;
}

function RequirementItem({ isValid, text }: RequirementItemProps) {
    return (
        <div className={`d-flex align-items-center gap-2 small fw-medium mb-1 ${isValid ? "text-success" : "text-danger"}`}>
            <i className={`bi ${isValid ? "bi-check-circle-fill" : "bi-x-circle"}`}></i>
            <span>{text}</span>
        </div>
    );
}

interface PasswordRequirementsProps {
    senha: string;
}

export default function PasswordRequirements({ senha }: PasswordRequirementsProps) {
    // Regras de validação baseadas em Regex
    const temMinimoCaracteres = senha.length >= 8;
    const temMaiuscula = /[A-Z]/.test(senha);
    const temEspecial = /[^A-Za-z0-9]/.test(senha); // Qualquer caractere que não seja letra ou número

    // Se o usuário não digitou nada, não precisa poluir a tela com a lista
    if (!senha) return null;

    return (
        <div className="card bg-light border-0 p-3 mb-4 rounded-3 shadow-sm animate__animated animate__fadeIn">
            <h6 className="small fw-bold text-secondary mb-2">A senha deve conter:</h6>
            
            <RequirementItem isValid={temMinimoCaracteres} text="Pelo menos 8 caracteres" />
            <RequirementItem isValid={temMaiuscula} text="Pelo menos 1 letra maiúscula" />
            <RequirementItem isValid={temEspecial} text="Pelo menos 1 caractere especial (@, #, $, etc.)" />
        </div>
    );
}
