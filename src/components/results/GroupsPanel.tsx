"use client";

import { useMemo } from "react";
import { RegexResult } from "@/types";

interface GroupsPanelProps {
  result: RegexResult;
}

export function GroupsPanel({ result }: GroupsPanelProps) {
  const captureGroups = useMemo(() => {
    if (result.matches.length === 0) return [];

    const firstMatch = result.matches[0];
    const groups: Array<{
      index: number;
      name: string | null;
      value: string | undefined;
    }> = [];

    firstMatch.captures.forEach((capture, idx) => {
      const groupNames = Object.keys(firstMatch.groups);
      let name: string | null = null;

      for (const groupName of groupNames) {
        if (firstMatch.groups[groupName] === capture) {
          name = groupName;
          break;
        }
      }

      groups.push({
        index: idx + 1,
        name,
        value: capture,
      });
    });

    return groups;
  }, [result]);

  if (captureGroups.length === 0) return null;

  return (
    <div className="mt-2">
      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
        Capture Groups
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)]">
              <th className="text-left py-1 pr-2 font-medium">#</th>
              <th className="text-left py-1 pr-2 font-medium">Name</th>
              <th className="text-left py-1 font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {captureGroups.map((group) => (
              <tr key={group.index} className="border-b border-[var(--color-border-subtle)]">
                <td className="py-1 pr-2 font-mono text-[var(--color-text-muted)]">
                  {group.index}
                </td>
                <td className="py-1 pr-2">
                  {group.name && (
                    <span className="text-[var(--color-accent-purple)] bg-[var(--color-accent-purple)]/10 px-1 rounded text-[10px]">
                      {group.name}
                    </span>
                  )}
                </td>
                <td className="py-1 font-mono text-[var(--color-text-primary)]">
                  {group.value ?? <span className="text-[var(--color-text-muted)]">-</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}