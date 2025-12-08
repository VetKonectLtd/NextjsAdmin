"use client";

import { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  focusLabel?: string;
  isRequired?: boolean;
  searchable?: boolean;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const FormSelect = ({
  label,
  focusLabel,
  isRequired,
  searchable = false,
  options,
  value,
  onChange,
  disabled = false,
}: FormSelectProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setIsFocused(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Select Trigger */}
      <div
        className={`relative border min-h-[48px] rounded-sm bg-white ${
          disabled
            ? "border-[#1D2432] cursor-not-allowed bg-gray-100"
            : "border-[#1D2432] cursor-pointer"
        }`}
        onClick={() => {
          if (!disabled) {
            setIsFocused(true);
            setIsOpen((prev) => !prev);
          }
        }}
      >
        <div
          className={`w-full px-4 pt-5 pb-1 text-base ${
            disabled ? "text-gray-55" : ""
          }`}
        >
          {options.find((o) => o.value === value)?.label || ""}
        </div>

        {/* Floating Label */}
        <label
          className={`absolute left-4 transition-all duration-200 pointer-events-none ${
            isFocused || value
              ? "top-1 text-xs text-[#555555]"
              : "top-3.5 text-sm text-[#555555]"
          } ${isRequired ? "after:content-['*'] after:ml-1 after:text-red-500" : ""}`}
        >
          {isFocused && focusLabel ? focusLabel : label}
        </label>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-20 w-full bg-white border border-[#1D2432] rounded-sm mt-1 max-h-60 overflow-auto shadow-md">
          {/* Search bar inside dropdown */}
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-sm outline-none"
                autoFocus
              />
            </div>
          )}

          {/* Options */}
          <ul>
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-2 text-xs  text-gray-500">No results</li>
            ) : (
              filteredOptions.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setIsFocused(false);
                    setSearch("");
                  }}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    opt.value === value ? "bg-gray-100 font-medium" : ""
                  }`}
                >
                  {opt.label}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FormSelect;
