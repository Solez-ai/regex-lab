"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { RegexMatch } from "@/types";

interface MatchHighlighterProps {
  testString: string;
  matches: RegexMatch[];
  matchPositions?: Array<{ start: number; end: number; index: number }>;
  clickedMatchIndex?: number | null;
  onMatchClick?: (index: number) => void;
}

export function MatchHighlighter({
  testString,
  matches,
  matchPositions,
  clickedMatchIndex,
  onMatchClick,
}: MatchHighlighterProps) {
  const highlightedContent = useMemo(() => {
    if (matches.length === 0) {
      return <span className="whitespace-pre-wrap">{testString || " "}</span>;
    }

    const parts: Array<{ type: "text" | "match"; content: string; matchIndex: number }> = [];
    let lastIndex = 0;

    const positions = matchPositions || matches.map((m, i) => ({
      start: m.index,
      end: m.index + m.length,
      index: i
    })).sort((a, b) => a.start - b.start);

    for (const pos of positions) {
      if (pos.start > lastIndex) {
        parts.push({
          type: "text",
          content: testString.slice(lastIndex, pos.start),
          matchIndex: -1,
        });
      }

      if (pos.start >= lastIndex) {
        parts.push({
          type: "match",
          content: testString.slice(pos.start, pos.end),
          matchIndex: pos.index,
        });
        lastIndex = pos.end;
      }
    }

    if (lastIndex < testString.length) {
      parts.push({
        type: "text",
        content: testString.slice(lastIndex),
        matchIndex: -1,
      });
    }

    return parts.map((part, i) => {
      if (part.type === "text") {
        return (
          <span key={`text-${i}`} className="whitespace-pre-wrap">
            {part.content || " "}
          </span>
        );
      }

      const isPrimary = part.matchIndex % 2 === 0;
      const isClicked = part.matchIndex === clickedMatchIndex;

      return (
        <motion.mark
          key={`match-${i}`}
          initial={{ scale: 1 }}
          animate={{ scale: isClicked ? 1.05 : 1 }}
          transition={{ duration: 0.15 }}
          className={`${isPrimary ? "match-primary" : "match-secondary"} cursor-pointer px-0.5 rounded-sm ${
            isClicked ? "ring-2 ring-white ring-offset-1 ring-offset-[var(--color-bg-tertiary)]" : ""
          }`}
          onClick={() => onMatchClick?.(part.matchIndex)}
          style={{
            position: 'relative',
          }}
        >
          {part.content}
        </motion.mark>
      );
    });
  }, [testString, matches, matchPositions, clickedMatchIndex, onMatchClick]);

  return (
    <div
      className="w-full min-h-[120px] max-h-[300px] overflow-auto font-mono text-base bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded-lg p-5 leading-relaxed"
      role="region"
      aria-label="Match highlights"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
        {highlightedContent}
      </motion.div>
    </div>
  );
}