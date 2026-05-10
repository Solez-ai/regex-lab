"use client";

import { HTMLAttributes, forwardRef } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "error" | "accent" | "info";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-mono text-xs font-medium rounded-md px-2 py-0.5";

    const variants = {
      default: "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]",
      success: "bg-[var(--color-success)]/20 text-[var(--color-success)]",
      error: "bg-[var(--color-error)]/20 text-[var(--color-error)]",
      accent: "bg-[var(--color-accent-purple)]/20 text-[var(--color-accent-purple-light)]",
      info: "bg-[var(--color-node-group)]/20 text-[var(--color-node-group)]",
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

Badge.displayName = "Badge";

export { Badge };