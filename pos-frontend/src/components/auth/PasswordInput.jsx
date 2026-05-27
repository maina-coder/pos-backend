import { useState } from "react";

/**
 * Eye Icon
 * Visible password state
 */
function EyeIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/**
 * Eye Off Icon
 * Hidden password state
 */
function EyeOffIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

/**
 * Reusable Password Input Component
 */
export default function PasswordInput({
  value,
  onChange,
  placeholder,
  onKeyDown,
  autoComplete,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="input-wrapper">

      <input
        className="form-input form-input--password"
        type={visible ? "text" : "password"}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
        autoComplete={autoComplete || "current-password"}
      />

      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        title={visible ? "Hide Password" : "Show Password"}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>

    </div>
  );
}