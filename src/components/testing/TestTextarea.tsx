"use client";

import { useState, useCallback } from "react";

interface TestTextareaProps {
  value: string;
  onChange: (value: string) => void;
  matchCount: number;
}

export function TestTextarea({ value, onChange, matchCount }: TestTextareaProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type.startsWith("text/")) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          onChange(text);
        };
        reader.readAsText(file);
      }
    },
    [onChange]
  );

  const charCount = value.length;
  const isLarge = charCount > 50000;

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        placeholder="Enter or paste your test string here..."
        className={`w-full h-40 resize-none font-mono text-sm bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] rounded-lg p-4 outline-none transition-all border border-transparent ${
          isDragOver
            ? "ring-2 ring-[var(--color-accent)] ring-offset-2"
            : "hover:border-[var(--color-border-default)]"
        }`}
        aria-label="Test string"
      />
      <div className="absolute bottom-3 right-3 flex items-center gap-3">
        {matchCount > 0 && (
          <span className="text-xs font-medium text-[var(--color-success)] bg-[var(--color-success)]/10 px-2 py-0.5 rounded">
            {matchCount} match{matchCount !== 1 ? "es" : ""}
          </span>
        )}
        {isLarge && (
          <span className="text-xs text-[var(--color-warning)] bg-[var(--color-warning)]/10 px-2 py-0.5 rounded">
            Large
          </span>
        )}
        <span className="text-xs font-mono text-[var(--color-text-muted)]">
          {charCount.toLocaleString()} chars
        </span>
      </div>
    </div>
  );
}