import React from "react";

interface InputFieldProps {
  label: string;
  type: string;
  id: string;
  name: keyof import("../utils/validation").FormData;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
  rows?: number;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  id,
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  min,
  rows,
}) => {
  const baseClasses =
    "w-full px-4 py-3 bg-white/10 border backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60 transition-all duration-300";
  const errorClasses = error ? "border-red-400" : "border-white/30";

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-white/90 mb-2 drop-shadow"
      >
        {label} {required && "*"}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows || 4}
          className={`${baseClasses} ${errorClasses}`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`${baseClasses} ${errorClasses}`}
          placeholder={placeholder}
          min={min}
          required={required}
        />
      )}
      {error && (
        <p className="text-red-300 text-sm mt-2 drop-shadow">{error}</p>
      )}
    </div>
  );
};

export default InputField;
