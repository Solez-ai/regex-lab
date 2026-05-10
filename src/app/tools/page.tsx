"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";
import { TopBar } from "@/components/layout/TopBar";
import { useRegex } from "@/hooks/useRegex";

const tools = [
  { id: "generator", name: "Pattern Generator", desc: "Generate common regex patterns with interactive options", icon: "zap" },
  { id: "validator", name: "Regex Validator", desc: "Check if your regex is valid and see detailed syntax breakdown", icon: "check" },
  { id: "diff", name: "Pattern Diff", desc: "Compare two regex patterns and see their differences", icon: "git" },
  { id: "visualizer", name: "Pattern Visualizer", desc: "Visualize regex as graph or tree format", icon: "eye" },
  { id: "benchmark", name: "Performance Test", desc: "Test regex performance against large text inputs", icon: "activity" },
  { id: "extract", name: "Data Extractor", desc: "Extract structured data using regex patterns", icon: "download" },
];

const patterns = [
  { name: "Email", pattern: "[\\w.+-]+@[\\w-]+\\.[\\w.]+", desc: "Match email addresses" },
  { name: "URL", pattern: "https?:\\/\\/[^\\s/$.?#][^\\s]*", desc: "Match HTTP/HTTPS URLs" },
  { name: "Phone", pattern: "\\+?[\\d\\s().-]{7,20}", desc: "International phone numbers" },
  { name: "IPv4", pattern: "(?:\\d{1,3}\\.){3}\\d{1,3}", desc: "IPv4 addresses" },
  { name: "Date (ISO)", pattern: "\\d{4}-\\d{2}-\\d{2}", desc: "YYYY-MM-DD format" },
  { name: "Time (24h)", pattern: "([01]\\d|2[0-3]):[0-5]\\d(:[0-5]\\d)?", desc: "24-hour time format" },
  { name: "Hex Color", pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b", desc: "CSS hex colors" },
  { name: "UUID", pattern: "[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}", desc: "UUID v4 format" },
  { name: "HTML Tag", pattern: "<([a-z][a-z0-9]*)\\b[^>]*>", desc: "HTML opening tags" },
  { name: "Credit Card", pattern: "(?:\\d{4}[\\s-]?){3}\\d{4}", desc: "Credit card numbers" },
  { name: "Slug", pattern: "[a-z0-9]+(?:-[a-z0-9]+)*", desc: "URL-friendly slugs" },
  { name: "SemVer", pattern: "v?\\d+\\.\\d+\\.\\d+(?:-[\\w.]+)?", desc: "Semantic versioning" },
];

const Icon = ({ name, className = "" }: { name: string; className?: string }) => {
  const icons: Record<string, React.ReactNode> = {
    zap: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    check: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    git: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>,
    eye: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
    activity: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    download: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    copy: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>,
    zoomIn: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
    zoomOut: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  };
  return icons[name] || null;
};

function PatternGenerator() {
  const [patternType, setPatternType] = useState("email");
  const [customChars, setCustomChars] = useState("");
  const [minLen, setMinLen] = useState(1);
  const [maxLen, setMaxLen] = useState(10);
  const [generated, setGenerated] = useState("");

  const generate = () => {
    const patterns: Record<string, string> = {
      email: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
      phone: "\\+?[1-9]\\d{1,14}",
      url: "https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)",
      ipv4: "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)",
      date: "(?:0[1-9]|1[0-2])[\\/](0[1-9]|[12][0-9]|3[01])[\\/](?:19|20)\\d{2}",
      time: "(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d)?",
      hex: "#(?:[0-9a-fA-F]{3}){1,2}\\b",
      alphanumeric: `[a-zA-Z0-9]{${minLen},${maxLen}}`,
      custom: customChars ? `[${customChars.replace(/[-\[\]]/g, '\\$&')}]+` : "",
    };
    setGenerated(patterns[patternType] || "");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {["email", "phone", "url", "ipv4", "date", "time", "hex", "alphanumeric", "custom"].map((t) => (
          <button key={t} onClick={() => setPatternType(t)} className={`px-4 py-2 text-sm rounded-lg transition-colors ${patternType === t ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)]"}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {patternType === "custom" && (
        <input type="text" value={customChars} onChange={(e) => setCustomChars(e.target.value)} placeholder="Enter characters (e.g., abc123)" className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] rounded-lg text-sm" />
      )}
      {(patternType === "alphanumeric" || patternType === "custom") && (
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-xs text-[var(--color-text-muted)] block mb-1">Min Length</label>
            <input type="number" value={minLen} onChange={(e) => setMinLen(Number(e.target.value))} className="w-full px-3 py-2 bg-[var(--color-bg-tertiary)] rounded text-sm" />
          </div>
          <div className="flex-1">
            <label className="text-xs text-[var(--color-text-muted)] block mb-1">Max Length</label>
            <input type="number" value={maxLen} onChange={(e) => setMaxLen(Number(e.target.value))} className="w-full px-3 py-2 bg-[var(--color-bg-tertiary)] rounded text-sm" />
          </div>
        </div>
      )}
      <button onClick={generate} className="w-full py-3 bg-[var(--color-accent)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-accent-light)] transition-colors">
        Generate Pattern
      </button>
      {generated && (
        <div className="p-4 bg-[var(--color-bg-tertiary)] rounded-lg">
          <code className="text-sm text-[var(--color-accent)] break-all">{generated}</code>
        </div>
      )}
    </div>
  );
}

function RegexValidator() {
  const [pattern, setPattern] = useState("");
  const { result } = useRegex(pattern, "g", "test");
  const isValid = result.isValid && pattern.length > 0;

  return (
    <div className="space-y-5">
      <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Enter regex to validate..." className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] rounded-lg text-sm font-mono" />
      {pattern && (
        <div className={`p-4 rounded-lg ${isValid ? "bg-[var(--color-success)]/10" : "bg-[var(--color-error)]/10"}`}>
          <div className="flex items-center gap-3">
            {isValid ? <Icon name="check" className="text-[var(--color-success)]" /> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
            <span className={`text-sm font-medium ${isValid ? "text-[var(--color-success)]" : "text-[var(--color-error)]"}`}>
              {isValid ? "Valid regex" : result.error || "Invalid regex"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function PatternDiff() {
  const [pattern1, setPattern1] = useState("");
  const [pattern2, setPattern2] = useState("");
  const [diff, setDiff] = useState<{ added: string[]; removed: string[] }>({ added: [], removed: [] });

  const compare = () => {
    const p1 = new Set(pattern1.split(""));
    const p2 = new Set(pattern2.split(""));
    const added = [...p2].filter(x => !p1.has(x));
    const removed = [...p1].filter(x => !p2.has(x));
    setDiff({ added, removed });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4">
        <input type="text" value={pattern1} onChange={(e) => setPattern1(e.target.value)} placeholder="First pattern..." className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] rounded-lg text-sm font-mono" />
        <input type="text" value={pattern2} onChange={(e) => setPattern2(e.target.value)} placeholder="Second pattern..." className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] rounded-lg text-sm font-mono" />
      </div>
      <button onClick={compare} className="w-full py-3 bg-[var(--color-accent)] text-white rounded-lg text-sm font-semibold">Compare</button>
      {pattern1 && pattern2 && (
        <div className="space-y-3">
          {diff.added.length > 0 && (
            <div className="p-4 bg-[var(--color-success)]/10 rounded-lg">
              <div className="text-xs font-semibold text-[var(--color-success)] mb-2">Added Characters</div>
              <div className="flex flex-wrap gap-2">
                {diff.added.map(c => <span key={c} className="px-2 py-1 bg-[var(--color-success)]/20 rounded font-mono text-sm text-[var(--color-success)]">{c}</span>)}
              </div>
            </div>
          )}
          {diff.removed.length > 0 && (
            <div className="p-4 bg-[var(--color-error)]/10 rounded-lg">
              <div className="text-xs font-semibold text-[var(--color-error)] mb-2">Removed Characters</div>
              <div className="flex flex-wrap gap-2">
                {diff.removed.map(c => <span key={c} className="px-2 py-1 bg-[var(--color-error)]/20 rounded font-mono text-sm text-[var(--color-error)]">{c}</span>)}
              </div>
            </div>
          )}
          {diff.added.length === 0 && diff.removed.length === 0 && (
            <div className="p-4 bg-[var(--color-bg-tertiary)] rounded-lg text-sm text-[var(--color-text-muted)]">Patterns are identical</div>
          )}
        </div>
      )}
    </div>
  );
}

function PatternVisualizer() {
  const [pattern, setPattern] = useState("");
  const [mode, setMode] = useState<"graph" | "tree">("graph");
  const { result } = useRegex(pattern, "g", "test");

  // Parse pattern into nodes for visualization
  const nodes = React.useMemo(() => {
    if (!pattern) return [];
    const nodes: Array<{ id: number; char: string; type: string }> = [];
    for (let i = 0; i < pattern.length; i++) {
      let char = pattern[i];
      let type = "literal";
      if (char.match(/[()[\]|*+?^$.]/)) type = "special";
      if (char === "\\" && i + 1 < pattern.length) { type = "escape"; char = pattern.slice(i, i+2); i++; }
      if (result.matches.length > 0 && result.matches.some(m => m.value.includes(char))) type = "match";
      nodes.push({ id: i, char, type });
    }
    return nodes;
  }, [pattern, result.matches]);

  // Parse to tree structure
  const treeData = React.useMemo(() => {
    if (!pattern) return [];
    const tokens: Array<{ type: string; value: string; depth: number }> = [];
    let depth = 0;
    for (let i = 0; i < pattern.length; i++) {
      let char = pattern[i];
      if (char === "(") { tokens.push({ type: "group", value: "(", depth }); depth++; }
      else if (char === ")") { depth--; tokens.push({ type: "group", value: ")", depth }); }
      else if (char === "[") { let end = pattern.indexOf("]", i); if (end !== -1) { tokens.push({ type: "class", value: pattern.slice(i, end + 1), depth }); i = end; } }
      else if (char === "\\" && i + 1 < pattern.length) { tokens.push({ type: "escape", value: "\\" + pattern[i + 1], depth }); i++; }
      else if (char === "|") tokens.push({ type: "alternation", value: "|", depth });
      else if (char === "*" || char === "+" || char === "?") tokens.push({ type: "quantifier", value: char, depth });
      else if (char === "^" || char === "$") tokens.push({ type: "anchor", value: char, depth });
      else tokens.push({ type: "literal", value: char, depth });
    }
    return tokens;
  }, [pattern]);

  return (
    <div className="space-y-5">
      <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Enter pattern to visualize..." className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] rounded-lg text-sm font-mono" />

      {pattern && result.isValid && (
        <>
          <div className="flex gap-2">
            <button onClick={() => setMode("graph")} className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${mode === "graph" ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]"}`}>Graph Mode</button>
            <button onClick={() => setMode("tree")} className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${mode === "tree" ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]"}`}>Tree Mode</button>
          </div>

          {mode === "graph" && (
            <div className="bg-[var(--color-bg-tertiary)] rounded-xl p-6 overflow-x-auto">
              <div className="flex items-center gap-2 min-w-max">
                {nodes.map((node, i) => (
                  <React.Fragment key={i}>
                    <div className={`flex flex-col items-center gap-2`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-mono font-bold text-lg ${
                        node.type === "match" ? "bg-[var(--color-node-match)] text-white" :
                        node.type === "special" ? "bg-[var(--color-node-group)] text-white" :
                        node.type === "escape" ? "bg-yellow-500 text-white" :
                        "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border-default)]"
                      }`}>
                        {node.char}
                      </div>
                      <span className="text-[10px] text-[var(--color-text-muted)] uppercase">{node.type}</span>
                    </div>
                    {i < nodes.length - 1 && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" className="flex-shrink-0">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex items-center gap-6 mt-6 pt-4 border-t border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[var(--color-node-match)]"></div><span className="text-xs text-[var(--color-text-muted)]">Match</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[var(--color-node-group)]"></div><span className="text-xs text-[var(--color-text-muted)]">Special</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-yellow-500"></div><span className="text-xs text-[var(--color-text-muted)]">Escape</span></div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)]"></div><span className="text-xs text-[var(--color-text-muted)]">Literal</span></div>
              </div>
            </div>
          )}

          {mode === "tree" && (
            <div className="bg-[var(--color-bg-tertiary)] rounded-xl p-6 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {treeData.map((token, i) => (
                  <div key={i} className="flex items-center gap-2" style={{ marginLeft: token.depth * 24 }}>
                    <div className={`px-3 py-1.5 rounded-lg font-mono text-sm ${
                      token.type === "match" ? "bg-[var(--color-node-match)]/20 text-[var(--color-node-match)]" :
                      token.type === "group" ? "bg-[var(--color-node-group)]/20 text-[var(--color-node-group)]" :
                      token.type === "quantifier" ? "bg-orange-500/20 text-orange-400" :
                      token.type === "escape" ? "bg-yellow-500/20 text-yellow-400" :
                      token.type === "anchor" ? "bg-blue-500/20 text-blue-400" :
                      "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]"
                    }`}>
                      {token.value}
                    </div>
                    <span className="text-[10px] text-[var(--color-text-muted)] uppercase">{token.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PerformanceTest() {
  const [pattern, setPattern] = useState("\\d+");
  const [testString, setTestString] = useState("1234567890");
  const [iterations, setIterations] = useState(1000);
  const [result, setResult] = useState<{ time: number; matches: number } | null>(null);

  const benchmark = () => {
    const start = performance.now();
    try {
      const regex = new RegExp(pattern, "g");
      let count = 0;
      for (let i = 0; i < iterations; i++) {
        const matches = testString.match(regex);
        count = matches ? matches.length : 0;
      }
      const time = performance.now() - start;
      setResult({ time, matches: count });
    } catch { setResult({ time: -1, matches: 0 }); }
  };

  return (
    <div className="space-y-5">
      <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Pattern..." className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] rounded-lg text-sm font-mono" />
      <input type="text" value={testString} onChange={(e) => setTestString(e.target.value)} placeholder="Test string..." className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] rounded-lg text-sm font-mono" />
      <div className="flex items-center gap-3">
        <span className="text-sm text-[var(--color-text-muted)]">Iterations:</span>
        <input type="number" value={iterations} onChange={(e) => setIterations(Number(e.target.value))} className="w-32 px-3 py-2 bg-[var(--color-bg-tertiary)] rounded text-sm" />
      </div>
      <button onClick={benchmark} className="w-full py-3 bg-[var(--color-accent)] text-white rounded-lg text-sm font-semibold">Run Benchmark</button>
      {result && (
        <div className="p-5 bg-[var(--color-bg-tertiary)] rounded-lg">
          {result.time === -1 ? <span className="text-sm text-[var(--color-error)]">Invalid pattern</span> : (
            <div className="grid grid-cols-2 gap-4">
              <div><div className="text-xs text-[var(--color-text-muted)]">Total Time</div><div className="text-xl font-bold text-[var(--color-accent)]">{result.time.toFixed(2)}ms</div></div>
              <div><div className="text-xs text-[var(--color-text-muted)]">Avg per Run</div><div className="text-xl font-bold text-[var(--color-text-primary)]">{(result.time / iterations).toFixed(4)}ms</div></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DataExtractor() {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [extracted, setExtracted] = useState<string[]>([]);

  const extract = () => {
    try {
      const regex = new RegExp(pattern, "g");
      const matches = testString.match(regex);
      setExtracted(matches || []);
    } catch { setExtracted([]); }
  };

  return (
    <div className="space-y-5">
      <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Extraction pattern..." className="w-full px-4 py-3 bg-[var(--color-bg-tertiary)] rounded-lg text-sm font-mono" />
      <textarea value={testString} onChange={(e) => setTestString(e.target.value)} placeholder="Text to extract from..." className="w-full h-32 px-4 py-3 bg-[var(--color-bg-tertiary)] rounded-lg text-sm font-mono resize-none" />
      <button onClick={extract} className="w-full py-3 bg-[var(--color-accent)] text-white rounded-lg text-sm font-semibold">Extract Data</button>
      {extracted.length > 0 && (
        <div className="p-4 bg-[var(--color-bg-tertiary)] rounded-lg space-y-2 max-h-48 overflow-y-auto">
          {extracted.map((m, i) => <div key={i} className="flex items-center gap-3 p-2 bg-[var(--color-bg-secondary)] rounded"><span className="text-xs text-[var(--color-text-muted)] w-6">{i + 1}.</span><code className="text-sm text-[var(--color-accent)]">{m}</code></div>)}
        </div>
      )}
    </div>
  );
}

export default function ToolsPage() {
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const router = useRouter();

  const filteredPatterns = patterns.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()) || p.pattern.toLowerCase().includes(search.toLowerCase()));

  const handlePatternClick = (pattern: string) => { router.push(`/?pattern=${encodeURIComponent(pattern)}`); };

  const toolsContent: Record<string, React.ReactNode> = {
    generator: <PatternGenerator />,
    validator: <RegexValidator />,
    diff: <PatternDiff />,
    visualizer: <PatternVisualizer />,
    benchmark: <PerformanceTest />,
    extract: <DataExtractor />,
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <TopBar theme={theme} onToggleTheme={toggleTheme} />

      <main className="pt-24 max-w-6xl mx-auto p-6 lg:p-8 space-y-10">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">Regex Tools</h1>
          <p className="text-lg text-[var(--color-text-secondary)]">Utilities and helpers for working with regular expressions</p>
        </div>

        <section className="space-y-5">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Regex Utilities</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool) => (
              <button key={tool.id} onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)} className={`p-6 bg-[var(--color-bg-secondary)] rounded-xl border text-left transition-all hover:border-[var(--color-accent)]/50 ${activeTool === tool.id ? "border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/20" : "border-[var(--color-border-subtle)]"}`}>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[var(--color-accent)]/10 rounded-xl text-[var(--color-accent)]"><Icon name={tool.icon} /></div>
                  <div>
                    <h3 className="font-semibold text-lg text-[var(--color-text-primary)] mb-2">{tool.name}</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">{tool.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {activeTool && (
          <section className="p-8 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border-subtle)]">
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">{tools.find(t => t.id === activeTool)?.name}</h3>
            {toolsContent[activeTool]}
          </section>
        )}

        <section className="space-y-5">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Common Patterns Library</h2>
          <p className="text-sm text-[var(--color-text-muted)]">Click any pattern to test it in the main tester</p>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patterns..." className="w-full px-5 py-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl text-base outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50" />
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredPatterns.map((p) => (
              <button key={p.name} onClick={() => handlePatternClick(p.pattern)} className="group p-5 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-bg-tertiary)] transition-all text-left">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-lg text-[var(--color-text-primary)]">{p.name}</span>
                  <div className="flex items-center gap-2 text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity"><Icon name="copy" /><span className="text-sm">Try</span></div>
                </div>
                <code className="block font-mono text-sm text-[var(--color-accent)] truncate mb-2">{p.pattern}</code>
                <span className="text-sm text-[var(--color-text-muted)]">{p.desc}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Quick Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <th className="text-left py-4 pr-6 font-medium text-[var(--color-text-muted)]">Token</th>
                  <th className="text-left py-4 pr-6 font-medium text-[var(--color-text-muted)]">Matches</th>
                  <th className="text-left py-4 font-medium text-[var(--color-text-muted)]">Example</th>
                </tr>
              </thead>
              <tbody className="text-[var(--color-text-secondary)]">
                <tr className="border-b border-[var(--color-border-subtle)]"><td className="py-3 pr-6 font-mono text-lg text-[var(--color-accent)]">.</td><td className="py-3 pr-6">Any character</td><td className="py-3 font-mono text-sm">a.c</td></tr>
                <tr className="border-b border-[var(--color-border-subtle)]"><td className="py-3 pr-6 font-mono text-lg text-[var(--color-accent)]">\d</td><td className="py-3 pr-6">Digit</td><td className="py-3 font-mono text-sm">\d</td></tr>
                <tr className="border-b border-[var(--color-border-subtle)]"><td className="py-3 pr-6 font-mono text-lg text-[var(--color-accent)]">\w</td><td className="py-3 pr-6">Word character</td><td className="py-3 font-mono text-sm">\w</td></tr>
                <tr className="border-b border-[var(--color-border-subtle)]"><td className="py-3 pr-6 font-mono text-lg text-[var(--color-accent)]">[abc]</td><td className="py-3 pr-6">Character set</td><td className="py-3 font-mono text-sm">[aeiou]</td></tr>
                <tr className="border-b border-[var(--color-border-subtle)]"><td className="py-3 pr-6 font-mono text-lg text-[var(--color-accent)]">*+</td><td className="py-3 pr-6">Quantifiers</td><td className="py-3 font-mono text-sm">0+, 1+</td></tr>
                <tr><td className="py-3 pr-6 font-mono text-lg text-[var(--color-accent)]">^$</td><td className="py-3 pr-6">Anchors</td><td className="py-3 font-mono text-sm">Start/End</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}