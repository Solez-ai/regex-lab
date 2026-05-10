"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

interface RegexInputProps {
  pattern: string;
  onChange: (pattern: string) => void;
  isValid: boolean;
  error: string | null;
  flags: string;
}

export interface RegexInputRef {
  focus: () => void;
}

const RegexInput = forwardRef<RegexInputRef, RegexInputProps>(
  ({ pattern, onChange, isValid, error, flags }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }));

    const hasContent = pattern.length > 0;
    const borderColor = !isValid
      ? "var(--color-error)"
      : hasContent
      ? "var(--color-accent)"
      : "var(--color-border-default)";

    return (
      <div
        className="relative flex items-center bg-[var(--color-bg-tertiary)] rounded-lg px-4 py-3 transition-all border"
        style={{
          borderColor: borderColor,
          boxShadow: hasContent ? `0 0 0 3px ${borderColor}20` : 'none'
        }}
      >
        <span className="font-mono text-xl text-[var(--color-text-muted)] select-none mr-1">/</span>
        <input
          ref={inputRef}
          type="text"
          value={pattern}
          onChange={(e) => onChange(e.target.value)}
          placeholder="your regex pattern..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="flex-1 bg-transparent font-mono text-xl text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none min-w-0"
          aria-label="Regular expression pattern"
        />
        <span className="font-mono text-xl text-[var(--color-text-muted)] select-none ml-1">
          /{flags}
        </span>
      </div>
    );
  }
);

RegexInput.displayName = "RegexInput";

export { RegexInput };