"use client";

import { useState } from "react";
import { Badge } from "../ui/Badge";

interface StatsBarProps {
  matchCount: number;
  captureGroupCount: number;
  evalTime: number;
  patternLength: number;
  testStringLength: number;
  isValid: boolean;
  pattern?: string;
  flags?: string;
  onFlagsChange?: (flags: string) => void;
  onCopyPattern?: () => void;
  onCopyMatches?: () => void;
  matches?: Array<{ value: string; index: number; length: number }>;
}

export function StatsBar({
  matchCount,
  captureGroupCount,
  evalTime,
  patternLength,
  testStringLength,
  isValid,
  pattern = "",
  flags = "gi",
  onFlagsChange,
  onCopyPattern,
  onCopyMatches,
  matches = [],
}: StatsBarProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  };

  const toggleFlag = (flag: string) => {
    if (!onFlagsChange) return;
    const newFlags = flags.includes(flag)
      ? flags.replace(flag, "")
      : flags + flag;
    onFlagsChange(newFlags);
  };

  const flagOptions = [
    { flag: "g", label: "g", title: "Global - find all matches" },
    { flag: "i", label: "i", title: "Case insensitive" },
    { flag: "m", label: "m", title: "Multiline - ^/$ match line boundaries" },
    { flag: "s", label: "s", title: "Dotall - . matches newlines" },
  ];

  const uniqueMatchCount = new Set(matches.map(m => m.value)).size;

  return (
    <div className="flex flex-wrap items-center gap-3 py-3 px-4 bg-[var(--color-bg-tertiary)] rounded-lg">
      {/* Match Count */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--color-text-muted)]">Matches:</span>
        {isValid ? (
          <button
            onClick={onCopyMatches}
            className={`transition-colors hover:underline ${matchCount > 0 ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]"}`}
            title="Click to copy all matches"
          >
            <Badge variant={matchCount > 0 ? "success" : "default"}>
              {matchCount}
            </Badge>
          </button>
        ) : (
          <span className="text-[var(--color-error)]">-</span>
        )}
        {matchCount > 0 && uniqueMatchCount !== matchCount && (
          <span className="text-[10px] text-[var(--color-text-muted)]">({uniqueMatchCount} unique)</span>
        )}
      </div>

      {/* Capture Groups */}
      {captureGroupCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-muted)]">Groups:</span>
          <Badge variant="info">{captureGroupCount}</Badge>
        </div>
      )}

      {/* Eval Time */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--color-text-muted)]">Time:</span>
        <span className={`font-mono text-xs ${evalTime > 50 ? "text-[var(--color-warning)]" : "text-[var(--color-text-secondary)]"}`}>
          {evalTime.toFixed(2)}ms
        </span>
      </div>

      {/* Pattern Length */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--color-text-muted)]">Pattern:</span>
        <button
          onClick={onCopyPattern}
          className="font-mono text-xs text-[var(--color-accent)] hover:underline"
          title="Click to copy pattern"
        >
          {patternLength} chars
        </button>
      </div>

      {/* Test String Length */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--color-text-muted)]">Input:</span>
        <span className="font-mono text-xs text-[var(--color-text-secondary)]">
          {testStringLength.toLocaleString()} chars
        </span>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-[var(--color-border-default)]" />

      {/* Flag Toggles */}
      <div className="flex items-center gap-1">
        {flagOptions.map(({ flag, label, title }) => (
          <button
            key={flag}
            onClick={() => toggleFlag(flag)}
            className={`w-6 h-6 rounded text-[10px] font-mono font-bold transition-all ${
              flags.includes(flag)
                ? "bg-[var(--color-accent)] text-white"
                : "bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:bg-[var(--color-border-subtle)]"
            }`}
            title={title}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Copy Feedback */}
      {copied && (
        <span className="text-xs text-[var(--color-success)] animate-pulse">
          Copied!
        </span>
      )}
    </div>
  );
}