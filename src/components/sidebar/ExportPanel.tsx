"use client";

import { useState } from "react";
import { RegexResult } from "@/types";
import { exportAsJSON, exportAsCSV } from "@/lib/exporter";

interface ExportPanelProps {
  result: RegexResult;
  pattern: string;
  flags: string;
  testString: string;
  disabled?: boolean;
}

export function ExportPanel({
  result,
  pattern,
  flags,
  testString,
  disabled = false,
}: ExportPanelProps) {
  const [copied, setCopied] = useState(false);

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleJSONExport = () => {
    const json = exportAsJSON(result, pattern, flags, testString);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    downloadFile(json, `regexlab-export-${timestamp}.json`, "application/json");
  };

  const handleCSVExport = () => {
    const csv = exportAsCSV(result);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    downloadFile(csv, `regexlab-export-${timestamp}.csv`, "text/csv");
  };

  const handleCopy = async () => {
    const matchValues = result.matches.map((m) => m.value).join("\n");
    await navigator.clipboard.writeText(matchValues);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isDisabled = disabled || result.matches.length === 0;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={handleJSONExport}
        disabled={isDisabled}
        className="px-2 py-1 text-xs bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] rounded hover:bg-[var(--color-border-subtle)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        JSON
      </button>
      <button
        onClick={handleCSVExport}
        disabled={isDisabled}
        className="px-2 py-1 text-xs bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] rounded hover:bg-[var(--color-border-subtle)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        CSV
      </button>
      <button
        onClick={handleCopy}
        disabled={isDisabled}
        className="px-2 py-1 text-xs bg-[var(--color-accent)] text-white rounded hover:bg-[var(--color-accent-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}