import type { ChangeEvent } from "react";

export interface SelectOption {
    label: string;
    value: string | number;
}

interface SelectProps {
    label?: string;
    margin?: string;
    value?: string | number;
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
    options: SelectOption[];
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    size?: "sm" | "lg" | string;
}

export default function Select({
    label,
    margin,
    value,
    onChange,
    options,
    placeholder = "Selecione...",
    required = false,
    disabled = false,
    size
}: SelectProps) {
    const sizeClass = size === "sm" ? "form-select-sm" : size === "lg" ? "form-select-lg" : "";

    return (
        <div className={margin}>
            {label && (
                <label className="mb-1 form-label fw-medium text-primary">
                    {label}
                </label>
            )}
            <select
                className={`form-select ${sizeClass} border-1 shadow-sm input-custom-focus`.trim()}
                value={value ?? ""}
                onChange={onChange}
                required={required}
                disabled={disabled}
            >
                {placeholder && (
                    <option value="" disabled={required}>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}