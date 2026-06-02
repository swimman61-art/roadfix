"use client";

import { useState, useRef, useEffect } from "react";

/**
 * CarAutocomplete - Component للبحث في قائمة بـ autocomplete
 *
 * Props:
 * - value: القيمة الحالية
 * - onChange: دالة تتنفذ لما القيمة تتغير
 * - placeholder: نص الـ placeholder
 * - suggestions: مصفوفة الاختيارات
 * - name: اسم الـ input (للفورم)
 * - disabled: لو محتاج تعطّل الـ input
 * - emptyMessage: نص يظهر لما مفيش نتائج
 */
export default function CarAutocomplete({
  value,
  onChange,
  placeholder = "",
  suggestions = [],
  name = "",
  disabled = false,
  emptyMessage = "اكتب اسم آخر",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // فلترة الاختيارات بناءً على اللي العميل كتبه
  const filtered = value
    ? suggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      )
    : suggestions;

  // اقفل القايمة لما العميل يضغط برة
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    onChange(item);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown") {
        setIsOpen(true);
        return;
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filtered.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filtered.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
        handleSelect(filtered[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const inputClass =
    "w-full p-3 rounded-xl bg-gray-50 border border-slate-400 text-gray-900 outline-none focus:border-red-500 focus:bg-white transition placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <div ref={wrapperRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        name={name}
        value={value || ""}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
          setHighlightedIndex(-1);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClass}
        autoComplete="off"
      />

      {/* السهم */}
      <button
        type="button"
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            inputRef.current?.focus();
          }
        }}
        disabled={disabled}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition disabled:opacity-30"
        tabIndex={-1}
      >
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* قائمة الاقتراحات */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((item, index) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full text-right px-4 py-2.5 text-sm transition-colors ${
                  highlightedIndex === index
                    ? "bg-red-50 text-red-600 font-bold"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                {item}
              </button>
            ))
          ) : value ? (
            <div className="px-4 py-3 text-sm text-gray-400 text-center">
              {emptyMessage}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}