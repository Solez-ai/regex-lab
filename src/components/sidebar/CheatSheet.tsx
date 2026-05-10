"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CheatSheetProps {
  onTokenClick?: (token: string) => void;
}

const cheatSheetData = {
  "Anchors": [
    { token: "^", desc: "Start of string/line" },
    { token: "$", desc: "End of string/line" },
    { token: "\\b", desc: "Word boundary" },
    { token: "\\B", desc: "Non-word boundary" },
  ],
  "Character Classes": [
    { token: ".", desc: "Any character (except newline)" },
    { token: "\\d", desc: "Digit [0-9]" },
    { token: "\\D", desc: "Non-digit" },
    { token: "\\w", desc: "Word char [a-zA-Z0-9_]" },
    { token: "\\W", desc: "Non-word char" },
    { token: "\\s", desc: "Whitespace" },
    { token: "\\S", desc: "Non-whitespace" },
    { token: "[abc]", desc: "Character set" },
    { token: "[^abc]", desc: "Negated set" },
    { token: "[a-z]", desc: "Character range" },
  ],
  "Quantifiers": [
    { token: "*", desc: "Zero or more" },
    { token: "+", desc: "One or more" },
    { token: "?", desc: "Zero or one (optional)" },
    { token: "{n}", desc: "Exactly n times" },
    { token: "{n,}", desc: "n or more times" },
    { token: "{n,m}", desc: "Between n and m" },
    { token: "*?", desc: "Lazy zero or more" },
    { token: "+?", desc: "Lazy one or more" },
  ],
  "Groups & References": [
    { token: "(abc)", desc: "Capturing group" },
    { token: "(?:abc)", desc: "Non-capturing group" },
    { token: "(?<name>)", desc: "Named group" },
    { token: "\\1", desc: "Backreference" },
    { token: "(a|b)", desc: "Alternation" },
  ],
  "Lookaround": [
    { token: "(?=abc)", desc: "Positive lookahead" },
    { token: "(?!abc)", desc: "Negative lookahead" },
    { token: "(?<=abc)", desc: "Positive lookbehind" },
    { token: "(?<!abc)", desc: "Negative lookbehind" },
  ],
  "Escapes": [
    { token: "\\n", desc: "Newline" },
    { token: "\\t", desc: "Tab" },
    { token: "\\r", desc: "Carriage return" },
    { token: "\\.", desc: "Literal dot" },
    { token: "\\\\", desc: "Literal backslash" },
  ],
  "Flags": [
    { token: "g", desc: "Global - find all" },
    { token: "i", desc: "Case insensitive" },
    { token: "m", desc: "Multiline mode" },
    { token: "s", desc: "Dot matches newlines" },
    { token: "u", desc: "Unicode mode" },
  ],
};

export function CheatSheet({ onTokenClick }: CheatSheetProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
      >
        <span className="font-medium">Click tokens to add to pattern</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 max-h-[500px] overflow-y-auto pr-1"
          >
            {Object.entries(cheatSheetData).map(([category, items]) => (
              <div key={category}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                  {category}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {items.map((item) => (
                    <button
                      key={item.token}
                      onClick={() => onTokenClick?.(item.token)}
                      className="flex items-center gap-3 px-3 py-2.5 text-left rounded-lg hover:bg-[var(--color-bg-tertiary)] hover:ring-1 hover:ring-[var(--color-accent)]/30 transition-all group"
                      title={item.desc}
                    >
                      <code className="font-mono text-sm text-[var(--color-accent)] min-w-[50px]">
                        {item.token}
                      </code>
                      <span className="text-xs text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)] truncate">
                        {item.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}