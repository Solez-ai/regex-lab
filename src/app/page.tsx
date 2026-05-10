"use client";

import { useState, useRef, useCallback, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";
import { useRegex } from "@/hooks/useRegex";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { TopBar } from "@/components/layout/TopBar";
import { SidebarSection } from "@/components/layout/Sidebar";
import { RegexInput, RegexInputRef } from "@/components/regex/RegexInput";
import { FlagToggle } from "@/components/regex/FlagToggle";
import { ErrorBanner } from "@/components/regex/ErrorBanner";
import { TestTextarea } from "@/components/testing/TestTextarea";
import { StatsBar } from "@/components/results/StatsBar";
import { MatchHighlighter } from "@/components/testing/MatchHighlighter";
import { MatchList } from "@/components/results/MatchList";
import { GroupsPanel } from "@/components/results/GroupsPanel";
import { Explainer } from "@/components/sidebar/Explainer";
import { SavedPatterns } from "@/components/sidebar/SavedPatterns";
import { ExportPanel } from "@/components/sidebar/ExportPanel";
import { CheatSheet } from "@/components/sidebar/CheatSheet";
import { SavedPattern, RegexMatch } from "@/types";
import { generateId } from "@/lib/utils";
import { starterPatterns } from "@/lib/patterns";

function HomeContent() {
  const searchParams = useSearchParams();
  const { theme, toggleTheme } = useTheme();
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("gi");
  const [testString, setTestString] = useState("");
  const [clickedMatchIndex, setClickedMatchIndex] = useState<number | null>(null);

  const regexInputRef = useRef<RegexInputRef>(null);

  const { result } = useRegex(pattern, flags, testString);

  // Read pattern from URL when navigating from Tools page
  useEffect(() => {
    const urlPattern = searchParams.get("pattern");
    if (urlPattern) {
      setPattern(urlPattern);
    }
  }, [searchParams]);

  const [savedPatterns, setSavedPatterns] = useLocalStorage<SavedPattern[]>(
    "regexlab:patterns",
    starterPatterns
  );

  const loadPattern = useCallback(
    (saved: SavedPattern) => {
      setPattern(saved.pattern);
      setFlags(saved.flags);
      setSavedPatterns((prev) =>
        prev.map((p) =>
          p.id === saved.id ? { ...p, lastUsed: Date.now() } : p
        )
      );
    },
    [setSavedPatterns]
  );

  const savePattern = useCallback(
    (label: string, description: string) => {
      const newPattern: SavedPattern = {
        id: generateId(),
        pattern,
        flags,
        label,
        description,
        createdAt: Date.now(),
        lastUsed: Date.now(),
      };
      setSavedPatterns((prev) => {
        if (prev.length >= 100) {
          alert("Maximum 100 patterns allowed.");
          return prev;
        }
        return [...prev, newPattern];
      });
    },
    [pattern, flags, setSavedPatterns]
  );

  const deletePattern = useCallback(
    (id: string) => {
      setSavedPatterns((prev) => prev.filter((p) => p.id !== id));
    },
    [setSavedPatterns]
  );

  const handleCopyMatches = useCallback(async () => {
    const matchValues = result.matches.map((m) => m.value).join("\n");
    await navigator.clipboard.writeText(matchValues);
  }, [result.matches]);

  const handleCopyPattern = useCallback(async () => {
    await navigator.clipboard.writeText(pattern);
  }, [pattern]);

  const handleClearAll = useCallback(() => {
    setPattern("");
    setTestString("");
    setClickedMatchIndex(null);
  }, []);

  const handleTokenClick = useCallback(
    (token: string) => {
      setPattern((prev) => prev + token);
      regexInputRef.current?.focus();
    },
    []
  );

  const handleFocusPattern = useCallback(() => {
    regexInputRef.current?.focus();
  }, []);

  const handleMatchClick = useCallback((index: number) => {
    setClickedMatchIndex(index);
  }, []);

  const captureGroupCount = result.matches[0]
    ? result.matches[0].captures.length +
      Object.keys(result.matches[0].groups).length
    : 0;

  // Calculate which match is at which position for highlighting
  const matchPositions = useMemo(() => {
    const positions: Array<{ start: number; end: number; index: number }> = [];
    if (result.matches.length === 0) return positions;

    const sorted = [...result.matches].sort((a, b) => a.index - b.index);
    sorted.forEach((match, idx) => {
      positions.push({
        start: match.index,
        end: match.index + match.length,
        index: idx,
      });
    });
    return positions;
  }, [result.matches]);

  useKeyboardShortcuts({
    onCtrlK: handleFocusPattern,
    onCtrlEnter: handleCopyMatches,
    onCtrlS: () => {},
    onCtrlShiftC: handleClearAll,
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <TopBar
        theme={theme}
        onToggleTheme={toggleTheme}
        onFocusPattern={handleFocusPattern}
        onCopyMatches={handleCopyMatches}
      />

      <main className="pt-20 flex flex-col xl:flex-row min-h-[calc(100vh-80px)]">
        {/* Left Sidebar - Pattern Explainer */}
        <div className="w-full xl:min-w-[320px] xl:w-[350px] bg-[var(--color-bg-secondary)] xl:border-r border-[var(--color-border-subtle)] p-5 xl:h-[calc(100vh-80px)] xl:sticky xl:top-20 overflow-y-auto flex-shrink-0">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              Pattern Explainer
            </h3>
            <div className="w-full">
              <Explainer pattern={pattern} isValid={result.isValid} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-8 space-y-6 min-w-0">
          {/* Pattern Input Section */}
          <div className="space-y-4">
            <label className="text-base font-semibold text-[var(--color-text-secondary)]">
              Pattern
            </label>
            <RegexInput
              ref={regexInputRef}
              pattern={pattern}
              onChange={setPattern}
              isValid={result.isValid}
              error={result.error}
              flags={flags}
            />
            <FlagToggle flags={flags} onChange={setFlags} />
            <ErrorBanner error={result.error} />
          </div>

          {/* Test String Section */}
          <div className="space-y-3">
            <label className="text-base font-semibold text-[var(--color-text-secondary)]">
              Test String
            </label>
            <TestTextarea
              value={testString}
              onChange={setTestString}
              matchCount={result.matches.length}
            />
          </div>

          {/* Results Section */}
          {pattern && (
            <div className="space-y-4">
              <StatsBar
                matchCount={result.matches.length}
                captureGroupCount={captureGroupCount}
                evalTime={result.evalTime}
                patternLength={pattern.length}
                testStringLength={testString.length}
                isValid={result.isValid}
                pattern={pattern}
                flags={flags}
                onFlagsChange={setFlags}
                onCopyPattern={handleCopyPattern}
                onCopyMatches={handleCopyMatches}
                matches={result.matches}
              />
            </div>
          )}

          {testString && pattern && result.isValid && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-semibold text-[var(--color-text-secondary)] mb-3">
                  Highlighted Matches
                </h3>
                <MatchHighlighter
                  testString={testString}
                  matches={result.matches}
                  matchPositions={matchPositions}
                  clickedMatchIndex={clickedMatchIndex}
                  onMatchClick={handleMatchClick}
                />
              </div>

              {result.matches.length > 0 && (
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <MatchList
                      matches={result.matches}
                      onMatchClick={handleMatchClick}
                      clickedIndex={clickedMatchIndex}
                    />
                  </div>
                  {captureGroupCount > 0 && (
                    <div>
                      <GroupsPanel result={result} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar - Tools & Library */}
        <div className="w-full xl:min-w-[350px] xl:w-[380px] bg-[var(--color-bg-secondary)] xl:border-l border-[var(--color-border-subtle)] p-5 xl:h-[calc(100vh-80px)] xl:sticky xl:top-20 overflow-y-auto flex-shrink-0">
          <div className="space-y-1">
            <SidebarSection title="Saved Patterns">
              <SavedPatterns
                patterns={savedPatterns}
                currentPattern={pattern}
                currentFlags={flags}
                onLoad={loadPattern}
                onSave={savePattern}
                onDelete={deletePattern}
              />
            </SidebarSection>

            <SidebarSection title="Export">
              <ExportPanel
                result={result}
                pattern={pattern}
                flags={flags}
                testString={testString}
                disabled={!result.isValid}
              />
            </SidebarSection>

            <SidebarSection title="Quick Reference" defaultOpen={false}>
              <CheatSheet onTokenClick={handleTokenClick} />
            </SidebarSection>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-bg-primary)]" />}>
      <HomeContent />
    </Suspense>
  );
}