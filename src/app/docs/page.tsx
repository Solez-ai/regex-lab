"use client";

import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";
import { TopBar } from "@/components/layout/TopBar";

export default function DocsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <TopBar theme={theme} onToggleTheme={toggleTheme} />

      <main className="pt-24 max-w-4xl mx-auto px-8 py-10 space-y-10">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">
            RegexLab Documentation
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)]">
            A professional regex testing and learning tool for developers
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Getting Started
          </h2>
          <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 border border-[var(--color-border-subtle)]">
            <ol className="space-y-4 list-decimal list-inside text-lg text-[var(--color-text-secondary)]">
              <li>Enter a regex pattern in the main input field</li>
              <li>Type or paste test text in the textarea below</li>
              <li>View matches highlighted in real-time with alternating colors</li>
              <li>Learn by exploring the pattern explainer in the left sidebar</li>
              <li>Save frequently used patterns to your library</li>
            </ol>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Keyboard Shortcuts
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-4 p-4 bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border-subtle)]">
              <kbd className="px-3 py-2 bg-[var(--color-bg-tertiary)] rounded-lg text-sm font-mono text-[var(--color-accent)]">Ctrl+K</kbd>
              <span className="text-base text-[var(--color-text-secondary)]">Focus pattern input</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border-subtle)]">
              <kbd className="px-3 py-2 bg-[var(--color-bg-tertiary)] rounded-lg text-sm font-mono text-[var(--color-accent)]">Ctrl+Enter</kbd>
              <span className="text-base text-[var(--color-text-secondary)]">Copy all matches</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border-subtle)]">
              <kbd className="px-3 py-2 bg-[var(--color-bg-tertiary)] rounded-lg text-sm font-mono text-[var(--color-accent)]">Ctrl+Shift+C</kbd>
              <span className="text-base text-[var(--color-text-secondary)]">Clear pattern and test</span>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Regex Flags
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { flag: "g", name: "Global", desc: "Find all matches, not just the first" },
              { flag: "i", name: "Ignore Case", desc: "Case-insensitive matching" },
              { flag: "m", name: "Multiline", desc: "^ and $ match line boundaries" },
              { flag: "s", name: "DotAll", desc: ". matches newline characters" },
              { flag: "u", name: "Unicode", desc: "Enable full Unicode support" },
              { flag: "d", name: "Indices", desc: "Provide match start/end indices" },
            ].map((item) => (
              <div key={item.flag} className="p-5 bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xl font-bold text-[var(--color-accent)]">{item.flag}</span>
                  <span className="text-lg font-semibold text-[var(--color-text-primary)]">{item.name}</span>
                </div>
                <p className="text-sm text-[var(--color-text-muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Quick Reference
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <th className="text-left py-4 pr-6 font-medium text-[var(--color-text-muted)]">Token</th>
                  <th className="text-left py-4 pr-6 font-medium text-[var(--color-text-muted)]">Description</th>
                  <th className="text-left py-4 font-medium text-[var(--color-text-muted)]">Example</th>
                </tr>
              </thead>
              <tbody className="text-[var(--color-text-secondary)]">
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-3 pr-6 font-mono text-lg text-[var(--color-accent)]">.</td>
                  <td className="py-3 pr-6">Any character</td>
                  <td className="py-3 font-mono text-sm">a.c matches "abc"</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-3 pr-6 font-mono text-lg text-[var(--color-accent)]">\d</td>
                  <td className="py-3 pr-6">Digit (0-9)</td>
                  <td className="py-3 font-mono text-sm">\d matches "5"</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-3 pr-6 font-mono text-lg text-[var(--color-accent)]">\w</td>
                  <td className="py-3 pr-6">Word character</td>
                  <td className="py-3 font-mono text-sm">\w matches "a", "5"</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-3 pr-6 font-mono text-lg text-[var(--color-accent)]">\s</td>
                  <td className="py-3 pr-6">Whitespace</td>
                  <td className="py-3 font-mono text-sm">\s matches space</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-3 pr-6 font-mono text-lg text-[var(--color-accent)]">^ $</td>
                  <td className="py-3 pr-6">Start / End of string</td>
                  <td className="py-3 font-mono text-sm">^abc matches "abc..."</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-3 pr-6 font-mono text-lg text-[var(--color-accent)]">* + ?</td>
                  <td className="py-3 pr-6">Quantifiers</td>
                  <td className="py-3 font-mono text-sm">0+, 1+, optional</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-3 pr-6 font-mono text-lg text-[var(--color-accent)]">[abc]</td>
                  <td className="py-3 pr-6">Character set</td>
                  <td className="py-3 font-mono text-sm">[aeiou] matches vowel</td>
                </tr>
                <tr>
                  <td className="py-3 pr-6 font-mono text-lg text-[var(--color-accent)]">(abc)</td>
                  <td className="py-3 pr-6">Capturing group</td>
                  <td className="py-3 font-mono text-sm">(abc) captures</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="pt-8 border-t border-[var(--color-border-subtle)]">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-lg text-[var(--color-accent)] hover:text-[var(--color-accent-light)] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to RegexLab
          </Link>
        </section>
      </main>
    </div>
  );
}