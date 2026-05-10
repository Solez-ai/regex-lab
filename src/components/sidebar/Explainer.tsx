"use client";

import { useMemo } from "react";

interface ExplainerProps {
  pattern: string;
  isValid: boolean;
}

const typeLabels: Record<string, string> = {
  anchor: "Anchor",
  quantifier: "Quantifier",
  class: "Character Class",
  group: "Group",
  escape: "Escape",
  lookahead: "Lookaround",
  literal: "Literal",
  special: "Special",
};

const typeColors: Record<string, string> = {
  anchor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  quantifier: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  class: "text-green-400 bg-green-500/10 border-green-500/20",
  group: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  escape: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  lookahead: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  literal: "text-gray-400 bg-gray-500/10 border-gray-500/20",
  special: "text-red-400 bg-red-500/10 border-red-500/20",
};

export function Explainer({ pattern, isValid }: ExplainerProps) {
  const tokens = useMemo(() => {
    if (!pattern) return [];
    return parsePattern(pattern);
  }, [pattern]);

  if (!pattern) {
    return (
      <div className="py-8 text-center text-[var(--color-text-muted)] bg-[var(--color-bg-tertiary)] rounded-lg">
        <p className="text-sm">Start typing a pattern to see it explained here</p>
      </div>
    );
  }

  if (!isValid && tokens.length === 0) {
    return (
      <div className="py-8 text-center text-[var(--color-error)] bg-[var(--color-error)]/10 rounded-lg">
        <p className="text-sm">Fix the pattern errors first</p>
      </div>
    );
  }

  const isLongPattern = pattern.length > 200;
  const displayTokens = isLongPattern && tokens.length > 20
    ? tokens.slice(0, 20)
    : tokens;
  const hasMore = isLongPattern && tokens.length > 20;

  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
      {displayTokens.map((token, index) => {
        const typeColor = typeColors[token.type] || typeColors.literal;
        return (
          <div
            key={`${token.raw}-${index}`}
            className="p-4 bg-[var(--color-bg-tertiary)] rounded-lg hover:bg-[var(--color-bg-tertiary)]/80 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <code className="font-mono text-lg font-bold text-[var(--color-accent)]">
                {token.raw}
              </code>
              <span className={`text-xs px-2 py-1 rounded-md border ${typeColor}`}>
                {typeLabels[token.type] || token.type}
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] mb-2">
              {token.description}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] font-mono">
              Example: {token.example || token.raw}
            </p>
          </div>
        );
      })}
      {hasMore && (
        <p className="text-sm text-[var(--color-text-muted)] text-center py-3">
          + {tokens.length - 20} more tokens
        </p>
      )}
    </div>
  );
}

function parsePattern(pattern: string) {
  const tokens: Array<{
    raw: string;
    type: string;
    description: string;
    example: string;
  }> = [];
  let i = 0;

  while (i < pattern.length) {
    const char = pattern[i];

    if (char === "\\") {
      if (i + 1 < pattern.length) {
        const next = pattern[i + 1];
        const escapeMap: Record<string, { desc: string; example: string }> = {
          d: { desc: "Matches any digit (0-9)", example: "4, 7" },
          D: { desc: "Matches any non-digit", example: "a, @" },
          w: { desc: "Matches word character (a-z, A-Z, 0-9, _)", example: "a, Z, 5" },
          W: { desc: "Matches non-word character", example: "!, @" },
          s: { desc: "Matches whitespace", example: "space, tab" },
          S: { desc: "Matches non-whitespace", example: "a, 1" },
          b: { desc: "Matches word boundary", example: "edge of word" },
          B: { desc: "Matches non-word boundary", example: "middle of word" },
          n: { desc: "Matches newline", example: "new line" },
          t: { desc: "Matches tab", example: "tab character" },
        };
        if (escapeMap[next]) {
          tokens.push({
            raw: "\\" + next,
            type: "escape",
            description: escapeMap[next].desc,
            example: escapeMap[next].example,
          });
          i += 2;
          continue;
        }
      }
      tokens.push({ raw: "\\", type: "escape", description: "Escape character", example: "" });
      i++;
      continue;
    }

    if (char === "[") {
      let end = pattern.indexOf("]", i + 1);
      if (end !== -1) {
        const content = pattern.slice(i + 1, end);
        tokens.push({
          raw: pattern.slice(i, end + 1),
          type: "class",
          description: content.startsWith("^")
            ? `Matches any character NOT in: ${content.slice(1)}`
            : `Matches any character in: ${content}`,
          example: content.startsWith("^") ? "not a,b,c" : "a, b, or c",
        });
        i = end + 1;
        continue;
      }
    }

    if (char === "(") {
      tokens.push({ raw: "(", type: "group", description: "Start of group", example: "capturing" });
      i++;
      continue;
    }

    if (char === ")") {
      tokens.push({ raw: ")", type: "group", description: "End of group", example: "" });
      i++;
      continue;
    }

    if (char === "^") {
      tokens.push({ raw: "^", type: "anchor", description: "Matches start of string/line", example: "start" });
      i++;
      continue;
    }

    if (char === "$") {
      tokens.push({ raw: "$", type: "anchor", description: "Matches end of string/line", example: "end" });
      i++;
      continue;
    }

    if (char === ".") {
      tokens.push({ raw: ".", type: "class", description: "Matches any character except newline", example: "any char" });
      i++;
      continue;
    }

    if (char === "|") {
      tokens.push({ raw: "|", type: "special", description: "Alternation - matches either side", example: "or" });
      i++;
      continue;
    }

    if (char === "*" || char === "+" || char === "?") {
      const descMap: Record<string, string> = {
        "*": "Matches zero or more of previous",
        "+": "Matches one or more of previous",
        "?": "Matches zero or one of previous",
      };
      tokens.push({
        raw: char,
        type: "quantifier",
        description: descMap[char],
        example: char === "*" ? "0+" : char === "+" ? "1+" : "0-1",
      });
      i++;
      continue;
    }

    if (char === "{") {
      const end = pattern.indexOf("}", i);
      if (end !== -1) {
        const content = pattern.slice(i + 1, end);
        tokens.push({
          raw: pattern.slice(i, end + 1),
          type: "quantifier",
          description: content.includes(",")
            ? content.endsWith(",")
              ? `Matches ${content.slice(0, -1)} or more times`
              : `Matches between ${content.split(",")[0]} and ${content.split(",")[1]} times`
            : `Matches exactly ${content} times`,
          example: content,
        });
        i = end + 1;
        continue;
      }
    }

    tokens.push({
      raw: char,
      type: "literal",
      description: `Matches the literal character '${char}'`,
      example: char,
    });
    i++;
  }

  return tokens;
}