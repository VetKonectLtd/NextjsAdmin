import React, { forwardRef, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isRequired?: boolean;
  focusLabel?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      focusLabel,
      error,
      type = "text",
      maxLength,
      isRequired,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const inputType = type === "password" && isPasswordVisible ? "text" : type;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === "number" && maxLength) {
        e.target.value = e.target.value.slice(0, maxLength);
      }
      props.onChange?.(e);
    };

    return (
      <div className="relative w-full font-sans">
        <input
          ref={ref}
          type={inputType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          className={`peer block w-full px-4 pt-6 pb-2 border bg-white rounded-md text-base placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all
            ${error ? "border-red-500" : "border-gray-300"}
          `}
          placeholder={label}
          {...props}
        />

        <label
          className={`absolute left-4 top-2 text-gray-500 text-xs transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-green-600
          `}
        >
          {isFocused && focusLabel ? focusLabel : label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>

        {type === "password" && (
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setIsPasswordVisible((v) => !v)}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          >
            {isPasswordVisible ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}

        {error && <span className="text-red-600 text-sm mt-1 block">{error}</span>}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
export default FormInput;
