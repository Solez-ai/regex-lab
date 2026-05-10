"use client";

import { useMemo } from "react";
import { useDebounce } from "./useDebounce";
import { RegexResult, RegexMatch } from "@/types";

export function useRegex(
  pattern: string,
  flags: string,
  testString: string
): { result: RegexResult; regex: RegExp | null } {
  const debouncedTestString = useDebounce(
    testString,
    testString.length > 50000 ? 300 : 50
  );

  const { result, regex } = useMemo(() => {
    let regex: RegExp | null = null;
    let result: RegexResult = {
      matches: [],
      error: null,
      evalTime: 0,
      isValid: true,
    };

    if (!pattern) {
      return { result, regex };
    }

    try {
      regex = new RegExp(pattern, flags);
      const start = performance.now();
      const matches = [...debouncedTestString.matchAll(regex)];
      const evalTime = performance.now() - start;

      const regexMatches: RegexMatch[] = matches.map((match) => ({
        value: match[0],
        index: match.index ?? 0,
        length: match[0].length,
        groups: match.groups ?? {},
        captures: match.slice(1),
      }));

      result = {
        matches: regexMatches,
        error: null,
        evalTime,
        isValid: true,
      };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Invalid regex";
      result = {
        matches: [],
        error: errorMessage,
        evalTime: 0,
        isValid: false,
      };
    }

    return { result, regex };
  }, [pattern, flags, debouncedTestString]);

  return { result, regex };
}