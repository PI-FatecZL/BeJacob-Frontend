import { useState, type ChangeEvent } from "react";

interface InputSenhaProps {
  margin?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  pattern?: string;       // Adicionado para suportar a validação complexa
  errorFeedback?: string; 
}

export default function InputSenha({
  margin = "mb-3", // Diminuído um pouco para dar espaço ao checklist abaixo
  value,
  onChange,
  label = "Senha",
  placeholder,
  disabled = false,
  required = true,
  pattern,
  errorFeedback
}: InputSenhaProps) {
  const [visibilidadeSenha, setVisibilidadeSenha] = useState(false);

  const alterarVisibilidadeSenha = () => {
    setVisibilidadeSenha((antigoValor) => !antigoValor);
  };

  return (
    <div className={margin}>
      {label && <label className="mb-1 form-label fw-medium text-secondary">{label}</label>}
      
      <div className={`input-group ${errorFeedback ? 'has-validation' : ''} mb-2`}>
        <input
          type={visibilidadeSenha ? "text" : "password"}
          className="form-control border-1 shadow-sm input-custom-focus"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          pattern={pattern} // Aplica a Regex complexa aqui
        />
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={alterarVisibilidadeSenha}
          disabled={disabled}
        >
          <i className={`bi ${visibilidadeSenha ? "bi-eye-slash" : "bi-eye"}`}></i>
        </button>

        {errorFeedback && (
          <div className="invalid-feedback text-start mt-1">
            {errorFeedback}
          </div>
        )}
      </div>
    </div>
  );
}
