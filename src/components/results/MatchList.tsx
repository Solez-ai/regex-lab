"use client";

import { RegexMatch } from "@/types";

interface MatchListProps {
  matches: RegexMatch[];
  onMatchClick?: (index: number) => void;
  clickedIndex?: number | null;
}

const MAX_VISIBLE = 50;

export function MatchList({ matches, onMatchClick, clickedIndex }: MatchListProps) {
  const visibleMatches = matches.slice(0, MAX_VISIBLE);
  const hasMore = matches.length > MAX_VISIBLE;

  if (matches.length === 0) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          Matches ({matches.length})
        </h3>
      </div>

      <div className="max-h-[200px] overflow-y-auto space-y-1.5">
        {visibleMatches.map((match, index) => (
          <button
            key={`${match.index}-${index}`}
            onClick={() => onMatchClick?.(index)}
            className={`w-full flex items-center justify-between px-3 py-2.5 text-left rounded-lg transition-all group ${
              clickedIndex === index
                ? "bg-[var(--color-accent)]/20 border border-[var(--color-accent)]"
                : "hover:bg-[var(--color-bg-tertiary)] border border-transparent"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className={`text-xs font-mono flex-shrink-0 ${
                clickedIndex === index
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-text-muted)]"
              }`}>
                #{index}
              </span>
              <span className={`font-mono text-sm truncate ${
                clickedIndex === index
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-text-primary)]"
              }`}>
                {match.value}
              </span>
            </div>
            <span className={`text-xs font-mono flex-shrink-0 ml-2 ${
              clickedIndex === index
                ? "text-[var(--color-accent)]"
                : "text-[var(--color-text-muted)]"
            }`}>
              {match.index}-{match.index + match.length}
            </span>
          </button>
        ))}
      </div>
      {hasMore && (
        <p className="text-xs text-[var(--color-text-muted)] text-center py-2">
          + {matches.length - MAX_VISIBLE} more matches
        </p>
      )}
    </div>
  );
}