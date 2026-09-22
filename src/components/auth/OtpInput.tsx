"use client";

import { useEffect, useRef } from "react";

const OTP_LENGTH = 6;

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  idPrefix?: string;
};

export default function OtpInput({
  value = "",
  onChange,
  disabled = false,
  error = false,
  autoFocus = true,
  idPrefix = "otp",
}: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, index) => value[index] || "");

  useEffect(() => {
    if (autoFocus && !disabled) {
      inputsRef.current[0]?.focus();
    }
  }, [autoFocus, disabled]);

  function emit(nextDigits: string[]) {
    onChange(nextDigits.join("").slice(0, OTP_LENGTH));
  }

  function focusIndex(index: number) {
    const el = inputsRef.current[index];
    if (!el) return;
    el.focus();
    el.select();
  }

  function handleChange(index: number, rawValue: string) {
    if (disabled) return;
    const raw = rawValue.replace(/\D/g, "");
    if (!raw) {
      const next = [...digits];
      next[index] = "";
      emit(next);
      return;
    }

    const chars = raw.split("");
    const next = [...digits];
    let cursor = index;
    chars.forEach((char) => {
      if (cursor < OTP_LENGTH) {
        next[cursor] = char;
        cursor += 1;
      }
    });
    emit(next);
    focusIndex(Math.min(cursor, OTP_LENGTH - 1));
  }

  function handleKeyDown(index: number, key: string, event: React.KeyboardEvent) {
    if (disabled) return;

    if (key === "Backspace") {
      event.preventDefault();
      const next = [...digits];
      if (next[index]) {
        next[index] = "";
        emit(next);
      } else if (index > 0) {
        next[index - 1] = "";
        emit(next);
        focusIndex(index - 1);
      }
      return;
    }

    if (key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusIndex(index - 1);
    }

    if (key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      focusIndex(index + 1);
    }
  }

  function handlePaste(event: React.ClipboardEvent) {
    if (disabled) return;
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] || "");
    emit(next);
    focusIndex(Math.min(pasted.length, OTP_LENGTH - 1));
  }

  return (
    <div
      className={`otp-input${error ? " is-invalid" : ""}`}
      role="group"
      aria-label="6-digit verification code"
    >
      {digits.map((digit, index) => (
        <input
          key={`${idPrefix}-${index}`}
          id={`${idPrefix}-${index}`}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          className={`otp-input__box${digit ? " is-filled" : ""}`}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`Digit ${index + 1}`}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event.key, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.target.select()}
        />
      ))}
    </div>
  );
}
