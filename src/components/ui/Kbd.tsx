"use client";

import { HTMLAttributes, forwardRef } from "react";

interface KbdProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent";
}

const Kbd = forwardRef<HTMLSpanElement, KbdProps>(
  ({ className = "", variant = "default", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-mono text-xs font-medium rounded px-1.5 py-0.5";

    const variants = {
      default: "bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]",
      accent: "bg-[var(--color-accent-purple)]/20 text-[var(--color-accent-purple-light)] border border-[var(--color-accent-purple)]/30",
    };

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Kbd.displayName = "Kbd";

export { Kbd };