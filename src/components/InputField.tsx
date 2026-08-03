import React, { useState } from "react";
import type {
  FormFieldName,
  InputType,
  PasswordStrength,
} from "../utils/validation";
import {
  getPasswordRequirements,
  getPasswordStrength,
  MAX_PASSWORD_STRENGTH,
} from "../utils/validation";
import { cn } from "../utils/cn";

const DEFAULT_TEXTAREA_ROWS = 4;

interface InputFieldProps {
  label: string;
  type: InputType;
  id: string;
  name: FormFieldName;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
  max?: string;
  rows?: number;
  icon?: string;
  hint?: string;
  maxLength?: number;
  autoComplete?: string;
  showPasswordFeedback?: boolean;
}

const STRENGTH_META: Record<
  PasswordStrength,
  { label: string; barColor: string; textColor: string }
> = {
  0: { label: "Zwak", barColor: "bg-rose-500", textColor: "text-rose-600" },
  1: { label: "Zwak", barColor: "bg-rose-500", textColor: "text-rose-600" },
  2: {
    label: "Redelijk",
    barColor: "bg-amber-500",
    textColor: "text-amber-600",
  },
  3: { label: "Goed", barColor: "bg-lime-500", textColor: "text-lime-600" },
  4: {
    label: "Sterk",
    barColor: "bg-emerald-500",
    textColor: "text-emerald-600",
  },
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  min,
  max,
  rows,
  icon,
  hint,
  maxLength,
  autoComplete,
  showPasswordFeedback = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;
  const strength = getPasswordStrength(value);

  const baseClasses = cn(
    "w-full rounded-2xl border-2 bg-white py-3 text-slate-800 placeholder-slate-400 shadow-sm outline-none transition-all duration-200",
    // px-4 en pr-12 conflicteren in tailwind-merge (beide padding-groep);
    // daarom bewust aparte subgroepen: links + rechts voor het wachtwoordveld.
    isPassword ? "pl-4 pr-12" : "px-4",
    error
      ? "border-rose-300 bg-rose-50/60 focus:border-rose-400 focus:ring-4 focus:ring-rose-200"
      : "border-slate-200 hover:border-violet-300 focus:border-violet-400 focus:ring-4 focus:ring-violet-200"
  );

  const showChecklist = showPasswordFeedback && (focused || value.length > 0);
  const checklistId = `${id}-requirements`;
  const describedBy = error
    ? `${id}-error`
    : showChecklist
      ? checklistId
      : hint
        ? `${id}-hint`
        : undefined;

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-bold text-slate-700"
      >
        {icon && (
          <span aria-hidden="true" className="mr-1.5">
            {icon}
          </span>
        )}
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-rose-500">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {type === "textarea" ? (
          <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            rows={rows || DEFAULT_TEXTAREA_ROWS}
            placeholder={placeholder}
            maxLength={maxLength}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(baseClasses, "resize-y")}
          />
        ) : (
          <input
            type={inputType}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={handleBlur}
            placeholder={placeholder}
            min={min}
            max={max}
            maxLength={maxLength}
            autoComplete={autoComplete}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={baseClasses}
          />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={
              showPassword ? "Wachtwoord verbergen" : "Wachtwoord tonen"
            }
            aria-pressed={showPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-lg transition-transform duration-200 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
          >
            <span aria-hidden="true">{showPassword ? "🙈" : "👁️"}</span>
          </button>
        )}
      </div>

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="animate-shake mt-2 flex items-start gap-1.5 text-sm font-semibold text-rose-600"
        >
          <span aria-hidden="true">⚠️</span>
          {error}
        </p>
      ) : showChecklist ? (
        <div className="mt-2 space-y-2.5">
          {value.length > 0 && (
            <div
              role="meter"
              aria-live="polite"
              aria-label="Wachtwoordsterkte"
              aria-valuemin={0}
              aria-valuemax={MAX_PASSWORD_STRENGTH}
              aria-valuenow={strength}
              aria-valuetext={STRENGTH_META[strength].label}
            >
              <div className="flex items-center gap-2">
                <div className="flex flex-1 gap-1" aria-hidden="true">
                  {Array.from(
                    { length: MAX_PASSWORD_STRENGTH },
                    (_, index) => index + 1
                  ).map((segment) => (
                    <span
                      key={segment}
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-all duration-300",
                        segment <= strength
                          ? STRENGTH_META[strength].barColor
                          : "bg-slate-200"
                      )}
                    />
                  ))}
                </div>
                <span
                  key={STRENGTH_META[strength].label}
                  className={cn(
                    "animate-pop text-xs font-bold",
                    STRENGTH_META[strength].textColor
                  )}
                >
                  {STRENGTH_META[strength].label}
                </span>
              </div>
            </div>
          )}

          <ul id={checklistId} className="grid gap-1.5 sm:grid-cols-2">
            {getPasswordRequirements(value).map(({ label, met }) => (
              <li
                key={label}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200",
                  met ? "text-emerald-600" : "text-slate-500"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] transition-colors duration-200",
                    met ? "bg-emerald-100" : "bg-slate-100"
                  )}
                >
                  {met ? "✓" : "✗"}
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      ) : hint ? (
        <p
          id={`${id}-hint`}
          className="mt-2 text-xs font-medium text-slate-500"
        >
          <span aria-hidden="true">💡</span> {hint}
        </p>
      ) : null}

      {type === "textarea" && maxLength ? (
        <p className="mt-1 text-right text-xs font-medium text-slate-400">
          {value.length}/{maxLength}
        </p>
      ) : null}
    </div>
  );
};

export default InputField;
