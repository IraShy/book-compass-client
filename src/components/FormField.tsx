import type { FormFieldProps } from "../types.ts";

function FormField({
  label,
  type,
  name,
  value,
  placeholder,
  helptext,
  showHelp,
  onToggleHelp,
  error,
  required,
  onChange,
  onBlur,
}: FormFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="label">
        {label}
        {required && <span className="label-required"> (required)</span>}:
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        onChange={onChange}
        onBlur={onBlur}
        className={`input ${error ? "input-error" : ""}`}
        required={required}
      />
      {helptext && (
        <div className="flex items-center gap-2 mt-1">
          <button
            type="button"
            className="info-button"
            onClick={onToggleHelp}
            aria-label={`${showHelp ? "Hide" : "Show"} help for ${label}`}
          >
            i
          </button>
          {showHelp && <p className="field-help">{helptext}</p>}
        </div>
      )}

      <div className="min-h-6">
        {error && (
          <span
            className="field-error-message"
            aria-live="polite"
            id={error ? `${name}-error` : undefined}
          >
            {error}
          </span>
        )}
      </div>
    </div>
  );
}

export default FormField;
