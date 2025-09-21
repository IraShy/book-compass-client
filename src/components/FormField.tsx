import type { FormFieldProps } from "../types.ts";

function FormField({
  label,
  type,
  name,
  value,
  placeholder,
  error,
  required,
  onChange,
  onBlur,
}: FormFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="label">
        {label}:
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        className={`input ${error ? "input-error" : ""}`}
        required={required}
      />
      <div className="min-h-6">
        {error && (
          <span className="field-error-message" aria-live="polite">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}

export default FormField;
