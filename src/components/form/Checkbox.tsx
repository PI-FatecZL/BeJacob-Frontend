import type { ChangeEvent } from "react";

interface CheckboxProps {
    label?: string;
    margin?: string;
    checked?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    id?: string;
}

export default function Checkbox({
    label,
    margin = "mb-3",
    checked = false,
    onChange,
    disabled = false,
    id,
}: CheckboxProps) {
    return (
        <div className={`form-check ${margin}`.trim()}>
            <input
                type="checkbox"
                className="form-check-input shadow-sm input-custom-focus"
                id={id}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
            />
            {label && (
                <label className="form-check-label small fw-medium text-secondary" htmlFor={id}>
                    {label}
                </label>
            )}
        </div>
    );
}