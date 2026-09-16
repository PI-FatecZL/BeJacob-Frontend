import { useState, type ChangeEvent } from "react";

interface InputSenhaProps {
  margin?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function InputSenha({
  margin,
  value,
  onChange,
  label = "Senha",
  placeholder,
  disabled = false,
  required = true
}: InputSenhaProps) {
  const [visibilidadeSenha, setVisibilidadeSenha] = useState(false);

  const alterarVisibilidadeSenha = () => {
    setVisibilidadeSenha((antigoValor) => !antigoValor);
  };

  return (
    <div className={margin}>
      {label && <label className="mb-1 form-label fw-medium text-secondary">{label}</label>}
      <div className="input-group mb-3">
        <input
          type={visibilidadeSenha ? "text" : "password"}
          className="form-control border-1 shadow-sm input-custom-focus"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
        />
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={alterarVisibilidadeSenha}
          disabled={disabled}
        >
          <i className={`bi ${visibilidadeSenha ? "bi-eye-slash" : "bi-eye"}`}></i>
        </button>
      </div>
    </div>
  );
}