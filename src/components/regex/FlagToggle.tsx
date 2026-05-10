"use client";

interface FlagToggleProps {
  flags: string;
  onChange: (flags: string) => void;
}

const flagInfo: Record<string, { label: string; description: string }> = {
  g: { label: "global", description: "Find all matches in the string" },
  i: { label: "ignore case", description: "Case-insensitive matching (A = a)" },
  m: { label: "multiline", description: "^ and $ match line boundaries" },
  s: { label: "dotAll", description: ". matches newline characters too" },
  u: { label: "unicode", description: "Enable full Unicode support" },
  d: { label: "indices", description: "Provide match start/end indices" },
};

export function FlagToggle({ flags, onChange }: FlagToggleProps) {
  const availableFlags = Object.keys(flagInfo);

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      onChange(flags.replace(flag, ""));
    } else {
      onChange(flags + flag);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      <span className="text-xs text-[var(--color-text-muted)]">Flags:</span>
      {availableFlags.map((flag) => {
        const isActive = flags.includes(flag);
        const info = flagInfo[flag];

        return (
          <button
            key={flag}
            onClick={() => toggleFlag(flag)}
            title={`${info.label}: ${info.description}`}
            className={`px-3 py-1.5 rounded-md text-sm font-mono font-semibold transition-all ${
              isActive
                ? "bg-[var(--color-accent)] text-white shadow-sm"
                : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text-secondary)]"
            }`}
            aria-pressed={isActive}
          >
            {flag}
            <span className="ml-1 text-[10px] opacity-70">{info.label}</span>
          </button>
        );
      })}
    </div>
  );
}