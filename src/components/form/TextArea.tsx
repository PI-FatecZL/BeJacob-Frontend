import type { ChangeEvent } from "react";

interface TextAreaProps {
    label?: string;
    margin?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    rows?: number;
    minLength?: number;
    maxLength?: number;
    size?: "sm" | "lg" | string;
    errorFeedback?: string;
}

export default function TextArea({
    label,
    margin,
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    rows = 3,
    minLength,
    maxLength,
    size,
    errorFeedback
}: TextAreaProps) {
    const sizeClass = size === "sm" ? "form-control-sm" : size === "lg" ? "form-control-lg" : "";

    return (
        <div className={margin}>
            {label && <label className="mb-1 form-label fw-medium text-secondary">{label}</label>}
            <textarea
                className={`form-control ${sizeClass} border-1 shadow-sm input-custom-focus`.trim()}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                rows={rows}
                minLength={minLength}
                maxLength={maxLength}
            />

            {errorFeedback && (
                <div className="invalid-feedback text-start mt-1">
                    {errorFeedback}
                </div>
            )}
        </div>
    );
}
