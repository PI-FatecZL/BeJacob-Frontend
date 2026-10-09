import type { ChangeEvent } from "react";

interface InputProps {
    label?: string;
    margin?: string;
    type?: string;
    value?: string | number;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    minLength?: number;
    maxLength?: number;
    min?: string | number;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    size?: "sm" | "lg" | string;
}

export default function Input({
    label,
    margin,
    type = "text",
    value,
    onChange,
    minLength,
    maxLength,
    min,
    required = false,
    disabled = false,
    placeholder,
    size
}: InputProps) {
    const sizeClass = size === "sm" ? "form-control-sm" : size === "lg" ? "form-control-lg" : "";

    return (
        <div className={margin}>
            {label && <label className="mb-1 form-label fw-medium text-primary">{label}</label>}
            <input
                type={type}
                className={`form-control ${sizeClass} border-1 shadow-sm input-custom-focus`.trim()}
                value={value}
                onChange={onChange}
                minLength={minLength}
                maxLength={maxLength}
                min={min}
                required={required}
                disabled={disabled}
                placeholder={placeholder}
            />
        </div>
    );
}